import React, { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Modal,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Text } from "@/components/atoms/Text";

type AccountDetails = {
  bank_name?: string;
  account_number?: string;
};

type WithdrawModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;

  amount: string;
  setAmount: (value: string) => void;

  pin: string[];
  setPin: (pin: string[]) => void;

  withdrawing: boolean;
  withdrawError: string | null;
  clearError?: () => void;

  accountDetails?: AccountDetails | null;
};

export function WithdrawModal({
  visible,
  onClose,
  onConfirm,
  amount,
  setAmount,
  pin,
  setPin,
  withdrawing,
  withdrawError,
  clearError,
  accountDetails,
}: WithdrawModalProps) {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Withdraw Funds
          </Text>

          {accountDetails && (
            <Text
              style={{
                marginTop: 8,
                color: "#6B7280",
              }}
            >
              {accountDetails.bank_name} • {accountDetails.account_number}
            </Text>
          )}

          <TextInput
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 8,
              padding: 12,
              marginTop: 16,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            {pin.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(val) => {
                  const newPin = [...pin];
                  const cleaned = val.slice(-1);

                  newPin[index] = cleaned;
                  setPin(newPin);

                  clearError?.();

                  if (cleaned && index < pin.length - 1) {
                    inputRefs.current[index + 1]?.focus();
                  }
                }}
                onKeyPress={({ nativeEvent }) => {
                  if (
                    nativeEvent.key === "Backspace" &&
                    !pin[index] &&
                    index > 0
                  ) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                keyboardType="numeric"
                maxLength={1}
                style={{
                  width: 50,
                  height: 50,
                  borderWidth: 1,
                  borderColor: withdrawError ? "#DC2626" : "#E5E7EB",
                  borderRadius: 8,
                  textAlign: "center",
                  fontSize: 18,
                }}
              />
            ))}
          </View>

          {withdrawError && (
            <Text
              style={{
                marginTop: 20,
                color: "#DC2626",
                textAlign: "center",
                fontSize: 13,
                fontWeight: "500",
              }}
            >
              {withdrawError}
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              marginTop: 24,
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 10,
                backgroundColor: "#E5E7EB",
                alignItems: "center",
              }}
              onPress={onClose}
              disabled={withdrawing}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 10,
                backgroundColor: "#FF5A1F",
                alignItems: "center",
              }}
              onPress={onConfirm}
              disabled={withdrawing}
            >
              {withdrawing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "600",
                  }}
                >
                  Confirm
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
