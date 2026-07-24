import FeedbackModal from "@/components/FeedbackModal";
import { OTPInput } from "@/components/OtpInput";
import { styles } from "@/constants/styles";
import { useSendEmailOtp } from "@/hooks/useSendEmailOtp";
import { useVerifyEmailOtp } from "@/hooks/useVerifyEmailOtp";
import { NavigationProps } from "@/types";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/* =========================================================
   STRICT PROPS
========================================================= */
interface EmailVerificationPageProps extends NavigationProps<string> {
  email: string;
}

/* =========================================================
   COMPONENT
========================================================= */
const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({
  email,
  onNext,
  onBack,
}) => {
  const [otp, setOTP] = useState("");

  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const { sendEmailOtp } = useSendEmailOtp();
  const { verifyEmailOtp } = useVerifyEmailOtp();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  /* =========================================================
     VALIDATION
  ========================================================= */
  const validateOTP = () => {
    const errors: string[] = [];

    if (!otp.trim()) {
      errors.push("OTP code is required");
    }

    if (otp && otp.length !== 6) {
      errors.push("OTP must be a 6-digit code");
    }

    if (otp && !/^\d+$/.test(otp)) {
      errors.push("OTP must contain only numbers");
    }

    if (errors.length > 0) {
      setModalConfig({
        message: errors.map((e) => `• ${e}`).join("\n"),
        variant: "error",
      });

      setModalVisible(true);
      return false;
    }

    return true;
  };

  /* =========================================================
     VERIFY OTP
  ========================================================= */
  const handleVerify = async () => {
    if (loading) return;

    if (!validateOTP()) return;

    try {
      setLoading(true);

      console.log("📧 Verifying OTP:", {
        email,
        otp,
      });

      await verifyEmailOtp({
        email,
        otp_code: otp,
      });

      setModalConfig({
        message: "Email verified successfully.",
        variant: "success",
      });

      setModalVisible(true);
    } catch (err) {
      console.error("Email Verification Error:", err);

      setModalConfig({
        message: "Failed to verify the verification code.",
        variant: "error",
      });

      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RESEND OTP
  ========================================================= */
  const handleResendOTP = async () => {
    if (sendingOtp) return;

    try {
      setSendingOtp(true);

      console.log("📧 Resending OTP to:", email);

      await sendEmailOtp({
        email,
      });

      setModalConfig({
        message: "A new verification code has been sent to your email.",
        variant: "info",
      });

      setModalVisible(true);
    } catch (err) {
      console.error("Resend OTP Error:", err);

      setModalConfig({
        message: "Failed to resend the verification code.",
        variant: "error",
      });

      setModalVisible(true);
    } finally {
      setSendingOtp(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={22} />
          </TouchableOpacity>

          {/* OTP Content */}
          <View style={styles.centeredContent}>
            <Text style={styles.pageTitle}>Confirm Your Email Address</Text>

            <Text style={styles.subtitle}>
              Enter the verification code sent to:
            </Text>

            <Text style={styles.pageTitle}>{email}</Text>

            <OTPInput value={otp} onChange={setOTP} />

            <View style={styles.resendSection}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>

              <TouchableOpacity onPress={handleResendOTP} disabled={sendingOtp}>
                <Text style={styles.resendLink}>
                  {sendingOtp ? "Sending..." : "Tap to resend OTP"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.continueBtnText}>
              {loading ? "Verifying..." : "Verify Email"}
            </Text>
          </TouchableOpacity>

          {(loading || sendingOtp) && (
            <ActivityIndicator size="small" style={{ marginTop: 10 }} />
          )}
        </View>

        {/* Feedback Modal */}
        <FeedbackModal
          visible={modalVisible}
          message={modalConfig.message}
          variant={modalConfig.variant}
          onClose={() => {
            setModalVisible(false);

            if (modalConfig.variant === "success") {
              onNext(otp);
            }
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EmailVerificationPage;
