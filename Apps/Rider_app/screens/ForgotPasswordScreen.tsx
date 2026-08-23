/**
 * screens/ForgotPasswordScreen.tsx
 *
 * Two-step password reset flow, reached from SignInScreen's
 * "Forgot Password?" link:
 *
 *   Step 1 — Email          → POST /api/accounts/password-reset/send/
 *   Step 2 — OTP + New Pass → POST /api/accounts/password-reset/
 *
 * On success, shows a confirmation alert and navigates back to SignIn.
 */

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  Alert, ActivityIndicator, ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { IconSymbol } from "../components/ui/icon-symbol";
import FormInput, { validateField } from "../components/FormInput";
import { sendPasswordResetOtp, resetPassword, PasswordResetApiError } from "../services/passwordResetApi";
import { useTheme, ThemeColors } from "../context/ThemeContext";

type RootStackParamList = {
  SignIn: undefined;
  ForgotPassword: undefined;
};

type NavProp = NativeStackNavigationProp<RootStackParamList, "ForgotPassword">;

const RESEND_COOLDOWN_SECONDS = 30;

type Step = "email" | "reset";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [step, setStep] = useState<Step>("email");

  const [email, setEmail]       = useState("");
  const [emailError, setEmailError] = useState("");

  const [otpCode, setOtpCode]         = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetErrors, setResetErrors] = useState<Record<string, string>>({});

  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown]     = useState(0);

  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    cooldownTimer.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownTimer.current) clearInterval(cooldownTimer.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Step 1: send OTP to email ────────────────────────────────────────────
  const handleSendOtp = async () => {
    const err = validateField(email, "Email Address", "email");
    setEmailError(err);
    if (err) return;

    setSendingOtp(true);
    try {
      await sendPasswordResetOtp(email);
      setStep("reset");
      startCooldown();
    } catch (e: any) {
      const message = e instanceof PasswordResetApiError
        ? e.message
        : "Something went wrong. Please try again.";
      Alert.alert("Couldn't Send Code", message);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || sendingOtp) return;
    setSendingOtp(true);
    try {
      await sendPasswordResetOtp(email);
      startCooldown();
      Alert.alert("Code Sent", "A new verification code has been sent to your email.");
    } catch (e: any) {
      const message = e instanceof PasswordResetApiError
        ? e.message
        : "Something went wrong. Please try again.";
      Alert.alert("Couldn't Resend Code", message);
    } finally {
      setSendingOtp(false);
    }
  };

  // ── Step 2: verify OTP + set new password ────────────────────────────────
  const validateResetStep = (): boolean => {
    const errs: Record<string, string> = {
      otpCode: otpCode.trim() ? "" : "Please enter the code sent to your email.",
      newPassword: validateField(newPassword, "New Password", "password", false, 6),
      confirmPassword:
        confirmPassword.trim() === ""
          ? "Please confirm your new password."
          : confirmPassword !== newPassword
          ? "Passwords do not match."
          : "",
    };
    setResetErrors(errs);
    return Object.values(errs).every((e) => !e);
  };

  const handleResetPassword = async () => {
    if (!validateResetStep()) return;

    setSubmitting(true);
    try {
      await resetPassword({ email, newPassword, otpCode });
      Alert.alert(
        "Password Reset",
        "Your password has been changed successfully. Please sign in with your new password.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      const message = e instanceof PasswordResetApiError
        ? e.message
        : "Something went wrong. Please try again.";
      Alert.alert("Couldn't Reset Password", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        disabled={sendingOtp || submitting}
      >
        <IconSymbol name="ArrowLeft" size={24} color={colors.iconColor} />
      </TouchableOpacity>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {step === "email" ? (
          <>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter the email linked to your account and we'll send you a code to reset your password.
            </Text>

            <FormInput
              label="Email Address"
              value={email}
              onChange={(t) => { setEmail(t); if (emailError) setEmailError(""); }}
              iconName="EmailIcon"
              type="email"
              error={emailError}
            />

            <TouchableOpacity
              style={[styles.button, sendingOtp && styles.buttonDisabled]}
              onPress={handleSendOtp}
              disabled={sendingOtp}
            >
              {sendingOtp
                ? <ActivityIndicator color={colors.textPrimary} />
                : <Text style={styles.buttonText}>Send Code</Text>
              }
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter the code sent to {email} and choose a new password.
            </Text>

            <FormInput
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={otpCode}
              onChange={(t) => {
                setOtpCode(t);
                if (resetErrors.otpCode) setResetErrors((p) => ({ ...p, otpCode: "" }));
              }}
              iconName="ShieldIcon"
              type="number"
              maxLength={6}
              error={resetErrors.otpCode}
            />

            <FormInput
              label="New Password"
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(t) => {
                setNewPassword(t);
                if (resetErrors.newPassword) setResetErrors((p) => ({ ...p, newPassword: "" }));
              }}
              iconName="PassWordIcon"
              type="password"
              minLength={6}
              error={resetErrors.newPassword}
            />

            <FormInput
              label="Confirm New Password"
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(t) => {
                setConfirmPassword(t);
                if (resetErrors.confirmPassword) setResetErrors((p) => ({ ...p, confirmPassword: "" }));
              }}
              iconName="PassWordIcon"
              type="password"
              error={resetErrors.confirmPassword}
            />

            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={cooldown > 0 || sendingOtp}
              style={styles.resendButton}
            >
              <Text style={[styles.resendText, (cooldown > 0 || sendingOtp) && styles.resendTextDisabled]}>
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't get a code? Resend"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, submitting && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={submitting}
            >
              {submitting
                ? <ActivityIndicator color={colors.textPrimary} />
                : <Text style={styles.buttonText}>Reset Password</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { setStep("email"); setOtpCode(""); setNewPassword(""); setConfirmPassword(""); setResetErrors({}); }}
              disabled={submitting}
              style={styles.changeEmailButton}
            >
              <Text style={styles.changeEmailText}>Use a different email</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 60,
  },
  backBtn: { marginBottom: 16, alignSelf: "flex-start" },
  title: { fontSize: 28, fontWeight: "700", color: colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 24, lineHeight: 20 },
  button: {
    backgroundColor: colors.actionBtnBg, paddingVertical: 16,
    borderRadius: 50, alignItems: "center", marginTop: 12, marginBottom: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  resendButton: { alignSelf: "center", marginTop: 4, marginBottom: 4 },
  resendText: { color: colors.accentOrange, fontSize: 13, fontWeight: "600" },
  resendTextDisabled: { color: colors.textMuted },
  changeEmailButton: { alignSelf: "center", marginTop: 4, marginBottom: 24 },
  changeEmailText: { color: colors.textMuted, fontSize: 13, textDecorationLine: "underline" },
});