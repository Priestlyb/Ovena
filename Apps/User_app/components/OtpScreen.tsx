import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

type OtpScreenProps = {
  phone: string;
  otp: string[];
  inputs: React.MutableRefObject<Array<TextInput | null>>;
  focusedIndex: number;
  onChange: (text: string, index: number) => void;
  onBackspace: (index: number) => void;
  onReset: () => void;
  onVerify: () => Promise<void>;
  onResend: () => Promise<void>;
  sending: boolean;
  verifying: boolean;
  cooldown: number;
  canResend: boolean;
};

export default function OtpScreen({
  phone,
  otp,
  inputs,
  focusedIndex,
  onChange,
  onBackspace,
  onReset,
  onVerify,
  onResend,
  sending,
  verifying,
  cooldown,
  canResend,
}: OtpScreenProps) {
  const [isResending, setIsResending] = useState(false);
  const shake = useSharedValue(0);

  /* ======================
     COUNTDOWN
  ====================== */
  const [secondsLeft, setSecondsLeft] = useState(cooldown);

  useEffect(() => {
    setSecondsLeft(cooldown);
  }, [cooldown]);

  useEffect(() => {
    if (secondsLeft === 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  /* ======================
     OTP INPUT HANDLER
  ====================== */
  const handleChangeText = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    // Handle pasted text
    if (text.length > 1) {
      const chars = text.slice(0, otp.length - index).split("");
      chars.forEach((c, i) => onChange(c, index + i));
      const nextIndex = Math.min(index + chars.length, otp.length - 1);
      inputs.current[nextIndex]?.focus();
      return;
    }

    onChange(text, index);

    // Move to next input if typing
    if (text && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      }
      onBackspace(index);
    }
  };

  /* ======================
     RESEND & VERIFY
  ====================== */
  const handleResendPress = async () => {
    if (!canResend || isResending) return;

    try {
      setIsResending(true);
      await onResend();
      Toast.show({ type: "success", text1: "OTP Sent Again" });
    } catch {
      Toast.show({ type: "error", text1: "Resend Failed" });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyPress = async () => {
    try {
      await onVerify();
    } catch {
      shake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      Toast.show({ type: "error", text1: "Invalid OTP" });
      onReset();
      inputs.current[0]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>{phone}</Text>

      <Animated.View style={[styles.otpRow, animatedStyle]}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputs.current[index] = ref;
            }}
            style={[styles.otpBox, focusedIndex === index && styles.activeBox]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onFocus={() => {}}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </Animated.View>

      <TouchableOpacity
        onPress={handleVerifyPress}
        style={[styles.verifyBtn, (verifying || sending) && styles.disabledBtn]}
        disabled={verifying || sending}
      >
        <Text style={styles.verifyText}>
          {verifying ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResendPress}
        style={{ marginTop: 20 }}
        disabled={!canResend || isResending}
      >
        <Text style={styles.resendText}>
          {secondsLeft > 0 ? `Resend OTP in ${secondsLeft}s` : "Resend OTP"}
        </Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center" },
  subtitle: { textAlign: "center", color: "#666", marginBottom: 20 },
  otpRow: { flexDirection: "row", justifyContent: "space-between" },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
  },
  activeBox: { borderColor: "#000", borderWidth: 2 },
  verifyBtn: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  disabledBtn: { backgroundColor: "#999" },
  verifyText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  resendText: { color: "#E4572E", fontWeight: "600", textAlign: "center" },
});