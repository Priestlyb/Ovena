import FeedbackModal from "@/components/FeedbackModal";
import { OTPInput } from "@/components/OtpInput";
import { styles } from "@/constants/styles";
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
  const [otp, setOTP] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  /* =========================================================
     VALIDATION
  ========================================================== */
  const validateOTP = () => {
    const errors: string[] = [];

    if (!otp.trim()) {
      errors.push("OTP code is required");
    }

    if (otp && otp.length !== 6) {
      errors.push("OTP must be a 6-digit code");
    }

    if (!/^\d+$/.test(otp)) {
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
     HANDLE VERIFY
  ========================================================== */
  const handleVerify = async () => {
    if (loading) return;

    if (!validateOTP()) return;

    setLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 1000));

      setModalConfig({
        message: "Email verified successfully",
        variant: "success",
      });
      setModalVisible(true);
    } catch (err) {
      console.error("Email Verification Error:", err);

      setModalConfig({
        message: "Failed to verify OTP",
        variant: "error",
      });
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     HANDLE RESEND OTP
  ========================================================== */
  const handleResendOTP = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 500));

      setModalConfig({
        message: "A new code has been sent to your email.",
        variant: "info",
      });
      setModalVisible(true);
    } catch (err) {
      console.error("Resend OTP Error:", err);

      setModalConfig({
        message: "Failed to resend OTP",
        variant: "error",
      });
      setModalVisible(true);
    } finally {
      setLoading(false);
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

          {/* OTP Form */}
          <View style={styles.centeredContent}>
            <Text style={styles.pageTitle}>Confirm Your Email Address</Text>
            <Text style={styles.subtitle}>Check your email for the code.</Text>
            <Text style={styles.emailDisplay}>{email}</Text>

            <OTPInput value={otp} onChange={setOTP} />

            <View style={styles.resendSection}>
              <Text style={styles.resendText}>No code in your inbox?</Text>
              <TouchableOpacity onPress={handleResendOTP}>
                <Text style={styles.resendLink}>Tap to resend OTP</Text>
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

          {loading && (
            <ActivityIndicator style={{ marginTop: 10 }} size="small" />
          )}
        </View>

        {/* FEEDBACK MODAL */}
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
