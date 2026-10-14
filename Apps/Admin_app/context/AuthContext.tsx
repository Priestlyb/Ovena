/**
 * context/AuthContext.tsx
 *
 * Provides the authenticated admin session to every screen in the app.
 *
 * Behaviour:
 *  - On mount, attempts to rehydrate a previous session from AsyncStorage
 *    so the admin isn't logged out every time the app cold-starts.
 *  - If a cached user is found, it's shown immediately (optimistic), then
 *    validated against the server in the background — same "show stale,
 *    refresh in background" pattern as AppDataContext.
 *  - `login()` calls the auth API, persists tokens + user, and updates state.
 *  - `logout()` clears everything (server + AsyncStorage + state).
 *  - `isAuthenticated` is the single source of truth other parts of the app
 *    (e.g. a root navigator) should branch on to decide login vs. app stack.
 *
 * Every step of rehydration, login, logout, and session refresh is logged
 * to the console — cache reads, token expiry checks, network calls,
 * persistence writes, and the final outcome of each flow. This mirrors the
 * logging convention used in services/authApi.ts and AppDataContext.tsx,
 * so an auth-related bug (stuck on splash, unexpected logout, session not
 * persisting) can be diagnosed by reading the Metro log top-to-bottom.
 *
 * Usage:
 *   // Wrap the root layout (above AppDataProvider, since AppData often
 *   // needs the access token):
 *   <AuthProvider>
 *     <AppDataProvider>
 *       ...
 *     </AppDataProvider>
 *   </AuthProvider>
 *
 *   // Consume anywhere:
 *   const { user, isAuthenticated, login, logout } = useAuth();
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  login as loginRequest,
  logout as logoutRequest,
  fetchCurrentUser,
  refreshTokens,
  AuthApiError,
} from '../services/authApi';
import {
  AdminUser,
  AuthTokens,
  LoginCredentials,
} from '../types/auth';

// ─── Storage keys ─────────────────────────────────────────────────────────────
const USER_CACHE_KEY   = 'ovena_auth_user_v1';
const TOKENS_STORE_KEY = 'ovena_auth_tokens_v1';
// Kept as a flat key too, since some legacy/API code (and the AppDataContext
// pattern this mirrors) reads "accessToken" directly.
const ACCESS_TOKEN_KEY  = 'accessToken';
const LOG_TAG            = '[AuthContext]';

// ─── Context shape ────────────────────────────────────────────────────────────
interface AuthContextValue {
  user:             AdminUser | null;
  tokens:           AuthTokens | null;
  isAuthenticated:  boolean;
  /** True only during the very first session rehydration on app launch */
  initializing:     boolean;
  /** True while a login/logout request is in flight */
  loading:          boolean;
  error:            string | null;
  login:            (credentials: LoginCredentials) => Promise<void>;
  logout:           () => Promise<void>;
  /** Re-validates the cached session against the server */
  refreshSession:   () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user:            null,
  tokens:          null,
  isAuthenticated: false,
  initializing:    true,
  loading:         false,
  error:           null,
  login:           async () => {},
  logout:          async () => {},
  refreshSession:  async () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]                 = useState<AdminUser | null>(null);
  const [tokens, setTokens]             = useState<AuthTokens | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  // ── Persist helpers ──────────────────────────────────────────────────────
  const persistSession = useCallback(async (nextUser: AdminUser, nextTokens: AuthTokens) => {
    console.log(`${LOG_TAG} 💾 Persisting session for user:`, nextUser.name, `(${nextUser.phone})`);
    await Promise.all([
      AsyncStorage.setItem(USER_CACHE_KEY,  JSON.stringify(nextUser)),
      AsyncStorage.setItem(TOKENS_STORE_KEY, JSON.stringify(nextTokens)),
      AsyncStorage.setItem(ACCESS_TOKEN_KEY, nextTokens.accessToken),
    ]);
    console.log(`${LOG_TAG} ✅ Session persisted to AsyncStorage`);
  }, []);

  const clearSession = useCallback(async () => {
    console.log(`${LOG_TAG} 🗑️ Clearing session from state + AsyncStorage`);
    await Promise.all([
      AsyncStorage.removeItem(USER_CACHE_KEY),
      AsyncStorage.removeItem(TOKENS_STORE_KEY),
      AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
    ]);
    setUser(null);
    setTokens(null);
    console.log(`${LOG_TAG} ✅ Session cleared`);
  }, []);

  // ── Rehydrate on launch ──────────────────────────────────────────────────
  const rehydrate = useCallback(async () => {
    console.log(`${LOG_TAG} 🔄 rehydrate() starting`);
    try {
      console.log(`${LOG_TAG} 📦 Reading cached user + tokens from AsyncStorage`);
      const [cachedUserRaw, cachedTokensRaw] = await Promise.all([
        AsyncStorage.getItem(USER_CACHE_KEY),
        AsyncStorage.getItem(TOKENS_STORE_KEY),
      ]);

      if (!cachedUserRaw || !cachedTokensRaw) {
        console.log(`${LOG_TAG} ℹ️ No cached session found — staying logged out`);
        setInitializing(false);
        return;
      }

      const cachedUser   = JSON.parse(cachedUserRaw)   as AdminUser;
      const cachedTokens = JSON.parse(cachedTokensRaw) as AuthTokens;
      console.log(`${LOG_TAG} ✅ Cached session found for:`, cachedUser.name, `(${cachedUser.phone})`);

      // 1. Show stale session immediately so the admin isn't bounced to login
      setUser(cachedUser);
      setTokens(cachedTokens);
      setInitializing(false);
      console.log(`${LOG_TAG} 👤 Stale session applied optimistically — validating in background`);

      // 2. Validate / refresh in the background
      const isExpired = Date.now() >= cachedTokens.expiresAt;
      console.log(
        `${LOG_TAG} ⏱️ Access token expiry check:`,
        isExpired ? 'EXPIRED — refreshing' : 'still valid',
        `(expiresAt: ${new Date(cachedTokens.expiresAt).toISOString()})`,
      );

      const validTokens = isExpired
        ? await refreshTokens(cachedTokens.refreshToken)
        : cachedTokens;

      if (isExpired) {
        console.log(`${LOG_TAG} ✅ Token refreshed successfully`);
        setTokens(validTokens);
      }

      // Logged unconditionally on every app reload — whether the token was
      // just refreshed above or the cached one was still valid — so the
      // current session's tokens are always visible in the Metro log after
      // rehydrate() runs, not just on a refresh event.
      console.log(`${LOG_TAG} 🔑🔑🔑 TOKENS ON RELOAD (rehydrate) 🔑🔑🔑`);
      console.log(`${LOG_TAG}   ACCESS TOKEN: `, validTokens.accessToken);
      console.log(`${LOG_TAG}   REFRESH TOKEN:`, validTokens.refreshToken);
      console.log(`${LOG_TAG}   Source:       `, isExpired ? 'refreshed just now via /api/admin/refresh/' : 'cached token, still valid');
      console.log(`${LOG_TAG} 🔑🔑🔑──────────────────────────────🔑🔑🔑`);

      console.log(`${LOG_TAG} 🌐 Fetching current user to confirm session is still valid server-side`);
      const freshUser = await fetchCurrentUser(validTokens.accessToken);
      console.log(`${LOG_TAG} ✅ Session confirmed valid for:`, freshUser.name);

      setUser(freshUser);
      await persistSession(freshUser, validTokens);
    } catch (err) {
      const status = err instanceof AuthApiError ? err.status : undefined;
      const isAuthFailure = status === 401 || status === 403;

      if (isAuthFailure) {
        console.error(
          `${LOG_TAG} ❌ rehydrate() failed — session rejected by server (HTTP ${status}), logging out:`,
          (err as Error).message,
        );
        await clearSession();
      } else {
        console.warn(
          `${LOG_TAG} ⚠️ rehydrate() background validation failed (non-auth error) — ` +
          `keeping the optimistically-applied stale session instead of logging out:`,
          (err as Error).message,
        );
      }
    } finally {
      setInitializing(false);
      console.log(`${LOG_TAG} 🏁 rehydrate() finished`);
    }
  }, [persistSession, clearSession]);

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  // ── Public actions ───────────────────────────────────────────────────────
  const login = useCallback(async (credentials: LoginCredentials) => {
    console.log(`${LOG_TAG} 🔑 login() called for phone:`, credentials.phone);
    setLoading(true);
    setError(null);
    try {
      const { user: nextUser, tokens: nextTokens } = await loginRequest(credentials);
      console.log(`${LOG_TAG} ✅ login() succeeded for:`, nextUser.name);
      console.log(`${LOG_TAG} 🔑 Access token: `, nextTokens.accessToken);
      console.log(`${LOG_TAG} 🔑 Refresh token:`, nextTokens.refreshToken);
      setUser(nextUser);
      setTokens(nextTokens);
      await persistSession(nextUser, nextTokens);
    } catch (err) {
      const message = err instanceof AuthApiError
        ? err.message
        : 'Unable to sign in. Check your connection and try again.';
      console.error(`${LOG_TAG} ❌ login() failed:`, message, err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
      console.log(`${LOG_TAG} 🏁 login() finished`);
    }
  }, [persistSession]);

  const logout = useCallback(async () => {
    console.log(`${LOG_TAG} 🚪 logout() called`);
    setLoading(true);
    try {
      if (tokens) {
        console.log(`${LOG_TAG} 🌐 Notifying server of logout`);
        await logoutRequest(tokens.accessToken);
      }
    } finally {
      await clearSession();
      setLoading(false);
      console.log(`${LOG_TAG} 🏁 logout() finished`);
    }
  }, [tokens, clearSession]);

  const refreshSession = useCallback(async () => {
    if (!tokens) {
      console.log(`${LOG_TAG} ⏸️ refreshSession() called with no tokens — skipping`);
      return;
    }
    console.log(`${LOG_TAG} 🔄 refreshSession() starting`);
    setLoading(true);
    setError(null);
    try {
      const isExpired = Date.now() >= tokens.expiresAt;
      console.log(
        `${LOG_TAG} ⏱️ Access token expiry check:`,
        isExpired ? 'EXPIRED — refreshing' : 'still valid',
      );

      const validTokens = isExpired
        ? await refreshTokens(tokens.refreshToken)
        : tokens;

      if (isExpired) {
        console.log(`${LOG_TAG} 🔑 New access token: `, validTokens.accessToken);
        console.log(`${LOG_TAG} 🔑 New refresh token:`, validTokens.refreshToken);
      }

      console.log(`${LOG_TAG} 🌐 Fetching current user`);
      const freshUser = await fetchCurrentUser(validTokens.accessToken);
      console.log(`${LOG_TAG} ✅ refreshSession() succeeded for:`, freshUser.name);

      setUser(freshUser);
      setTokens(validTokens);
      await persistSession(freshUser, validTokens);
    } catch (err) {
      console.error(`${LOG_TAG} ❌ refreshSession() failed:`, (err as Error).message);
      setError((err as Error).message ?? 'Failed to refresh session');
    } finally {
      setLoading(false);
      console.log(`${LOG_TAG} 🏁 refreshSession() finished`);
    }
  }, [tokens, persistSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated: !!user && !!tokens,
        initializing,
        loading,
        error,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);