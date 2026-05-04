import { CustomInput } from "@/components/CustomInput";
import FeedbackModal from "@/components/FeedbackModal";
import { styles } from "@/constants/styles";
import { NavigationProps } from "@/types";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
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
  const [modalMessage, setModalMessage] = useState("");

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

    // Optional stronger rules
    if (data.password) {
      if (!/[A-Z]/.test(data.password)) {
        errors.push("Password must include at least one uppercase letter");
      }
      if (!/[0-9]/.test(data.password)) {
        errors.push("Password must include at least one number");
      }
    }

    if (errors.length > 0) {
      setModalMessage(errors.map((e) => `• ${e}`).join("\n"));
      setModalVisible(true);
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (!validateFields()) return;
    onNext();
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
        >
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={22} />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Begin your Ovena experience</Text>

          {/* Create Password */}
          <CustomInput
            label="Create Password"
            placeholder="at least 8 characters"
            value={data.password}
            onChange={onChangePassword}
            type="password"
            required
          />

          {/* Confirm Password */}
          <CustomInput
            label="Confirm Password"
            placeholder="at least 8 characters"
            value={data.confirmPassword}
            onChange={onChangeConfirmPassword}
            type="password"
            required
          />

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* FEEDBACK MODAL */}
        <FeedbackModal
          visible={modalVisible}
          message={modalMessage}
          variant="error"
          onClose={() => setModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PasswordPage;
