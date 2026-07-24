// YourDetailsPage.tsx

import { styles } from "@/constants/styles";
import apiClient from "@/services/apiClient";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// Atomic Components
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";

// Molecule Components
import { Header } from "@/components/molecules/Header";

// Existing Components
import { CustomInput } from "@/components/CustomInput";
import FeedbackModal from "@/components/FeedbackModal";
import { OtpModal } from "@/components/OtpModal";

import { useRouter } from "expo-router";

const OTP_LENGTH = 6;

const YourDetailsPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  // OTP STATES
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Feedback Modal
  const [feedback, setFeedback] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  const router = useRouter();

  const showFeedback = (
    message: string,
    variant: "success" | "error" | "warning" | "info",
    title?: string,
  ) => {
    setFeedback({
      visible: true,
      title: title || "",
      message,
      variant,
    });
  };

  // ----------------------
  // Fetch profile
  // ----------------------
  const fetchProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);

      const response = await apiClient.get("/accounts/profile/", {
        params: {
          profile_type: "businessadmin",
        },
      });

      console.log("Profile fetched successfully:", response.data);

      const user = response.data?.user;
      const profile = response.data?.profile;

      const fullName = profile?.name || "";

      const [first, ...rest] = fullName.split(" ");

      const last = rest.join(" ");

      const email = (user?.email || "").trim();

      setFirstName(first || "");

      setLastName(last || "");

      setPhoneNumber(user?.phone_number || "");

      setEmailAddress(email);

      setOriginalEmail(email);
    } catch (err: any) {
      console.warn(
        "❌ Failed to fetch profile:",
        err.response?.data || err.message,
      );

      showFeedback("Failed to load profile", "error");
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ----------------------
  // Handle Save
  // ----------------------
  const handleSave = async () => {
    const fullName = `${firstName} ${lastName}`.trim();

    const payload: any = {
      phone_number: phoneNumber.trim(),

      name: fullName,
    };

    const trimmedEmail = emailAddress.trim();

    if (
      trimmedEmail &&
      trimmedEmail.toLowerCase() !== originalEmail.trim().toLowerCase()
    ) {
      payload.email = trimmedEmail;
    }

    console.log("📤 Update Payload:", payload);

    try {
      setSaving(true);

      await apiClient.patch("/business/admin/update/", payload);

      setOtpModalVisible(true);
    } catch (err: any) {
      console.log("❌ Update Error:", err.response?.data);

      showFeedback(
        err.response?.data?.message || "Failed to update profile",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------
  // VERIFY OTP
  // ----------------------
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== OTP_LENGTH) {
      showFeedback("Enter complete OTP", "warning");

      return;
    }

    try {
      setVerifyingOtp(true);

      await apiClient.post("/business/admin/update/verify/", {
        otp_code: Number(otpCode),
      });

      setOtpModalVisible(false);

      setOtp(Array(OTP_LENGTH).fill(""));

      await fetchProfile();

      showFeedback("Profile updated successfully!", "success");
    } catch (err: any) {
      showFeedback(err.response?.data?.message || "Invalid OTP", "error");
    } finally {
      setVerifyingOtp(false);
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
        >
          <Header
            title="Your Details"
            leftIcon={<ArrowLeft size={24} color="#111827" />}
            onLeftIconPress={() => router.push("/(tabs)/profile")}
          />

          <Spacer size="lg" />

          {loadingProfile ? (
            <ActivityIndicator size="large" color="#F65513" />
          ) : (
            <>
              <CustomInput
                placeholder="Enter Your First name"
                label="First name"
                value={firstName}
                onChange={setFirstName}
              />

              <CustomInput
                placeholder="Enter Your Last Name"
                label="Last name"
                value={lastName}
                onChange={setLastName}
              />

              <CustomInput
                placeholder="Enter Your Phone Number"
                label="Phone number"
                value={phoneNumber}
                onChange={setPhoneNumber}
              />

              <CustomInput
                placeholder="Enter Your Email"
                label="Email address"
                value={emailAddress}
                onChange={setEmailAddress}
              />

              <Spacer size="xl" />

              <TouchableOpacity
                style={styles.continueBtn}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.continueBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        <OtpModal
          visible={otpModalVisible}
          otp={otp}
          setOtp={setOtp}
          verifying={verifyingOtp}
          onVerify={handleVerifyOtp}
          onClose={() => setOtpModalVisible(false)}
        />

        <FeedbackModal
          visible={feedback.visible}
          title={feedback.title}
          message={feedback.message}
          variant={feedback.variant}
          onClose={() =>
            setFeedback((prev) => ({
              ...prev,
              visible: false,
            }))
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default YourDetailsPage;
