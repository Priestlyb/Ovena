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
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { IconSymbol } from "@/components/ui/icon-symbol";

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

export default function Otp() {
  const { phone } = useLocalSearchParams();
  const { loginWithOtp, loading: authLoading } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);

  // ---------------------------
  // Safe timer effect
  // ---------------------------
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const phoneStr = Array.isArray(phone) ? phone[0] : phone;
  const normalizedPhone = phoneStr?.startsWith("+") ? phoneStr : `+${phoneStr}`;

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={50} color="#D9502E" />
      </View>
    );
  }

  // ---------------------------
  // Verify OTP
  // ---------------------------
  const handleVerifyOtp = async () => {
    if (otp.length < 4) return Alert.alert("Error", "Enter a valid OTP");

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/accounts/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: normalizedPhone, otp_code: otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Invalid OTP");

      // ✅ Wait for AuthContext updates
      const updatedUser = await loginWithOtp(
        data.access,
        data.refresh,
        data.is_new_user,
        normalizedPhone
      );

      router.replace(
        updatedUser.isNewUser ? "/screens/SignUpForm" : "/(tabs)/homepage"
      );
    } catch (e: any) {
      Alert.alert("OTP Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Resend OTP
  // ---------------------------
  const handleResend = async () => {
    if (timer > 0) return;

    try {
      setResending(true);
      setTimer(60);

      const res = await fetch(`${BASE_URL}/accounts/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: normalizedPhone }),
      });

      if (!res.ok) throw new Error("Failed to resend OTP");

      Alert.alert("Success", "OTP resent successfully");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace("/login")}>
        <IconSymbol name="CloseIcon" size={24} color="#D9502E" />
      </TouchableOpacity>

      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.phoneText}>{normalizedPhone}</Text>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      <Text style={styles.timer}>
        {timer > 0 ? `Resend in ${timer}s` : "Didn’t get code?"}
      </Text>

      <TouchableOpacity
        disabled={timer > 0 || resending}
        onPress={handleResend}
      >
        <Text style={styles.resend}>
          {resending ? "Sending..." : "Resend OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={handleVerifyOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Verify</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  phoneText: {
    color: "#D9502E",
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    height: 50,
    textAlign: "center",
    fontSize: 18,
  },
  timer: { marginTop: 15, textAlign: "center", color: "#666" },
  resend: {
    color: "#D9502E",
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#D9502E",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
