import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { createStyles } from "@/constants/styles/OtpScreen.style";
import { useTheme, ThemeColors } from "@/constants/theme";

type OtpScreenProps = {
  phone: string;
  otp: string[];
  inputs: React.MutableRefObject<Array<TextInput | null>>;
  focusedIndex: number;
  onFocus: (index: number) => void;
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

type AnimatedOtpBoxProps = {
  active: boolean;
  children: React.ReactNode;
  theme: ThemeColors;
};

function AnimatedOtpBox({ active, children, theme }: AnimatedOtpBoxProps) {
  const styles = createStyles(theme);

  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: 180,
    });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 1 + progress.value * 0.08,
      },
    ],
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.border, theme.primary],
    ),
    borderWidth: 1 + progress.value,
  }));

  return (
    <Animated.View style={[styles.otpBoxContainer, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

export default function OtpScreen({
  phone,
  otp,
  inputs,
  focusedIndex,
  onFocus,
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
  const theme = useTheme();
  const styles = createStyles(theme);

  const [isResending, setIsResending] = useState(false);

  const shake = useSharedValue(0);

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

  const animatedRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const handleChangeText = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    if (text.length > 1) {
      const chars = text.slice(0, otp.length - index).split("");

      chars.forEach((c, i) => onChange(c, index + i));

      const nextIndex = Math.min(index + chars.length, otp.length - 1);

      onFocus(nextIndex);
      inputs.current[nextIndex]?.focus();

      return;
    }

    onChange(text, index);

    if (text && index < otp.length - 1) {
      onFocus(index + 1);
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key !== "Backspace") return;

    if (!otp[index] && index > 0) {
      onFocus(index - 1);
      inputs.current[index - 1]?.focus();
    }

    onBackspace(index);
  };

  const handleResendPress = async () => {
    if (!canResend || isResending) return;

    try {
      setIsResending(true);

      await onResend();

      Toast.show({
        type: "success",
        text1: "OTP Sent Again",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Resend Failed",
      });
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
        withTiming(0, { duration: 50 }),
      );

      Toast.show({
        type: "error",
        text1: "Invalid OTP",
      });

      onReset();

      onFocus(0);
      inputs.current[0]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>

      <Text style={styles.subtitle}>{phone}</Text>

      <Animated.View style={[styles.otpRow, animatedRowStyle]}>
        {otp.map((digit, index) => (
          <AnimatedOtpBox
            key={index}
            active={focusedIndex === index}
            theme={theme}
          >
            <TextInput
              ref={(ref) => {
                if (ref) {
                  inputs.current[index] = ref;
                }
              }}
              style={styles.otpInput}
              placeholderTextColor={theme.textSecondary}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onFocus={() => onFocus(index)}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          </AnimatedOtpBox>
        ))}
      </Animated.View>

      <TouchableOpacity
        onPress={handleVerifyPress}
        disabled={verifying || sending}
        style={[styles.verifyBtn, (verifying || sending) && styles.disabledBtn]}
      >
        <Text style={styles.verifyText}>
          {verifying ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResendPress}
        disabled={!canResend || isResending}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.resendText}>
          {secondsLeft > 0 ? `Resend OTP in ${secondsLeft}s` : "Resend OTP"}
        </Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
}
