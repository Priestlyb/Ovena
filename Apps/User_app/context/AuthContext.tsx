import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

type AuthStatus =
  | "booting"
  | "unauthenticated"
  | "otp_signup"
  | "google_signup"
  | "authenticated"
  | "guest";

type AuthMethod = "otp" | "google" | "apple" | null;

type StoredAuth = {
  accessToken: string | null;
  refreshToken: string | null;
  authMethod: AuthMethod;
  isNewUser?: boolean;
};

type AuthContextType = {
  authStatus: AuthStatus;
  accessToken: string | null;
  authMethod: AuthMethod;
  guestUsage: number;

  setAuthStatus: (status: AuthStatus) => void;
  oauthTemp: any;
  setOauthTemp: (data: any) => void;

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

  completeOtpSignup: () => Promise<void>;

  loginAsGuest: () => Promise<void>;
  incrementGuestUsage: () => Promise<void>;

  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null!);

const AUTH_KEY = "auth_state";
const GUEST_KEY = "guest_usage";
const MAX_GUEST_USAGE = 4;

const isExpired = (token: string) => {
  try {
    const { exp }: any = jwtDecode(token);
    return exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("booting");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [guestUsage, setGuestUsage] = useState(0);

  
  const [oauthTemp, setOauthTemp] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const guest = await AsyncStorage.getItem(GUEST_KEY);
        setGuestUsage(guest ? parseInt(guest) : 0);

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
            setAuthStatus(
              parsed.authMethod === "otp" ? "otp_signup" : "google_signup"
            );
          } else {
            setAuthStatus("authenticated");
          }

          return;
        }

        await SecureStore.deleteItemAsync(AUTH_KEY);
        setAuthStatus("unauthenticated");
      } catch (err) {
        console.log("Bootstrap error:", err);
        setAuthStatus("unauthenticated");
      }
    })();
  }, []);

  const loginWithOtp = async (
    access: string,
    refresh: string | null,
    isNewUser: boolean
  ) => {
    const payload: StoredAuth = {
      accessToken: access,
      refreshToken: refresh,
      authMethod: "otp",
      isNewUser,
    };

    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(payload));

    setAccessToken(access);
    setAuthMethod("otp");
    setAuthStatus(isNewUser ? "otp_signup" : "authenticated");
  };

  const loginWithOAuth = async (
    provider: "google" | "apple",
    access: string,
    refresh: string | null,
    isNewUser: boolean
  ) => {
    const payload: StoredAuth = {
      accessToken: access,
      refreshToken: refresh,
      authMethod: provider,
      isNewUser,
    };

    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(payload));

    setAccessToken(access);
    setAuthMethod(provider);
    setAuthStatus(isNewUser ? "google_signup" : "authenticated");
  };

  const completeOtpSignup = async () => {
    const stored = await SecureStore.getItemAsync(AUTH_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.isNewUser = false;
      await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(parsed));
    }

    setAuthStatus("authenticated");
  };

  const loginAsGuest = async () => {
    await SecureStore.deleteItemAsync(AUTH_KEY);

    setAccessToken(null);
    setAuthMethod(null);
    setAuthStatus("guest");
  };

  const incrementGuestUsage = async () => {
    const current = await AsyncStorage.getItem(GUEST_KEY);
    const count = current ? parseInt(current) : 0;

    const newCount = count + 1;

    await AsyncStorage.setItem(GUEST_KEY, newCount.toString());
    setGuestUsage(newCount);

    if (newCount >= MAX_GUEST_USAGE) {
      setAuthStatus("unauthenticated");
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(AUTH_KEY);

    setAccessToken(null);
    setAuthMethod(null);
    setAuthStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        setAuthStatus,
        accessToken,
        authMethod,
        guestUsage,

        
        oauthTemp,
        setOauthTemp,

        loginWithOAuth,
        loginWithOtp,
        completeOtpSignup,
        loginAsGuest,
        incrementGuestUsage,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};