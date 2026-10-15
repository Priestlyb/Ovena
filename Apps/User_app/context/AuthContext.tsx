import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api, {
  refreshAccessToken,
  registerAuthFailureHandler,
} from "@/services/apiClient";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

type AuthStatus =
  | "booting"
  | "unauthenticated"
  | "otp_signup"
  | "google_signup"
  | "authenticated"
  | "guest";

type AuthMethod = "otp" | "google" | "apple" | null;

type JwtPayload = {
  exp: number;
};

type OAuthTemp = any;

type StoredAuth = {
  accessToken: string | null;
  refreshToken: string | null;
  authMethod: AuthMethod;
  isNewUser?: boolean;
};

type ProfileAddress = {
  id: number;
  address: string;
  created_at: string;
  label: string;
  lat: number;
  long: number;
};

export type CustomerProfile = {
  id: number;
  name: string;
  age: number;
  birth_date: string;
  addresses: ProfileAddress[];
  default_address: ProfileAddress | null;
  orders_20_this_month: boolean;
  pickup_food: boolean;
  points: number;
  referral_code: string;
};

type AuthContextType = {
  authStatus: AuthStatus;
  accessToken: string | null;
  authMethod: AuthMethod;
  guestUsage: number;

  profile: CustomerProfile | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;

  setAuthStatus: (status: AuthStatus) => void;

  oauthTemp: OAuthTemp;
  setOauthTemp: (data: OAuthTemp) => void;

  loginWithOAuth: (
    provider: "google" | "apple",
    access: string,
    refresh: string | null,
    isNewUser: boolean,
  ) => Promise<void>;

  loginWithOtp: (
    access: string,
    refresh: string | null,
    isNewUser: boolean,
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
    const { exp } = jwtDecode<JwtPayload>(token);

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

  const [oauthTemp, setOauthTemp] = useState<OAuthTemp>(null);

  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  const [profileLoading, setProfileLoading] = useState(false);

  const loadStoredAuth = useCallback(async (): Promise<StoredAuth | null> => {
    const stored = await SecureStore.getItemAsync(AUTH_KEY);

    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }, []);

  const saveStoredAuth = useCallback(async (payload: StoredAuth) => {
    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(payload));
  }, []);

  const clearStoredAuth = useCallback(async () => {
    await SecureStore.deleteItemAsync(AUTH_KEY);
  }, []);

  /**
   * Fetch the currently authenticated customer's profile.
   *
   * Change "/accounts/profile/" if your backend uses
   * a different profile endpoint.
   */
  const refreshProfile = useCallback(async () => {
    try {
      setProfileLoading(true);

      const response = await api.get("/accounts/profile/");

      if (__DEV__) {
        // console.log("LOG Profile", response.data);
      }

      /**
       * Your API response looks like:
       *
       * {
       *   active_profile_type: "customer",
       *   profile: {
       *     ...
       *     orders_20_this_month: false
       *   },
       *   roles: ["customer"],
       *   user: {...}
       * }
       */
      const profileData = response.data?.profile;

      if (profileData) {
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    } catch (error) {
      if (__DEV__) {
        console.log("[PROFILE FETCH ERROR]", error);
      }

      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const saveAuth = useCallback(
    async (payload: StoredAuth) => {
      await saveStoredAuth(payload);

      setAccessToken(payload.accessToken);
      setAuthMethod(payload.authMethod);

      if (payload.isNewUser) {
        setAuthStatus(
          payload.authMethod === "otp" ? "otp_signup" : "google_signup",
        );
      } else {
        setAuthStatus("authenticated");
      }
    },
    [saveStoredAuth],
  );

  const initializeAuth = useCallback(async () => {
    try {
      const guest = await AsyncStorage.getItem(GUEST_KEY);

      setGuestUsage(guest ? parseInt(guest, 10) : 0);

      const stored = await loadStoredAuth();

      if (__DEV__) {
        console.log("[AUTH] Stored auth:", stored);
      }

      if (!stored) {
        setAuthStatus("unauthenticated");
        return;
      }

      /**
       * Access token is still valid.
       */
      if (stored.accessToken && !isExpired(stored.accessToken)) {
        setAccessToken(stored.accessToken);

        setAuthMethod(stored.authMethod);

        if (stored.isNewUser) {
          setAuthStatus(
            stored.authMethod === "otp" ? "otp_signup" : "google_signup",
          );
        } else {
          setAuthStatus("authenticated");
        }

        return;
      }

      /**
       * Access token is expired.
       *
       * If we have a refresh token, try to silently
       * obtain a new access token before logging the
       * user out.
       */
      if (stored.refreshToken) {
        if (__DEV__) {
          console.log("[AUTH] Access token expired. Attempting refresh...");
        }

        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          const refreshedAuth = await loadStoredAuth();

          setAccessToken(newAccessToken);

          setAuthMethod(refreshedAuth?.authMethod ?? stored.authMethod);

          if (refreshedAuth?.isNewUser) {
            setAuthStatus(
              refreshedAuth.authMethod === "otp"
                ? "otp_signup"
                : "google_signup",
            );
          } else {
            setAuthStatus("authenticated");
          }

          return;
        }
      }

      /**
       * No valid access token and refresh failed.
       */
      await clearStoredAuth();

      setAccessToken(null);
      setAuthMethod(null);
      setProfile(null);

      setAuthStatus("unauthenticated");
    } catch (error) {
      if (__DEV__) {
        console.log("[AUTH INIT ERROR]", error);
      }

      await clearStoredAuth();

      setAccessToken(null);
      setAuthMethod(null);
      setProfile(null);

      setAuthStatus("unauthenticated");
    }
  }, [loadStoredAuth, clearStoredAuth]);

  useEffect(() => {
    registerAuthFailureHandler(() => {
      if (__DEV__) {
        console.log("[AUTH] Refresh token invalid/expired. Logging user out.");
      }

      setAccessToken(null);
      setAuthMethod(null);
      setProfile(null);
      setProfileLoading(false);
      setAuthStatus("unauthenticated");
    });

    return () => {
      registerAuthFailureHandler(null);
    };
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Automatically load the customer's profile
   * whenever authentication becomes available.
   */
  useEffect(() => {
    if (authStatus !== "authenticated" || !accessToken) {
      setProfile(null);
      return;
    }

    refreshProfile();
  }, [authStatus, accessToken, refreshProfile]);

  const loginWithOtp = useCallback(
    async (access: string, refresh: string | null, isNewUser: boolean) => {
      await saveAuth({
        accessToken: access,
        refreshToken: refresh,
        authMethod: "otp",
        isNewUser,
      });
    },
    [saveAuth],
  );

  const loginWithOAuth = useCallback(
    async (
      provider: "google" | "apple",
      access: string,
      refresh: string | null,
      isNewUser: boolean,
    ) => {
      await saveAuth({
        accessToken: access,
        refreshToken: refresh,
        authMethod: provider,
        isNewUser,
      });
    },
    [saveAuth],
  );

  const completeOtpSignup = useCallback(async () => {
    console.log("🔥 COMPLETE OTP SIGNUP START");

    const stored = await loadStoredAuth();

    console.log("🔥 STORED AUTH:", stored);

    if (stored) {
      stored.isNewUser = false;

      console.log("🔥 SAVING UPDATED AUTH");

      await saveStoredAuth(stored);

      console.log("🔥 UPDATED AUTH SAVED");
    }

    console.log("🔥 ABOUT TO SET AUTHENTICATED");

    setAuthStatus("authenticated");

    console.log("🔥 AUTHENTICATED STATE SET");
  }, [loadStoredAuth, saveStoredAuth]);

  const loginAsGuest = useCallback(async () => {
    await clearStoredAuth();

    setAccessToken(null);
    setAuthMethod(null);
    setProfile(null);
    setAuthStatus("guest");
  }, [clearStoredAuth]);

  const incrementGuestUsage = useCallback(async () => {
    const current = await AsyncStorage.getItem(GUEST_KEY);

    const count = current ? parseInt(current, 10) : 0;

    const newCount = count + 1;

    await AsyncStorage.setItem(GUEST_KEY, newCount.toString());

    setGuestUsage(newCount);

    if (newCount >= MAX_GUEST_USAGE) {
      setAuthStatus("unauthenticated");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const stored = await loadStoredAuth();

      if (stored?.refreshToken) {
        await api.post("/accounts/logout/", {
          refresh: stored.refreshToken,
        });
      }

      // Sign out from Google if using Google authentication
      if (stored?.authMethod === "google") {
        try {
          const currentUser = GoogleSignin.getCurrentUser();

          if (currentUser) {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
          }
        } catch (error) {
          if (__DEV__) {
            console.log("[GOOGLE LOGOUT ERROR]", error);
          }
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.log("[LOGOUT ERROR]", error);
      }
    } finally {
      await clearStoredAuth();

      setAccessToken(null);
      setAuthMethod(null);
      setProfile(null);
      setProfileLoading(false);

      setAuthStatus("unauthenticated");
    }
  }, [loadStoredAuth, clearStoredAuth]);

  const value = useMemo(
    () => ({
      authStatus,
      setAuthStatus,
      accessToken,
      authMethod,
      guestUsage,

      profile,
      profileLoading,
      refreshProfile,

      oauthTemp,
      setOauthTemp,

      loginWithOAuth,
      loginWithOtp,
      completeOtpSignup,
      loginAsGuest,
      incrementGuestUsage,
      logout,
    }),
    [
      authStatus,
      accessToken,
      authMethod,
      guestUsage,
      profile,
      profileLoading,
      refreshProfile,
      oauthTemp,
      loginWithOAuth,
      loginWithOtp,
      completeOtpSignup,
      loginAsGuest,
      incrementGuestUsage,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
