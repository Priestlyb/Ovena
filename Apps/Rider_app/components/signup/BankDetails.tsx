import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform,
} from "react-native";
import FormInput, { validateField } from "../FormInput";
import SelectField from "../SelectField";
import { useTheme } from "../../context/ThemeContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BankData {
  bank_name: string;       // visible label shown to the user
  bank_code: string;       // internal code sent to the backend
  account_number: string;
  account_name: string;
}

export const DEFAULT_BANK_DATA: BankData = {
  bank_name: "",
  bank_code: "",
  account_number: "",
  account_name: "",
};

// ── Nigerian banks — { label, code } ─────────────────────────────────────────
// bank_name is what the user sees; bank_code is what gets sent to the backend.
const BANKS: { label: string; code: string }[] = [
  { label: "Access Bank",    code: "044" },
  { label: "First Bank",     code: "011" },
  { label: "GTBank",         code: "058" },
  { label: "UBA",            code: "033" },
  { label: "Zenith Bank",    code: "057" },
  { label: "Fidelity Bank",  code: "070" },
  { label: "FCMB",           code: "214" },
  { label: "Union Bank",     code: "032" },
  { label: "Stanbic IBTC",   code: "221" },
  { label: "Sterling Bank",  code: "232" },
  { label: "Wema Bank",      code: "035" },
  { label: "Polaris Bank",   code: "076" },
  { label: "Keystone Bank",  code: "082" },
  { label: "Providus Bank",  code: "101" },
  { label: "Kuda Bank",      code: "50211" },
  { label: "OPay",           code: "999992" },
  { label: "Palmpay",        code: "999991" },
  { label: "Moniepoint",     code: "50515" },
];

// ── Validation ────────────────────────────────────────────────────────────────

type ErrorMap = Record<string, string>;

export function validateBankDetails(d: BankData): ErrorMap {
  return {
    bank_name:      d.bank_name ? "" : "Please select a bank.",
    account_number: validateField(d.account_number, "Account Number", "number", false, 10, 10),
    account_name:   validateField(d.account_name, "Account Name", "name"),
  };
}

export function isBankDetailsValid(errors: ErrorMap): boolean {
  return Object.values(errors).every((e) => !e);
}

export interface BankDetailsRef { triggerValidation: () => boolean; }

interface Props {
  data: BankData;
  setData: (val: BankData) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const BankDetails = forwardRef<BankDetailsRef, Props>(({ data, setData }, ref) => {
  const { colors } = useTheme();
  const [errors, setErrors] = useState<ErrorMap>({});

  useImperativeHandle(ref, () => ({
    triggerValidation: () => {
      const errs = validateBankDetails(data);
      setErrors(errs);
      return isBankDetailsValid(errs);
    },
  }));

  const update = (patch: Partial<BankData>) =>
    setData({ ...data, ...patch });

  const handleChange = (field: keyof BankData, value: string) => {
    update({ [field]: value });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>Bank Details</Text>

          {/* ── Bank picker — shows label, stores both name + code ── */}
          <SelectField
            label="Bank"
            options={BANKS.map((b) => ({ label: b.label, value: b.code }))}
            value={data.bank_code}
            onChange={(code) => {
              const bank = BANKS.find((b) => b.code === code);
              update({
                bank_code: code,
                bank_name: bank?.label ?? "",
              });
              setErrors((p) => ({ ...p, bank_name: "" }));
            }}
            placeholder="Select Bank"
            error={errors.bank_name}
          />

          {/* ── Account Number ── */}
          <FormInput
            label="Account Number"
            placeholder="10-digit account number"
            value={data.account_number}
            onChange={(t) => handleChange("account_number", t)}
            iconName="UserIcon"
            type="number"
            maxLength={10}
            error={errors.account_number}
          />

          {/* ── Account Name ── */}
          <FormInput
            label="Name on Account"
            value={data.account_name}
            onChange={(t) => handleChange("account_name", t)}
            iconName="UserIcon"
            type="name"
            error={errors.account_name}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
});

export default BankDetails;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  title: {
    fontSize: 22, fontWeight: "bold", marginBottom: 16,
    marginTop: 8, textAlign: "center",
  },
});