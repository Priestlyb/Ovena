// components/Points/WithdrawalModal.tsx

import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme, ThemeColors } from "@/constants/theme";

interface WithdrawalModalProps {
  visible: boolean;
  availablePoints: number;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (points: number) => Promise<void> | void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  visible,
  availablePoints,
  loading = false,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!visible) {
      setAmount("");
    }
  }, [visible]);

  const numericAmount = useMemo(() => {
    const value = Number(amount);

    if (Number.isNaN(value)) {
      return 0;
    }

    return value;
  }, [amount]);

  const error = useMemo(() => {
    if (!amount.length) {
      return "";
    }

    if (numericAmount <= 0) {
      return "Enter a valid amount.";
    }

    if (numericAmount > availablePoints) {
      return "You don't have enough points.";
    }

    return "";
  }, [amount, numericAmount, availablePoints]);

  const canSubmit =
    amount.length > 0 &&
    numericAmount > 0 &&
    numericAmount <= availablePoints &&
    !loading;

  const handleWithdraw = async () => {
    if (!canSubmit) {
      return;
    }

    await onSubmit(numericAmount);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.sheet}
          >
            <View style={styles.handle} />

            <Text style={styles.title}>Withdraw Points</Text>

            <Text style={styles.subtitle}>
              Enter the number of points you want to withdraw.
            </Text>

            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Available Points</Text>

              <Text style={styles.balanceValue}>
                {availablePoints.toLocaleString()}
              </Text>
            </View>

            <Text style={styles.label}>Withdrawal Amount</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                placeholder="Enter amount"
                placeholderTextColor={theme.textSecondary}
                editable={!loading}
              />

              <TouchableOpacity
                disabled={loading || availablePoints === 0}
                onPress={() => setAmount(String(availablePoints))}
                style={styles.maxButton}
              >
                <Text style={styles.maxText}>MAX</Text>
              </TouchableOpacity>
            </View>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <Text style={styles.note}>
              Minimum withdrawal depends on your rewards policy.
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                disabled={loading}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.withdrawButton,
                  !canSubmit && styles.disabledButton,
                ]}
                disabled={!canSubmit}
                onPress={handleWithdraw}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.withdrawText}>Withdraw</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default WithdrawalModal;

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
      justifyContent: "flex-end",
    },

    sheet: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 22,
      paddingTop: 16,
      paddingBottom: 34,
    },

    handle: {
      width: 48,
      height: 5,
      borderRadius: 20,
      alignSelf: "center",
      backgroundColor: theme.mode === "dark" ? "#555555" : "#D7D7D7",
      marginBottom: 22,
    },

    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    subtitle: {
      marginTop: 8,
      fontSize: 15,
      lineHeight: 22,
      color: theme.textSecondary,
    },

    balanceCard: {
      marginTop: 24,
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 18,
    },

    balanceLabel: {
      color: theme.textSecondary,
      fontSize: 14,
    },

    balanceValue: {
      marginTop: 6,
      fontSize: 32,
      fontWeight: "800",
      color: theme.primary,
    },

    label: {
      marginTop: 28,
      marginBottom: 10,
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
    },

    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      backgroundColor: theme.surface,
      overflow: "hidden",
    },

    input: {
      flex: 1,
      paddingHorizontal: 18,
      paddingVertical: 16,
      fontSize: 20,
      fontWeight: "600",
      color: theme.textPrimary,
    },

    maxButton: {
      paddingHorizontal: 18,
      paddingVertical: 16,
      backgroundColor: theme.primary,
    },

    maxText: {
      color: "#FFFFFF",
      fontWeight: "700",
    },

    errorText: {
      marginTop: 10,
      color: theme.error,
      fontSize: 14,
    },

    note: {
      marginTop: 18,
      color: theme.textSecondary,
      fontSize: 13,
      lineHeight: 20,
    },

    buttonRow: {
      flexDirection: "row",
      marginTop: 30,
    },

    cancelButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      marginRight: 10,
      backgroundColor: theme.background,
    },

    cancelText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
    },

    withdrawButton: {
      flex: 1,
      backgroundColor: theme.primary,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 10,
    },

    withdrawText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 16,
    },

    disabledButton: {
      opacity: 0.5,
    },
  });
