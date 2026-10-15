import { useState } from "react";
import {
  GoogleSignin,
  isCancelledResponse,
} from "@react-native-google-signin/google-signin";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";

const EXCHANGE_URL =
  "https://ovena-backend-production.up.railway.app/api/accounts/oauth/exchange/";

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { loginWithOAuth } = useAuth();

  /**
   * Get the user's current location if permission is granted.
   *
   * Location is completely optional for OAuth.
   * A location failure should never prevent login.
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
   * Exchange the Google ID token with the backend.
   */
  const exchangeToken = async (idToken: string) => {
    const response = await fetch(EXCHANGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: "google",
        id_token: idToken,
      }),
    });

    let data: any = null;

    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid response from server");
    }

    console.log("📡 Google OAuth Response:", data);

    if (!response.ok) {
      throw new Error(
        data?.message || data?.detail || data?.error || "Google login failed",
      );
    }

    return data;
  };

  const login = async () => {
    if (loading) return;

    try {
      setLoading(true);

      console.log("🟡 Starting Google Login");

      // Make sure Google Play Services are available on Android.
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const result = await GoogleSignin.signIn();

      const idToken = result?.data?.idToken;

      if (!idToken) {
        throw new Error("Google authentication failed");
      }

      console.log("✅ Google ID token received");

      // Location is optional.
      const { lat, long } = await getLocation();

      // Exchange Google token with backend.
      const data = await exchangeToken(idToken);

      // =========================
      // EXISTING USER
      // =========================

      if (!data?.is_new_user) {
        const { access, refresh } = data;

        if (!access || !refresh) {
          throw new Error("Authentication tokens were not returned");
        }

        await loginWithOAuth("google", access, refresh, false);

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
        pathname: "/googleSignUpForm",
        params: {
          accessToken: data.access,
          lat: String(lat),
          long: String(long),
        },
      });
    } catch (error: any) {
      if (isCancelledResponse(error)) {
        console.log("ℹ️ Google login cancelled.");

        Toast.show({
          type: "info",
          text1: "Login cancelled",
        });

        return;
      }

      console.log("❌ Google Login Error:", error);

      Toast.show({
        type: "error",
        text1: "Google Login Failed",
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
