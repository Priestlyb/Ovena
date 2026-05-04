// ResetTransactionPINPage.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, MessageCircle } from "lucide-react-native";
import { styles } from "@/constants/styles";
import api from "@/services/apiClient";

// Atomic Components
import { Text } from "@/components/atoms/Text";
import { Spacer } from "@/components/atoms/Spacer";

// Components
import { PINInput } from "@/components/PINinput";
import { FloatingChatButton } from "@/components/FloatingChatButton";

type Step = "verify" | "create" | "confirm";

export default function ResetTransactionPINPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("verify");
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const [newPIN, setNewPIN] = useState(["", "", "", ""]);
  const [confirmPIN, setConfirmPIN] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(true);
  const [hasPin, setHasPin] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);

  // 🔹 Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastAnim] = useState(new Animated.Value(0));

  // 🔹 Show toast helper
  const showToast = (message: string) => {
    setToastMessage(message);
    Animated.timing(toastAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => hideToast(), 3000); // auto-hide after 3s
    });
  };

  const hideToast = () => {
    Animated.timing(toastAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setToastMessage(null));
  };

  // 🔹 Check if user already has a PIN
  useEffect(() => {
    const checkPin = async () => {
      try {
        const res = await api.get("/business/wallet/transaction-pin/");
        const exists = res?.data?.data?.has_transaction_pin;
        setHasPin(exists);
        if (!exists) setStep("create");
      } catch (err: any) {
        console.log("Error checking PIN:", err?.response || err.message);
        showToast("Failed to check PIN. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    checkPin();
  }, []);

  // 🔹 Handle Continue
  const handleContinue = async () => {
    if (step === "verify") {
      setStep("create");
      return;
    }
    if (step === "create") {
      setStep("confirm");
      return;
    }
    if (step === "confirm") {
      if (newPIN.join("") !== confirmPIN.join("")) {
        showToast("PINs do not match");
        return;
      }

      try {
        setSubmitting(true);
        const payload: any = {
          pin: newPIN.join(""),
          confirm_pin: confirmPIN.join(""),
        };
        if (hasPin) payload.current_pin = verificationCode.join("");

        await api.post("/business/wallet/transaction-pin/", payload);
        router.back();
      } catch (err: any) {
        console.log("Error setting PIN:", err?.response?.data || err.message);
        if (err?.response?.data) {
          const data = err.response.data;
          if (data.current_pin) showToast(data.current_pin[0]);
          else if (data.pin) showToast(data.pin[0]);
          else showToast("Failed to set PIN. Try again.");
        } else {
          showToast("Failed to set PIN. Try again.");
        }
      } finally {
        setSubmitting(false);
      }
    }
  };

  const getTitle = () => {
    switch (step) {
      case "verify":
        return "Current Pin";
      case "create":
      case "confirm":
        return "New Transaction PIN";
    }
  };

  const getDescription = () => {
    switch (step) {
      case "verify":
        return "Enter your current PIN to verify your identity before creating a new one";
      case "create":
      case "confirm":
        return "You need to create a 4-digit PIN to\nwithdraw money from your wallet";
    }
  };

  const getInputLabel = () => {
    switch (step) {
      case "create":
        return "Choose a PIN";
      case "confirm":
        return "Confirm PIN";
      default:
        return null;
    }
  };

  const getCurrentValue = () => {
    switch (step) {
      case "verify":
        return verificationCode;
      case "create":
        return newPIN;
      case "confirm":
        return confirmPIN;
    }
  };

  const handleChange = (value: string[]) => {
    switch (step) {
      case "verify":
        setVerificationCode(value);
        break;
      case "create":
        setNewPIN(value);
        break;
      case "confirm":
        setConfirmPIN(value);
        break;
    }
  };

  const isComplete = getCurrentValue().every((digit) => digit !== "");

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#F65513" />
          <Spacer size="md" />
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 🔹 Toast animation styles
  const translateY = toastAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0], // slide up
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Spacer size="lg" />
          <Text variant="h3" weight="semibold">
            {getTitle()}
          </Text>
          <Spacer size="md" />
          <Text variant="body" color="secondary">
            {getDescription()}
          </Text>
          <Spacer size="xxl" />
          <Spacer size="xxl" />

          {getInputLabel() && (
            <>
              <Text variant="body" weight="medium" align="center">
                {getInputLabel()}
              </Text>
              <Spacer size="lg" />
            </>
          )}

          <PINInput
            value={getCurrentValue()}
            onChange={handleChange}
            length={4}
          />
          <Spacer size="xxl" />
          <Spacer size="xxl" />
        </ScrollView>

        <TouchableOpacity
          style={[styles.continueBtn, submitting && { opacity: 0.6 }]}
          onPress={handleContinue}
          disabled={!isComplete || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueBtnText}>Continue</Text>
          )}
        </TouchableOpacity>

        {step === "confirm" && (
          <>
            <Spacer size="md" />
            <TouchableOpacity onPress={() => router.back()}>
              <Text variant="body" align="center">
                Go Back
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* 🔹 Custom Toast */}
      {toastMessage && (
        <Animated.View
          style={[toastStyles.toastContainer, { transform: [{ translateY }] }]}
        >
          <Text variant="body" style={{ color: "#fff", fontSize: 16 }}>
            {toastMessage}
          </Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

// 🔹 Toast styles
const toastStyles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 350,
    alignSelf: "center",
    backgroundColor: "#FF3B30",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: Dimensions.get("window").width * 0.7,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
