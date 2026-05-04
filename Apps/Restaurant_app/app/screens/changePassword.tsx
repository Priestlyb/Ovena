// ChangePasswordPage.tsx - Final (Improved Error Handling + Modal Integration)

import { styles } from "@/constants/styles";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

// Atomic Components
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";

// Molecule Components
import { Header } from "@/components/molecules/Header";

// Existing Components
import { CustomInput } from "@/components/CustomInput";
import FeedbackModal from "@/components/FeedbackModal";

// Services
import apiClient from "@/services/apiClient";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword] = useState(false);
  const [showNewPassword] = useState(false);
  const [showConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  // ----------------------
  // Handle Change Password
  // ----------------------
  const handleChangePassword = async () => {
    if (loading) return;

    // ✅ Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setModalConfig({
        message: "All fields are required",
        variant: "warning",
      });
      setModalVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalConfig({
        message: "Passwords do not match",
        variant: "error",
      });
      setModalVisible(true);
      return;
    }

    if (newPassword.length < 8) {
      setModalConfig({
        message: "Password must be at least 8 characters",
        variant: "warning",
      });
      setModalVisible(true);
      return;
    }

    try {
      setLoading(true);

      console.log("📤 Sending change password request...");

      await apiClient.post("/accounts/change-password/", {
        password: currentPassword,
        new_password: newPassword,
      });

      console.log("✅ Password changed successfully");

      setModalConfig({
        message: "Your password has been changed successfully",
        variant: "success",
      });
      setModalVisible(true);
    } catch (err: any) {
      console.error(
        "❌ Change password failed:",
        err?.response?.data || err?.message,
      );

      let message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";

      if (message === "Invalid password") {
        message = "Your current password is incorrect.";
      }

      if (message.toLowerCase().includes("network")) {
        message = "Network error. Please check your connection.";
      }

      setModalConfig({
        message,
        variant: "error",
      });

      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (newPassword.length === 0) return [];
    const strength = [];
    for (let i = 0; i < 6; i++) {
      strength.push(i < Math.min(newPassword.length / 2, 6));
    }
    return strength;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header
          title="Change Password"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={() => router.back()}
        />

        {/* Current Password */}
        <View style={[styles.inputContainer, { marginTop: 50 }]}>
          <Text variant="label">Current Password</Text>
          <Spacer size="xs" />
          <View style={styles.passwordInputWrapper}>
            <CustomInput
              placeholder="Enter current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              type={showCurrentPassword ? "text" : "password"}
            />
          </View>
        </View>

        <Spacer size="md" />

        {/* New Password */}
        <View style={styles.inputContainer}>
          <Text variant="label">New Password</Text>
          <Spacer size="xs" />
          <View style={styles.passwordInputWrapper}>
            <CustomInput
              placeholder="at least 8 characters"
              value={newPassword}
              onChange={setNewPassword}
              type={showNewPassword ? "text" : "password"}
            />
          </View>

          {/* Strength */}
          <Spacer size="sm" />
          <View style={styles.passwordStrength}>
            {getPasswordStrength().map((filled, index) => (
              <View
                key={index}
                style={[
                  styles.passwordStrengthBar,
                  filled && styles.passwordStrengthBarFilled,
                ]}
              />
            ))}
          </View>
        </View>

        <Spacer size="md" />

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Text variant="label">Confirm New Password</Text>
          <Spacer size="xs" />
          <View style={styles.passwordInputWrapper}>
            <CustomInput
              placeholder="re-enter new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              type={showConfirmPassword ? "text" : "password"}
            />
          </View>
        </View>

        <Spacer size="lg" />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.continueBtn, loading && { opacity: 0.7 }]}
          onPress={handleChangePassword}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueBtnText}>Change Password</Text>
          )}
        </TouchableOpacity>

        <Spacer size="xl" />
      </ScrollView>

      <FeedbackModal
        visible={modalVisible}
        message={modalConfig.message}
        variant={modalConfig.variant}
        onClose={() => {
          setModalVisible(false);

          if (modalConfig.variant === "success") {
            router.back();
          }
        }}
      />
    </SafeAreaView>
  );
}
