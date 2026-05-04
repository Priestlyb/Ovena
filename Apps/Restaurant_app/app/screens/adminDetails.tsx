// app/screens/adminDetails.tsx
import { CustomInput } from "@/components/CustomInput";
import { PhoneInput } from "@/components/PhoneInput";
import { styles } from "@/constants/styles";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AdminDetailsScreen: React.FC = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showError = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  /**
   Normalize email (trim + lowercase)
   */
  const normalizeEmail = (email: string) => {
    return email.trim().toLowerCase();
  };

  /**
   Validate Gmail only (after normalization)
   */
  const isValidEmail = (email: string) => {
    const normalized = normalizeEmail(email);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(normalized);
  };

  /**
   Normalize ANY Nigerian phone format to +234XXXXXXXXXX
   */
  const normalizeNigerianPhone = (input: string): string => {
    let cleaned = input.replace(/[\s-()]/g, "");

    if (cleaned.startsWith("00")) {
      cleaned = "+" + cleaned.slice(2);
    }

    if (/^234\d{10}$/.test(cleaned)) {
      cleaned = "+" + cleaned;
    }

    if (/^0\d{10}$/.test(cleaned)) {
      cleaned = "+234" + cleaned.slice(1);
    }

    if (/^\d{10}$/.test(cleaned)) {
      cleaned = "+234" + cleaned;
    }

    return cleaned;
  };

  const isValidNigerianPhone = (input: string) => {
    const normalized = normalizeNigerianPhone(input);

    const isCorrectFormat = /^\+234\d{10}$/.test(normalized);
    const isCorrectLength = normalized.length === 14;

    return {
      isValid: isCorrectFormat && isCorrectLength,
      normalized,
    };
  };

  const handleNext = () => {
    const cleanedEmail = normalizeEmail(email);

    if (!fullName.trim() || !phone.trim() || !cleanedEmail) {
      showError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(cleanedEmail)) {
      showError("Email must be a valid Gmail address (e.g example@gmail.com)");
      return;
    }

    const { isValid, normalized } = isValidNigerianPhone(phone);

    if (!isValid) {
      showError(
        "Phone number must be a valid Nigerian number with 11 digits (e.g 08012345678 or +2348012345678)",
      );
      return;
    }

    router.push({
      pathname: "/screens/adminNumberVerificationPage",
      params: {
        fullName: fullName.trim(),
        phone: normalized,
        email: cleanedEmail,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/")}
          >
            <ArrowLeft size={22} />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Register Administrator</Text>

          <CustomInput
            label="Full Name"
            placeholder="e.g Clinton Bassey"
            value={fullName}
            onChange={setFullName}
            required
          />

          <CustomInput
            type="email"
            label="Email Address"
            placeholder="e.g example@gmail.com"
            value={email}
            onChange={setEmail}
            required
          />

          <PhoneInput value={phone} onChange={setPhone} required />

          <TouchableOpacity style={styles.continueBtn} onPress={handleNext}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Custom Modal */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "80%",
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 20,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                {modalMessage}
              </Text>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: "#F65513",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminDetailsScreen;
