// BankDetails.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BankData {
  bank: string;
  accountNumber: string;
  accountName: string;
}

export const DEFAULT_BANK_DATA: BankData = {
  bank: "",
  accountNumber: "",
  accountName: "",
};

interface Props {
  data: BankData | undefined;      // explicitly allows undefined from parent
  setData: (val: BankData) => void;
  onUpdate?: () => void;           // called when Update button is pressed
}

// ── Nigerian banks ────────────────────────────────────────────────────────────

const BANKS = [
  "Access Bank",
  "First Bank",
  "GTBank",
  "UBA",
  "Zenith Bank",
  "Fidelity Bank",
  "FCMB",
  "Union Bank",
  "Stanbic IBTC",
  "Sterling Bank",
  "Wema Bank",
  "Polaris Bank",
  "Keystone Bank",
  "Heritage Bank",
  "Providus Bank",
  "Kuda Bank",
  "Opay",
  "Palmpay",
  "Moniepoint",
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function BankDetails({
  data: dataProp,
  setData,
  onUpdate,
}: Props) {

  // ── FIX: resolve inside body so explicit data={undefined} is also caught ──
  const data: BankData = dataProp ?? DEFAULT_BANK_DATA;

  // Typed merge helper — never accidentally wipes sibling fields
  const update = (patch: Partial<BankData>) =>
    setData({ ...data, ...patch });

  return (
    <View style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Bank Details</Text>

        {/* What Bank? */}
        <Text style={styles.label}>What Bank?</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={data.bank}
            onValueChange={(val) => update({ bank: val })}
          >
            <Picker.Item label="Select Bank" value="" />
            {BANKS.map((b) => (
              <Picker.Item key={b} label={b} value={b} />
            ))}
          </Picker>
        </View>

        {/* Account Number */}
        <Text style={styles.label}>Account Number</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={10}
          value={data.accountNumber}
          onChangeText={(t) => update({ accountNumber: t })}
          placeholder="Enter 10-digit account number"
          placeholderTextColor="#bbb"
        />

        {/* Name on Account */}
        <Text style={styles.label}>Name on Account</Text>
        <TextInput
          style={styles.input}
          value={data.accountName}
          onChangeText={(t) => update({ accountName: t })}
          autoCapitalize="words"
          placeholder="Enter account name"
          placeholderTextColor="#bbb"
        />
      </ScrollView>

      {/* ── Fixed Update button at the bottom ── */}
      <View style={styles.updateBar}>
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={onUpdate}
          activeOpacity={0.85}
        >
          <Text style={styles.updateBtnText}>Update</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    fontWeight: "600",
    fontSize: 15,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 1,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 1,
    overflow: "hidden",
  },

  /* Update button bar */
  updateBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 28,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  updateBtn: {
    backgroundColor: "#D44C0C",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  updateBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});