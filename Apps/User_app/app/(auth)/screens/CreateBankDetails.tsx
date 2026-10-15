import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import FeedbackModal from "@/components/FeedbackModal";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { CustomDropdown } from "@/components/CustomDropDown";
import { DropdownOption } from "@/types";

import { useBanks } from "@/hooks/account/useBanks";
import { useCreateBankDetails } from "@/hooks/account/useCreateBankDetails";

import { useTheme } from "@/constants/theme";
import { createStyles } from "@/constants/styles/CreateBankDetails.styles";

export default function CreateBankDetails() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useCreateBankDetails();
  const { data, isLoading: banksLoading } = useBanks();

  const [transactionPin, setTransactionPin] = useState("");
  const [selectedBank, setSelectedBank] = useState<DropdownOption | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const [feedback, setFeedback] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
    onAction: undefined as (() => void) | undefined,
  });

  const bankOptions = useMemo(
    () =>
      (data ?? [])
        .filter((bank) => bank.active)
        .map((bank) => ({
          label: bank.name,
          value: bank.code,
        })),
    [data],
  );

  const handleSubmit = () => {
    if (
      !transactionPin.trim() ||
      !selectedBank ||
      !accountNumber.trim() ||
      !accountName.trim()
    ) {
      setFeedback({
        visible: true,
        title: "Missing Information",
        message: "Please complete all fields.",
        variant: "warning",
        onAction: undefined,
      });
      return;
    }

    mutate(
      {
        transaction_pin: transactionPin,
        bank_name: selectedBank.label,
        bank_code: selectedBank.value,
        bank_account_number: accountNumber,
        bank_account_name: accountName,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["customer-account"],
          });

          setFeedback({
            visible: true,
            title: "Success",
            message: "Bank details saved successfully.",
            variant: "success",
            onAction: () => router.back(),
          });
        },
        onError: (error: any) => {
          setFeedback({
            visible: true,
            title: "Error",
            message:
              error?.response?.data?.detail ?? "Unable to save bank details.",
            variant: "error",
            onAction: undefined,
          });
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <IconSymbol name="ArrowLeftIcon" size={22} color={theme.icon} />
            </TouchableOpacity>

            <Text style={styles.title}>Create Bank Details</Text>

            <View style={{ width: 42 }} />
          </View>

          {/* Form */}

          <Text style={styles.label}>
            Transaction PIN <Text style={styles.required}> *</Text>
          </Text>

          <Text style={styles.helperText}>
            Choose a 6-digit transaction PIN that you'll easily remember. You'll
            need it to authorize future withdrawals.
          </Text>

          <TextInput
            style={styles.inputPin}
            placeholder="Enter transaction PIN"
            placeholderTextColor={theme.textSecondary}
            value={transactionPin}
            onChangeText={setTransactionPin}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
          />

          <CustomDropdown
            label="Bank"
            placeholder={banksLoading ? "Loading banks..." : "Select your bank"}
            options={bankOptions}
            value={selectedBank}
            onChange={setSelectedBank}
            disabled={banksLoading}
            required
          />

          <Text style={styles.label}>
            Account Number <Text style={styles.required}> *</Text>
          </Text>

          <TextInput
            style={styles.input}
            placeholder="0123456789"
            placeholderTextColor={theme.textSecondary}
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="number-pad"
            maxLength={10}
          />

          <Text style={styles.label}>
            Account Name <Text style={styles.required}> *</Text>
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Patrick Malachy Bassey"
            placeholderTextColor={theme.textSecondary}
            value={accountName}
            onChangeText={setAccountName}
          />

          <TouchableOpacity
            style={[styles.button, isPending && styles.buttonDisabled]}
            disabled={isPending}
            onPress={handleSubmit}
          >
            {isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Save Bank Details</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
        actionLabel={feedback.onAction ? "OK" : undefined}
        onAction={feedback.onAction}
      />
    </SafeAreaView>
  );
}
