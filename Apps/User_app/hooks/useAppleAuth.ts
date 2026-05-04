import { useState } from "react";
import { Alert } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

export const useAppleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { loginWithOAuth } = useAuth();

  const login = async () => {
    try {
      setLoading(true);

      const cred = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });

      if (!cred.identityToken)
        throw new Error("Apple ID token missing");

      const res = await fetch(`${BASE_URL}/accounts/oauth/exchange/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "apple",
          code: cred.identityToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail);

      await loginWithOAuth(
        "apple",
        data.access,
        data.refresh,
        data.is_new_user
      );
    } catch (err: any) {
      if (err?.code !== "ERR_CANCELED") {
        Alert.alert("Apple Login Error", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};