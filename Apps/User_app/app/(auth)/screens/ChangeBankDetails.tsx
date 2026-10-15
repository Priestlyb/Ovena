import React, { useEffect, useMemo, useState } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import FeedbackModal from "@/components/FeedbackModal";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { CustomDropdown } from "@/components/CustomDropDown";
import { DropdownOption } from "@/types";

import { useBanks } from "@/hooks/account/useBanks";
import { useConfirmAccountChange } from "@/hooks/account/useConfirmAccountChange";

import { useTheme } from "@/constants/theme";
import { createStyles } from "@/constants/styles/ChangeBankDetails.styles";

export default function ChangeBankDetails() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const params = useLocalSearchParams<{
    bankName?: string;
    bankCode?: string;
    accountNumber?: string;
    accountName?: string;
  }>();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useConfirmAccountChange();

  const { data: banks = [], isLoading: banksLoading } = useBanks();

  const [otpCode, setOtpCode] = useState("");
  const [selectedBank, setSelectedBank] = useState<DropdownOption | null>(null);
  const [accountNumber, setAccountNumber] = useState(
    params.accountNumber ?? "",
  );
  const [accountName, setAccountName] = useState(params.accountName ?? "");

  const [feedback, setFeedback] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
    onAction: undefined as (() => void) | undefined,
  });

  const bankOptions = useMemo(
    () =>
      banks
        .filter((bank) => bank.active)
        .map((bank) => ({
          label: bank.name,
          value: bank.code,
        })),
    [banks],
  );

  useEffect(() => {
    if (!params.bankCode || bankOptions.length === 0) return;

    const bank = bankOptions.find((item) => item.value === params.bankCode);

    if (bank) {
      setSelectedBank(bank);
    }
  }, [params.bankCode, bankOptions]);

  const handleSubmit = () => {
    if (
      !otpCode.trim() ||
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
        otp_code: otpCode.trim(),
        bank_name: selectedBank.label,
        bank_code: selectedBank.value,
        bank_account_number: accountNumber.trim(),
        bank_account_name: accountName.trim(),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["customer-account"],
          });

          setFeedback({
            visible: true,
            title: "Success",
            message: "Your bank details have been updated successfully.",
            variant: "success",
            onAction: () => router.back(),
          });
        },
        onError: (error: any) => {
          setFeedback({
            visible: true,
            title: "Unable to Update",
            message:
              error?.response?.data?.detail ??
              "Unable to update your bank details.",
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

            <Text style={styles.title}>Change Bank Details</Text>

            <View style={{ width: 42 }} />
          </View>

          <Text style={styles.subtitle}>
            Enter the verification code sent to your email along with your new
            bank details.
          </Text>

          {/* OTP */}
          <Text style={styles.label}>OTP Code</Text>

          <TextInput
            style={styles.otpInput}
            placeholder="Enter OTP"
            placeholderTextColor={theme.textSecondary}
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="number-pad"
            maxLength={6}
            textContentType="oneTimeCode"
          />

          {/* Bank */}
          <CustomDropdown
            label="Bank"
            placeholder={banksLoading ? "Loading banks..." : "Select your bank"}
            options={bankOptions}
            value={selectedBank}
            onChange={setSelectedBank}
            disabled={banksLoading}
            required
          />

          {/* Account Number */}
          <Text style={styles.label}>Account Number</Text>

          <TextInput
            style={styles.input}
            placeholder="0123456789"
            placeholderTextColor={theme.textSecondary}
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="number-pad"
            maxLength={10}
          />

          {/* Account Name */}
          <Text style={styles.label}>Account Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Patrick Malachy Bassey"
            placeholderTextColor={theme.textSecondary}
            value={accountName}
            onChangeText={setAccountName}
            autoCapitalize="words"
          />

          {/* Button */}
          <TouchableOpacity
            style={[styles.button, isPending && styles.buttonDisabled]}
            disabled={isPending}
            onPress={handleSubmit}
          >
            {isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Update Bank Details</Text>
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
