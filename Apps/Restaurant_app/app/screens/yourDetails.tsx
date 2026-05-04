// YourDetailsPage.tsx

import { styles } from "@/constants/styles";
import apiClient from "@/services/apiClient";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from "react-native";

// Atomic Components
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";

// Molecule Components
import { Header } from "@/components/molecules/Header";

// Existing Components
import { CustomInput } from "@/components/CustomInput";
import { OtpModal } from "@/components/OtpModal"; // ✅ NEW
import { useRouter } from "expo-router";

interface UserDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
}

const OTP_LENGTH = 6;

const YourDetailsPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  // OTP STATES
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const router = useRouter();

  // ----------------------
  // Fetch profile
  // ----------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/accounts/profile/", {
          params: { profile_type: "businessadmin" },
        });

        const user = response.data.user;

        const [first, ...rest] = (user.name || "").split(" ");
        const last = rest.join(" ");

        setFirstName(first || "");
        setLastName(last || "");
        setPhoneNumber(user.phone_number || "");
        setEmailAddress(user.email || "");
      } catch (err: any) {
        console.warn("❌ Failed to fetch profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // ----------------------
  // Handle Save (TRIGGERS OTP)
  // ----------------------
  const handleSave = async () => {
    const fullName = `${firstName} ${lastName}`.trim();

    const payload: any = {
      phone_number: phoneNumber,
      full_name: fullName,
    };

    if (emailAddress?.trim()) {
      payload.email = emailAddress;
    }

    try {
      setSaving(true);

      await apiClient.patch("/business/admin/update/", payload);

      setOtpModalVisible(true);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to update profile",
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

    if (otpCode.length !== 6) {
      Alert.alert("Error", "Enter complete OTP");
      return;
    }

    try {
      setVerifyingOtp(true);

      await apiClient.post("/business/admin/update/verify/", {
        otp_code: Number(otpCode),
      });

      setOtpModalVisible(false);
      setOtp(Array(OTP_LENGTH).fill(""));

      Alert.alert("Success", "Profile updated successfully!");
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Invalid OTP");
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

        {/* ✅ OTP MODAL COMPONENT */}
        <OtpModal
          visible={otpModalVisible}
          otp={otp}
          setOtp={setOtp}
          verifying={verifyingOtp}
          onVerify={handleVerifyOtp}
          onClose={() => setOtpModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default YourDetailsPage;
