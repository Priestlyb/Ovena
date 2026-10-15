import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import FeedbackModal from "@/components/FeedbackModal";
import { useBankAccount } from "@/hooks/account/useBankAccount";
import { useRequestBankDetailsChange } from "@/hooks/account/useRequestBankDetailsChange";

import { useTheme } from "@/constants/theme";
import { createStyles } from "@/constants/styles/PaymentDetailsScreen.styles";

export default function PaymentDetailsScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const { data: account, isLoading } = useBankAccount();

  const { mutate, isPending } = useRequestBankDetailsChange();

  const [showPinModal, setShowPinModal] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");

  const [feedback, setFeedback] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
    onAction: undefined as (() => void) | undefined,
  });

  const hasBankAccount = !!account?.bank_account_number && !!account?.bank_name;

  const closeModal = () => {
    if (isPending) return;

    setShowPinModal(false);
    setTransactionPin("");
  };

  const handlePress = () => {
    if (!hasBankAccount) {
      router.push("/(auth)/screens/CreateBankDetails");
      return;
    }

    setShowPinModal(true);
  };

  const handleContinue = () => {
    if (!transactionPin.trim()) {
      setFeedback({
        visible: true,
        title: "Transaction PIN",
        message: "Please enter your transaction PIN.",
        variant: "warning",
        onAction: undefined,
      });
      return;
    }

    mutate(
      {
        transaction_pin: transactionPin,
      },
      {
        onSuccess: () => {
          setShowPinModal(false);
          setTransactionPin("");

          setFeedback({
            visible: true,
            title: "Verification Successful",
            message: "An OTP has been sent. Please verify it to continue.",
            variant: "success",
            onAction: undefined,
          });

          setTimeout(() => {
            setFeedback((prev) => ({
              ...prev,
              visible: false,
            }));

            router.push({
              pathname: "/(auth)/screens/ChangeBankDetails",
              params: {
                bankName: account?.bank_name,
                bankCode: account?.bank_code,
                accountNumber: account?.bank_account_number,
                accountName: account?.bank_account_name,
              },
            });
          }, 1800);
        },
        onError: (error: any) => {
          setFeedback({
            visible: true,
            title: "Verification Failed",
            message:
              error?.response?.data?.detail ?? "Invalid transaction PIN.",
            variant: "error",
            onAction: undefined,
          });

          setTransactionPin("");

          setTransactionPin("");
        },
      },
    );
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <IconSymbol name="ArrowLeftIcon" size={22} color={theme.icon} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Payment methods</Text>

            <View style={styles.headerSpacer} />
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.primary} />
            </View>
          ) : (
            <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
              <View style={styles.cardRow}>
                <View style={styles.cardLeft}>
                  <IconSymbol
                    name="CreditCardIcon"
                    size={20}
                    color={theme.icon}
                  />

                  <View>
                    <Text style={styles.cardText}>
                      {hasBankAccount ? account.bank_name : "Add Bank Details"}
                    </Text>

                    {hasBankAccount && (
                      <>
                        <Text style={styles.accountName}>
                          {account.bank_account_name}
                        </Text>

                        <Text style={styles.accountNumber}>
                          ••••••
                          {account.bank_account_number.slice(-4)}
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                <IconSymbol
                  name="ChevronRightIcon"
                  size={20}
                  color={theme.icon}
                />
              </View>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <Modal
        transparent
        visible={showPinModal}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <IconSymbol name="LockClosedIcon" size={40} color={theme.primary} />

            <Text style={styles.modalTitle}>Verify Transaction PIN</Text>

            <Text style={styles.modalDescription}>
              Enter your transaction PIN to request an OTP before updating your
              bank details.
            </Text>

            <TextInput
              style={styles.pinInput}
              placeholder="Enter transaction PIN"
              placeholderTextColor={theme.textSecondary}
              value={transactionPin}
              onChangeText={setTransactionPin}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={6}
              textContentType="oneTimeCode"
              editable={!isPending}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
                disabled={isPending}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  isPending && styles.disabledButton,
                ]}
                onPress={handleContinue}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.continueButtonText}>Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
        actionLabel={undefined}
        onAction={undefined}
      />
    </>
  );
}
