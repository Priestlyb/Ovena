import React, { useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import { useOtpLogin } from "@/hooks/signup/useOtpLogin";
import OtpScreen from "@/components/OtpScreen";

export default function OtpPage() {
  const { phone: rawPhone, pin_id } = useLocalSearchParams<{
    phone: string;
    pin_id: string;
  }>();

  const { logout } = useAuth();

  // Local focus state for animated OTP boxes
  const [focusedIndex, setFocusedIndex] = useState(0);

  const phone =
    rawPhone && rawPhone.startsWith("+")
      ? rawPhone
      : rawPhone
        ? `+${rawPhone}`
        : null;

  if (!phone) {
    Alert.alert("Session error", "Missing phone number", [
      {
        text: "OK",
        onPress: logout,
      },
    ]);

    return null;
  }

  const {
    otp,
    inputs,
    handleChange,
    handleBackspace,
    resetOtp,
    verifyOtp,
    resendOtp,
    sending,
    verifying,
    cooldown,
    canResend,
  } = useOtpLogin({
    phone,
    pinId: String(pin_id || ""),
  });

  return (
    <OtpScreen
      phone={phone}
      otp={otp}
      inputs={inputs}
      focusedIndex={focusedIndex}
      onFocus={setFocusedIndex}
      onChange={handleChange}
      onBackspace={handleBackspace}
      onReset={resetOtp}
      onVerify={verifyOtp}
      onResend={resendOtp}
      sending={sending}
      verifying={verifying}
      cooldown={cooldown}
      canResend={canResend}
    />
  );
}
