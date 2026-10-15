import React from "react";
import Toast from "react-native-toast-message";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import OtpScreen from "@/components/OtpScreen";

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

export default function ChangePhoneOtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { accessToken } = useAuth();

  const handleVerify = async (otp: string) => {
    try {
      // 🔹 VERIFY OTP
      const verifyRes = await fetch(`${BASE_URL}/accounts/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp_code: otp }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        Toast.show({ type: "error", text1: verifyData?.detail || "Invalid OTP" });
        return;
      }

      // 🔹 UPDATE PHONE
      const updateRes = await fetch(`${BASE_URL}/accounts/customer/update/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      if (!updateRes.ok) {
        Toast.show({ type: "error", text1: "Update failed" });
        return;
      }

      Toast.show({ type: "success", text1: "Phone number updated 🎉" });
      router.back();
    } catch (error) {
      Toast.show({ type: "error", text1: "Something went wrong" });
    }
  };

  const handleResend = async () => {
    try {
      const resendRes = await fetch(`${BASE_URL}/accounts/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!resendRes.ok) {
        Toast.show({ type: "error", text1: "Failed to resend OTP" });
        return;
      }

      Toast.show({ type: "success", text1: "OTP resent" });
    } catch {
      Toast.show({ type: "error", text1: "Something went wrong" });
    }
  };

  return (
    <OtpScreen
      phone={phone as string}
      onVerify={handleVerify}
      onResend={handleResend}
    />
  );
}