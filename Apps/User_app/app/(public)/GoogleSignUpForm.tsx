import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
  Button,
} from "react-native";
import * as Location from "expo-location";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

export default function GoogleSignUpForm({ idToken }: { idToken: string }) {
  const { loginWithOAuth } = useAuth();

  const [loading, setLoading] = useState(true);
  const [referreCode, setReferreCode] = useState("");
  const [readyToSubmit, setReadyToSubmit] = useState(false);

  const [lat, setLat] = useState("0.000");
  const [long, setLong] = useState("0.000");

  /* =========================
     GET LOCATION FIRST
  ========================= */
  useEffect(() => {
    const getLocation = async () => {
      try {
        console.log("📍 Requesting location permission...");
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          console.log("📍 Fetching location...");
          const location = await Location.getCurrentPositionAsync({});

          const latFormatted = Number(
            location.coords.latitude
          ).toFixed(3);
          const longFormatted = Number(
            location.coords.longitude
          ).toFixed(3);

          setLat(latFormatted);
          setLong(longFormatted);

          console.log("📍 Location:", latFormatted, longFormatted);
        } else {
          console.log("⚠️ Location permission denied");
        }
      } catch (err: any) {
        console.log("❌ Location error:", err.message);
      } finally {
        setReadyToSubmit(true);
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  /* =========================
     HANDLE SUBMIT
  ========================= */
  const handleSubmit = async () => {
    try {
      console.log("🚀 STARTING GOOGLE SIGNUP FLOW");

      if (!idToken) {
        console.log("❌ ERROR: No ID token");
        Alert.alert("Error", "Google authentication failed");
        return;
      }

      console.log("🔑 ID TOKEN:", idToken);

      const payload = {
        provider: "google",
        id_token: idToken,
        referre_code: referreCode,
        lat: parseFloat(lat),
        long: parseFloat(long),
      };

      console.log("📦 FINAL PAYLOAD:", payload);

      /* =========================
         API CALL
      ========================= */
      const res = await fetch(`${BASE_URL}/accounts/oauth/exchange/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("📥 BACKEND RESPONSE:", data);

      if (!res.ok) {
        throw new Error(
          data?.detail ||
            data?.non_field_errors?.[0] ||
            "Signup failed"
        );
      }

      /* =========================
         SAVE AUTH STATE
      ========================= */
      await loginWithOAuth(
        "google",
        data.access,
        data.refresh,
        data.is_new_user
      );

      console.log("✅ LOGIN SUCCESS");
    } catch (err: any) {
      console.log("❌ SIGNUP ERROR:", err.message);
      Alert.alert("Signup Error", err.message);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      {loading ? (
        <>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Preparing signup...</Text>
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 10 }}>
            Enter Referral Code (optional)
          </Text>

          <TextInput
            value={referreCode}
            onChangeText={setReferreCode}
            placeholder="Referral Code"
            style={{
              borderWidth: 1,
              width: "100%",
              padding: 10,
              borderRadius: 8,
              marginBottom: 20,
            }}
          />

          <Button
            title="Continue"
            onPress={handleSubmit}
            disabled={!readyToSubmit}
          />
        </>
      )}
    </View>
  );
}
