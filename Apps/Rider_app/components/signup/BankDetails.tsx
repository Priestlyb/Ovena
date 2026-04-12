import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import FormInput, { validateField } from "../FormInput";

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
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Bank Details</Text>

          {/* ── Bank picker — shows label, stores both name + code ── */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Bank</Text>
            <View style={[styles.pickerBox, errors.bank_name ? styles.pickerError : null]}>
              <Picker
                selectedValue={data.bank_code}
                onValueChange={(code) => {
                  const bank = BANKS.find((b) => b.code === code);
                  update({
                    bank_code: code,
                    bank_name: bank?.label ?? "",
                  });
                  setErrors((p) => ({ ...p, bank_name: "" }));
                }}
              >
                <Picker.Item label="Select Bank" value="" />
                {BANKS.map((b) => (
                  <Picker.Item key={b.code} label={b.label} value={b.code} />
                ))}
              </Picker>
            </View>
            {errors.bank_name
              ? <Text style={styles.errorText}>{errors.bank_name}</Text>
              : null}
          </View>

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
  inputWrapper: { marginVertical: 10 },
  label: { marginBottom: 8, fontWeight: "600", color: "#333", fontSize: 16 },
  pickerBox: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 12,
    backgroundColor: "#fff", shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 4, elevation: 3,
  },
  pickerError: { borderColor: "#e53935", borderWidth: 1.5 },
  errorText: { color: "#e53935", fontSize: 12, marginTop: 4, marginLeft: 4 },
});