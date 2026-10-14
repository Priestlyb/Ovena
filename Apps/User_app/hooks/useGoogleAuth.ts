import { useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
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

  const login = async () => {
    if (loading) return;

    try {
      setLoading(true);

      console.log("Starting Google Login");

      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      const idToken = result?.data?.idToken;

      if (!idToken) {
        throw new Error("Google authentication failed");
      }

      /* LOCATION (OPTIONAL) */

      let lat = 0;
      let long = 0;

      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          lat = loc.coords.latitude;
          long = loc.coords.longitude;
        }
      } catch (err) {
        console.log("Location error:", err);
      }

      /* SEND TOKEN TO BACKEND */

      const res = await fetch(EXCHANGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "google",
          id_token: idToken,
        }),
      });

      const data = await res.json();

      console.log("OAuth Response:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      /* EXISTING USER */

      if (!data?.is_new_user) {
        const { access, refresh } = data;

        await loginWithOAuth("google", access, refresh, false);

        Toast.show({
          type: "success",
          text1: "Welcome back",
        });

        return;
      }

      /* NEW USER */

      router.replace({
        pathname: "/googleSignUpForm",
        params: {
          accessToken: data?.access,
          lat: String(lat),
          long: String(long),
        },
      });

      return;
    } catch (err: any) {
      console.log("Google Login Error:", err);

      Toast.show({
        type: "error",
        text1: "Google Login Failed",
        text2: err?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
