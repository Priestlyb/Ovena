import { useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";

const EXCHANGE_URL =
  "https://ovena-backend-production.up.railway.app/api/accounts/oauth/exchange/";

type AppleOAuthUser = {
  name?: {
    firstName?: string;
    lastName?: string;
  };
  email?: string;
};

type AppleOAuthPayload = {
  provider: "apple";
  id_token: string;
  authorization_code?: string;
  user?: AppleOAuthUser;
};

export const useAppleAuth = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { loginWithOAuth } = useAuth();

  /**
   * Get the user's current location if permission is granted.
   *
   * Location is optional and must never prevent authentication.
   */
  const getLocation = async () => {
    let lat = 0;
    let long = 0;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("ℹ️ Location permission not granted");
        return { lat, long };
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      lat = location.coords.latitude;
      long = location.coords.longitude;
    } catch (error) {
      console.log("⚠️ Location error:", error);
    }

    return { lat, long };
  };

  /**
   * Exchange Apple's identity token with the backend.
   *
   * The user object is omitted when Apple does not provide
   * any profile information.
   */
  const exchangeToken = async (
    identityToken: string,
    authorizationCode?: string | null,
    user?: AppleOAuthUser,
  ) => {
    const payload: AppleOAuthPayload = {
      provider: "apple",
      id_token: identityToken,
    };

    // Include the authorization code when Apple provides it.
    if (authorizationCode) {
      payload.authorization_code = authorizationCode;
    }

    // Include only profile fields actually provided by Apple.
    if (user) {
      const name =
        user.name && (user.name.firstName || user.name.lastName)
          ? {
              ...(user.name.firstName
                ? { firstName: user.name.firstName }
                : {}),
              ...(user.name.lastName ? { lastName: user.name.lastName } : {}),
            }
          : undefined;

      const email = user.email || undefined;

      if (name || email) {
        payload.user = {
          ...(name ? { name } : {}),
          ...(email ? { email } : {}),
        };
      }
    }

    const response = await fetch(EXCHANGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data: any;

    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid response from server");
    }

    console.log("📡 Apple OAuth Response:", data);

    if (!response.ok) {
      throw new Error(
        data?.message || data?.detail || data?.error || "Apple login failed",
      );
    }

    return data;
  };

  const login = async () => {
    if (loading) return;

    try {
      setLoading(true);

      console.log("🟡 Starting Apple Login");

      // =========================
      // CHECK APPLE AUTH AVAILABILITY
      // =========================

      const isAvailable = await AppleAuthentication.isAvailableAsync();

      if (!isAvailable) {
        throw new Error("Apple Sign In is not available on this device.");
      }

      // =========================
      // APPLE SIGN IN
      // =========================

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const identityToken = credential.identityToken;

      if (!identityToken) {
        throw new Error(
          "Apple authentication failed: no identity token was returned.",
        );
      }

      console.log("✅ Apple identity token received");

      // =========================
      // PREPARE APPLE USER INFORMATION
      // =========================

      const firstName = credential.fullName?.givenName;
      const lastName = credential.fullName?.familyName;
      const email = credential.email;

      const hasAppleUserInfo = Boolean(firstName || lastName || email);

      const appleUser: AppleOAuthUser | undefined = hasAppleUserInfo
        ? {
            ...(firstName || lastName
              ? {
                  name: {
                    ...(firstName ? { firstName } : {}),
                    ...(lastName ? { lastName } : {}),
                  },
                }
              : {}),
            ...(email ? { email } : {}),
          }
        : undefined;

      // =========================
      // GET OPTIONAL LOCATION
      // =========================

      const { lat, long } = await getLocation();

      // =========================
      // EXCHANGE TOKEN WITH BACKEND
      // =========================

      const data = await exchangeToken(
        identityToken,
        credential.authorizationCode,
        appleUser,
      );

      // =========================
      // EXISTING USER
      // =========================

      if (!data?.is_new_user) {
        const { access, refresh } = data;

        if (!access || !refresh) {
          throw new Error("Authentication tokens were not returned");
        }

        await loginWithOAuth("apple", access, refresh, false);

        Toast.show({
          type: "success",
          text1: "Welcome back",
        });

        return;
      }

      // =========================
      // NEW USER
      // =========================

      if (!data?.access) {
        throw new Error("Authentication token was not returned for new user");
      }

      router.push({
        pathname: "/appleSignUpForm",
        params: {
          accessToken: data.access,
          lat: String(lat),
          long: String(long),

          // Apple may provide these only on the first authorization.
          firstName: firstName ?? "",
          lastName: lastName ?? "",
          email: email ?? "",
        },
      });
    } catch (error: any) {
      // =========================
      // USER CANCELLED APPLE LOGIN
      // =========================

      if (error?.code === "ERR_REQUEST_CANCELED") {
        console.log("ℹ️ Apple login cancelled.");

        Toast.show({
          type: "info",
          text1: "Login cancelled",
        });

        return;
      }

      console.log("❌ Apple Login Error:", error);

      Toast.show({
        type: "error",
        text1: "Apple Login Failed",
        text2: error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
  };
};
