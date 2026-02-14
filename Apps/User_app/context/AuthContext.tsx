// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

type AuthStatus =
  | "booting"
  | "unauthenticated"
  | "signup_pending"
  | "authenticated"
  | "guest";

type AuthMethod = "otp" | "google" | "apple" | null;

type StoredAuth = {
  accessToken: string | null;
  refreshToken: string | null;
  authMethod: AuthMethod;
  isNewUser: boolean;
};

type AuthContextType = {
  authStatus: AuthStatus;
  accessToken: string | null;
  authMethod: AuthMethod;
  signupRoute: string | null;

  loginWithOAuth: (
    provider: "google" | "apple",
    access: string,
    refresh: string | null,
    isNewUser: boolean
  ) => Promise<void>;

  loginWithOtp: (
    access: string,
    refresh: string | null,
    isNewUser: boolean
  ) => Promise<void>;

  completeOAuthSignup: (data: { access: string; refresh: string | null }) => Promise<void>;
  completeOtpSignup: () => Promise<void>;

  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null!);

const AUTH_KEY = "auth_state";
const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

/* ---------------- UTILS ---------------- */
const isExpired = (token: string) => {
  try {
    const { exp }: any = jwtDecode(token);
    return exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

/* ---------------- PROVIDER ---------------- */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("booting");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [signupRoute, setSignupRoute] = useState<string | null>(null);

  /* ---------------- BOOTSTRAP ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(AUTH_KEY);
        if (!stored) {
          setAuthStatus("unauthenticated");
          return;
        }

        const parsed: StoredAuth = JSON.parse(stored);
        if (parsed.accessToken && !isExpired(parsed.accessToken)) {
          setAccessToken(parsed.accessToken);
          setAuthMethod(parsed.authMethod);
          if (parsed.isNewUser) {
            const route = parsed.authMethod === "otp" ? "/OtpSignUpForm" : "/GoogleSignUpForm";
            setSignupRoute(route);
            setAuthStatus("signup_pending");
          } else {
            setAuthStatus("authenticated");
          }
          return;
        }

        if (parsed.refreshToken) {
          const res = await fetch(`${BASE_URL}/accounts/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: parsed.refreshToken }),
          });

          if (res.ok) {
            const data = await res.json();
            const updated = { ...parsed, accessToken: data.access };
            await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(updated));

            setAccessToken(data.access);
            setAuthMethod(parsed.authMethod);
            if (parsed.isNewUser) {
              const route = parsed.authMethod === "otp" ? "/OtpSignUpForm" : "/GoogleSignUpForm";
              setSignupRoute(route);
              setAuthStatus("signup_pending");
            } else {
              setAuthStatus("authenticated");
            }
            return;
          }
        }

        await SecureStore.deleteItemAsync(AUTH_KEY);
        setAuthStatus("unauthenticated");
      } catch (err) {
        console.log("❌ Bootstrap error:", err);
        setAuthStatus("unauthenticated");
      }
    })();
  }, []);

  /* ---------------- LOGIN METHODS ---------------- */
  const loginWithOAuth = async (
    provider: "google" | "apple",
    access: string,
    refresh: string | null,
    isNewUser: boolean
  ) => {
    const payload: StoredAuth = { accessToken: access, refreshToken: refresh, authMethod: provider, isNewUser };
    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(payload));

    setAccessToken(access);
    setAuthMethod(provider);
    setSignupRoute(isNewUser ? "/GoogleSignUpForm" : null);
    setAuthStatus(isNewUser ? "signup_pending" : "authenticated");
  };

  const loginWithOtp = async (access: string, refresh: string | null, isNewUser: boolean) => {
    const payload: StoredAuth = { accessToken: access, refreshToken: refresh, authMethod: "otp", isNewUser };
    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(payload));

    setAccessToken(access);
    setAuthMethod("otp");
    setSignupRoute(isNewUser ? "/OtpSignUpForm" : null);
    setAuthStatus(isNewUser ? "signup_pending" : "authenticated");
  };

  /* ---------------- COMPLETE SIGNUP ---------------- */
  const completeOAuthSignup = async (data: { access: string; refresh: string | null }) => {
    const payload: StoredAuth = { accessToken: data.access, refreshToken: data.refresh, authMethod: "google", isNewUser: false };
    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(payload));

    setAccessToken(data.access);
    setAuthMethod("google");
    setSignupRoute(null);
    setAuthStatus("authenticated");
  };

  const completeOtpSignup = async () => {
    const stored = await SecureStore.getItemAsync(AUTH_KEY);
    if (!stored) return;
    const parsed: StoredAuth = JSON.parse(stored);
    const updated = { ...parsed, isNewUser: false };
    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(updated));

    setSignupRoute(null);
    setAuthStatus("authenticated");
  };

  /* ---------------- GUEST ---------------- */
  const loginAsGuest = async () => {
    await SecureStore.deleteItemAsync(AUTH_KEY);
    setAccessToken(null);
    setAuthMethod(null);
    setSignupRoute(null);
    setAuthStatus("guest");
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = async () => {
    await SecureStore.deleteItemAsync(AUTH_KEY);
    setAccessToken(null);
    setAuthMethod(null);
    setSignupRoute(null);
    setAuthStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        accessToken,
        authMethod,
        signupRoute,
        loginWithOAuth,
        loginWithOtp,
        completeOAuthSignup,
        completeOtpSignup,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
