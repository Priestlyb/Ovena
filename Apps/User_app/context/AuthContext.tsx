import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";

/* =========================
   TYPES
========================= */
type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  phoneNumber: string | null;
  isNewUser: boolean;
  isOtpVerified: boolean;
};

type AuthContextType = AuthState & {
  loading: boolean;
  loginWithOtp: (
    access: string,
    refresh: string,
    isNewUser: boolean,
    phone: string
  ) => Promise<AuthState>;
  logout: () => Promise<void>;
  getValidAccessToken: () => Promise<string | null>;
  loginAsGuest: () => Promise<void>;
  completeSignup: () => Promise<AuthState>;
};

const AuthContext = createContext<AuthContextType | null>(null);

/* =========================
   CONSTANTS
========================= */
const AUTH_KEY = "auth_state";
const BASE_URL =
  "https://ovena-backend-production.up.railway.app/api";

/* =========================
   PROVIDER
========================= */
export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
    phoneNumber: null,
    isNewUser: false,
    isOtpVerified: false,
  });

  const [loading, setLoading] = useState(true);

  /* ---------------------------
     HYDRATE FROM STORAGE
  ---------------------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(AUTH_KEY);
        if (stored && mounted) {
          setState(JSON.parse(stored));
        }
      } catch (err) {
        console.warn("Failed to load auth state");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------------------
     PERSIST STATE (SINGLE SOURCE)
  ---------------------------- */
  const persistState = async (
    nextState: AuthState
  ): Promise<AuthState> => {
    await SecureStore.setItemAsync(
      AUTH_KEY,
      JSON.stringify(nextState)
    );
    setState(nextState);
    return nextState;
  };

  /* ---------------------------
     LOGIN WITH OTP
  ---------------------------- */
  const loginWithOtp = async (
    access: string,
    refresh: string,
    isNewUser: boolean,
    phone: string
  ): Promise<AuthState> => {
    return persistState({
      accessToken: access,
      refreshToken: refresh,
      phoneNumber: phone,
      isNewUser,
      isOtpVerified: true, // ✅ OTP confirmed here
    });
  };

  /* ---------------------------
     LOGOUT (CENTRAL)
  ---------------------------- */
  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(AUTH_KEY);
    setState({
      accessToken: null,
      refreshToken: null,
      phoneNumber: null,
      isNewUser: false,
      isOtpVerified: false,
    });
  }, []);

  /* ---------------------------
     REFRESH ACCESS TOKEN
  ---------------------------- */
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    if (!state.refreshToken) return null;

    try {
      const res = await fetch(
        `${BASE_URL}/accounts/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: state.refreshToken,
          }),
        }
      );

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();

      const updatedState: AuthState = {
        ...state,
        accessToken: data.access,
      };

      await persistState(updatedState);
      return data.access;
    } catch (error) {
      await logout();
      return null;
    }
  }, [state, logout]);

  /* ---------------------------
     GET VALID ACCESS TOKEN
  ---------------------------- */
  const getValidAccessToken = async (): Promise<string | null> => {
    if (state.accessToken) return state.accessToken;
    return refreshAccessToken();
  };

  /* ---------------------------
     COMPLETE SIGNUP
     (USED IN _layout.tsx)
  ---------------------------- */
  const completeSignup = async (): Promise<AuthState> => {
    const nextState: AuthState = {
      ...state,
      isNewUser: false,
    };

    return persistState(nextState);
  };

  /* ---------------------------
     GUEST LOGIN
  ---------------------------- */
  const loginAsGuest = async () => {
    await persistState({
      accessToken: "guest",
      refreshToken: null,
      phoneNumber: null,
      isNewUser: false,
      isOtpVerified: true,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loading,
        loginWithOtp,
        logout,
        loginAsGuest,
        getValidAccessToken,
        completeSignup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   HOOK
========================= */
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }
  return ctx;
};
