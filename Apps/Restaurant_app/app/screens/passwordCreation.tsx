import { CustomInput } from "@/components/CustomInput";
import FeedbackModal from "@/components/FeedbackModal";
import { styles } from "@/constants/styles";
import { useSendEmailOtp } from "@/hooks/useSendEmailOtp";
import { NavigationProps } from "@/types";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

/* =========================================================
   🔹 STRICT PROPS
========================================================= */
interface PasswordPageProps extends NavigationProps<void> {
  data: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  onChangePassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
}

/* =========================================================
   🔹 COMPONENT
========================================================= */
const PasswordPage: React.FC<PasswordPageProps> = ({
  data,
  onChangePassword,
  onChangeConfirmPassword,
  onNext,
  onBack,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    message: "",
    variant: "error" as "success" | "error" | "warning" | "info",
  });

  const [sendingOtp, setSendingOtp] = useState(false);

  const { sendEmailOtp } = useSendEmailOtp();

  /* =========================================================
     🔹 VALIDATION
  ========================================================= */
  const validateFields = () => {
    const errors: string[] = [];

    if (!data.password.trim()) {
      errors.push("Password is required");
    }

    if (!data.confirmPassword.trim()) {
      errors.push("Please confirm your password");
    }

    if (data.password && data.password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    if (
      data.password &&
      data.confirmPassword &&
      data.password !== data.confirmPassword
    ) {
      errors.push("Passwords do not match");
    }

    if (data.password) {
      if (!/[A-Z]/.test(data.password)) {
        errors.push("Password must include at least one uppercase letter");
      }

      if (!/[0-9]/.test(data.password)) {
        errors.push("Password must include at least one number");
      }
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
     🔹 CONTINUE
     🔹
     🔹 Validate password
     🔹 Send OTP
     🔹 Automatically navigate to next page on success
  ========================================================= */
  const handleContinue = async () => {
    // Prevent duplicate requests
    if (sendingOtp) return;

    // Validate password fields first
    if (!validateFields()) return;

    try {
      setSendingOtp(true);

      console.log("📧 Sending OTP to:", data.email);

      // Send verification code
      await sendEmailOtp({
        email: data.email,
      });

      console.log("✅ OTP sent successfully");

      // Automatically move to the next registration step
      onNext();
    } catch (err) {
      console.error("❌ Send OTP Error:", err);

      setModalConfig({
        message: "Failed to send verification code. Please try again.",
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
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* =====================================================
              BACK BUTTON
          ===================================================== */}
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={22} />
          </TouchableOpacity>

          {/* =====================================================
              TITLE
          ===================================================== */}
          <Text style={styles.pageTitle}>Begin your Ovena experience</Text>

          {/* =====================================================
              CREATE PASSWORD
          ===================================================== */}
          <CustomInput
            label="Create Password"
            placeholder="at least 8 characters"
            value={data.password}
            onChange={onChangePassword}
            type="password"
            required
          />

          {/* =====================================================
              CONFIRM PASSWORD
          ===================================================== */}
          <CustomInput
            label="Confirm Password"
            placeholder="at least 8 characters"
            value={data.confirmPassword}
            onChange={onChangeConfirmPassword}
            type="password"
            required
          />

          {/* =====================================================
              CONTINUE BUTTON
          ===================================================== */}
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
            disabled={sendingOtp}
            activeOpacity={0.8}
          >
            <Text style={styles.continueBtnText}>
              {sendingOtp ? "Sending Code..." : "Continue"}
            </Text>
          </TouchableOpacity>

          {/* =====================================================
              LOADING INDICATOR
          ===================================================== */}
          {sendingOtp && (
            <ActivityIndicator size="small" style={{ marginTop: 12 }} />
          )}
        </ScrollView>

        {/* =====================================================
            ERROR FEEDBACK MODAL

            Only errors are shown here.

            Successful OTP sending navigates automatically,
            so the user doesn't have to close a success modal.
        ===================================================== */}
        <FeedbackModal
          visible={modalVisible}
          message={modalConfig.message}
          variant={modalConfig.variant}
          onClose={() => {
            setModalVisible(false);
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PasswordPage;
