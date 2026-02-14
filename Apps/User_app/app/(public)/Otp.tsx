import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

export default function Otp() {
  const { phone: rawPhone } = useLocalSearchParams<{ phone: string }>();
  const { loginWithOtp, logout } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);

  /* =========================
     PHONE PARAM (Expo Router)
  ========================= */
  const phone =
    rawPhone && rawPhone.startsWith("+")
      ? rawPhone
      : rawPhone
        ? `+${rawPhone}`
        : null;

  /* =========================
     HARD GUARD
  ========================= */
  useEffect(() => {
    if (!phone) {
      Alert.alert(
        "Session error",
        "Missing phone number. Please login again.",
        [{ text: "OK", onPress: logout }],
      );
    }
  }, [phone]);

  /* =========================
     TIMER
  ========================= */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* =========================
     VERIFY OTP
  ========================= */
  const handleVerifyOtp = async () => {
    if (!phone || otp.length < 4) {
      Alert.alert("Error", "Enter a valid OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/accounts/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phone,
          otp_code: otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || "Invalid OTP");
      }

      if (!data?.access) {
        throw new Error("Access token missing");
      }

      let isNewUser = data.is_new_user ?? true;

      // 🔥 HYBRID CHECK (VERY IMPORTANT)
      try {
        const profileRes = await fetch(`${BASE_URL}/accounts/profile/`, {
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        });

        if (profileRes.ok) {
          const user = await profileRes.json();

          // 🔥 Decide if signup is complete
          isNewUser =
            !user.name ||
            !user.date_of_birth ||
            user.lat == null ||
            user.long == null;
        }
      } catch (err) {
        console.log("Profile check failed, fallback to backend value");
      }

      await loginWithOtp(data.access, data.refresh ?? null, isNewUser);

      // 🚨 DO NOT NAVIGATE — AuthGate handles it
    } catch (err: any) {
      Alert.alert("OTP Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RESEND OTP
  ========================= */
  const handleResend = async () => {
    if (!phone || timer > 0) return;

    try {
      setResending(true);

      const res = await fetch(`${BASE_URL}/accounts/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to resend OTP");
      }
      setTimer(60);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>{phone}</Text>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
        placeholder="Enter OTP"
        textAlign="center"
      />

      <TouchableOpacity
        style={styles.verifyBtn}
        onPress={handleVerifyOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.verifyText}>Verify</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        disabled={timer > 0 || resending}
        onPress={handleResend}
      >
        <Text style={styles.resendText}>
          {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center" },
  subtitle: { textAlign: "center", color: "#666", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    textAlign: "center",
  },
  verifyBtn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
  },
  verifyText: { color: "#fff", fontWeight: "700" },
  resendText: {
    textAlign: "center",
    marginTop: 20,
    color: "#E4572E",
    fontWeight: "600",
  },
});
