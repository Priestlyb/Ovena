import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FeedbackModal from "@/components/FeedbackModal";
import { OTPInput } from "@/components/OtpInput";
import { styles } from "@/constants/styles";
import { OnboardingAdmin, sendOtp } from "@/services/adminAuthService";
import { getOnboardingStatus } from "@/services/onboardingStatus";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { stepRoutes } from "@/types";
import { saveAuth } from "@/utils/authStorage";

export default function AdminNumberVerificationPage() {
  const router = useRouter();

  const { fullName, phone, email } = useLocalSearchParams<{
    fullName?: string;
    phone?: string;
    email?: string;
  }>();

  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  const [feedback, setFeedback] = useState({
    visible: false,
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const getNormalizedPhone = () => {
    if (!phone) return "";

    let p = phone.trim().replace(/\s/g, "");
    if (p.startsWith("+234")) return p;
    if (p.startsWith("234")) return `+${p}`;
    if (p.startsWith("0")) return `+234${p.slice(1)}`;
    return `+${p}`;
  };

  const handleVerify = async () => {
    if (!fullName || !phone || !email) {
      setFeedback({
        visible: true,
        message: "Missing user data",
        variant: "error",
      });
      return;
    }

    const cleanOtp = otp.replace(/\D/g, "");
    if (cleanOtp.length !== 6) {
      setFeedback({
        visible: true,
        message: "Enter a valid 6-digit OTP",
        variant: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      console.log("VERIFY PAYLOAD:", {
        fullName,
        email,
        phone: getNormalizedPhone(),
        otp: cleanOtp,
      });

      const res = await OnboardingAdmin({
        full_name: fullName,
        email: email.toLowerCase(),
        phone_number: getNormalizedPhone(),
        otp_code: cleanOtp,
      });

      await saveAuth(res.access, res.refresh);

      const status = await getOnboardingStatus();
      console.log("STATUS RESPONSE:", status);

      const step = status?.onboarding_step ?? 0;

      useOnboardingStore.getState().setOnboarding(step);

      console.log("ZUSTAND UPDATED STEP:", step);

      const route = stepRoutes[step] || "/superForm";
      router.replace(route as any);
    } catch (err: any) {
      let errorMessage = "Something went wrong";

      const backendError =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.message ||
        "";

      console.log("FULL ERROR:", backendError);

      const lowerError = backendError.toLowerCase();

      if (
        lowerError.includes("email") &&
        lowerError.includes("already exists")
      ) {
        errorMessage =
          "This email is already registered. Please log in instead.";
      } else if (lowerError.includes("otp")) {
        errorMessage = "Invalid or expired OTP. Please try again.";
      } else if (backendError) {
        errorMessage = backendError;
      }

      setFeedback({
        visible: true,
        message: errorMessage,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* RESEND OTP */
  const handleResendOTP = async () => {
    if (timer > 0) return;

    try {
      setResending(true);
      await sendOtp(getNormalizedPhone());
      setTimer(60);

      setFeedback({
        visible: true,
        message: "OTP sent successfully",
        variant: "success",
      });
    } catch {
      setFeedback({
        visible: true,
        message: "Failed to resend OTP. Try again.",
        variant: "error",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={22} />
          </TouchableOpacity>

          <View style={styles.centeredContent}>
            <Text style={styles.pageTitle}>Verify your phone number</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to your phone
            </Text>

            <Text style={styles.emailDisplay}>{phone}</Text>

            <OTPInput value={otp} onChange={setOTP} />

            {timer > 0 ? (
              <Text>Resend in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResendOTP}>
                <Text>{resending ? "Resending..." : "Resend OTP"}</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.continueBtnText}>Verify Number</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* FEEDBACK MODAL */}
        <FeedbackModal
          visible={feedback.visible}
          message={feedback.message}
          variant={feedback.variant}
          onClose={() => setFeedback((prev) => ({ ...prev, visible: false }))}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
