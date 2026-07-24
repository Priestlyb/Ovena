// components/OtpModal.tsx

import React, { useRef } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  otp: string[];
  setOtp: (otp: string[]) => void;
  verifying: boolean;
  onVerify: () => void;
  onClose: () => void;
}

const OTP_LENGTH = 6;

export const OtpModal = ({
  visible,
  otp,
  setOtp,
  verifying,
  onVerify,
  onClose,
}: Props) => {
  const inputsRef = useRef<TextInput[]>([]);

  const handleOtpChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // move forward
    if (text && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // move backward
    if (!text && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enter OTP</Text>
          <Text style={styles.modalSubtitle}>
            Enter the 6-digit code sent to your email address
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputsRef.current[index] = ref;
                }}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                keyboardType="number-pad"
                maxLength={1}
                style={styles.otpInput}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={onVerify}
            disabled={verifying}
          >
            {verifying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ color: "#999" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ================= STYLES =================

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#777",
    marginVertical: 10,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    width: "100%",
  },
  otpInput: {
    width: 45,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    fontSize: 18,
  },
  verifyButton: {
    backgroundColor: "#FF5920",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  closeBtn: {
    marginTop: 15,
  },
});
