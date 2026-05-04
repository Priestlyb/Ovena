import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { usePhase2 } from "@/app/context/Phase2Context";
import { CustomDropdown } from "@/components/CustomDropDown";
import { CustomInput } from "@/components/CustomInput";
import FeedbackModal from "@/components/FeedbackModal";
import { styles } from "@/constants/styles";
import { useCompletionStore } from "@/stores/completionStore";

export default function PaymentsPage() {
  const router = useRouter();
  const markGroupComplete = useCompletionStore(
    (state) => state.markGroupComplete,
  );
  const { phase2Data, updatePhase2 } = usePhase2();

  // ====== State ======
  const [selectedBank, setSelectedBank] = useState(
    phase2Data.payment?.bank ?? "",
  );
  const [accountNumber, setAccountNumber] = useState(
    phase2Data.payment?.account_number ?? "",
  );
  const [accountName, setAccountName] = useState(
    phase2Data.payment?.account_name ?? "",
  );
  const [bvn, setBvn] = useState(phase2Data.payment?.bvn ?? "");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  const banks = [
    "Access Bank",
    "GTBank",
    "First Bank",
    "UBA",
    "Zenith Bank",
    "Ecobank",
    "Fidelity Bank",
    "Union Bank",
    "Stanbic IBTC",
    "Sterling Bank",
  ];

  /* ================= HELPERS ================= */
  const clean = (val: string) => String(val || "").trim();

  /* ================= VALIDATION ================= */
  const validate = () => {
    const errors: string[] = [];

    const cleaned = {
      bank: clean(selectedBank),
      accountNumber: clean(accountNumber),
      accountName: clean(accountName),
      bvn: clean(bvn),
    };

    if (!cleaned.bank) {
      errors.push("Select your bank");
    }

    if (!cleaned.accountNumber) {
      errors.push("Enter account number");
    } else {
      if (!/^\d+$/.test(cleaned.accountNumber)) {
        errors.push("Account number must contain only digits");
      }
      if (cleaned.accountNumber.length !== 10) {
        errors.push("Account number must be exactly 10 digits");
      }
    }

    if (!cleaned.accountName) {
      errors.push("Enter account name");
    }

    if (!cleaned.bvn) {
      errors.push("Enter BVN");
    } else {
      if (!/^\d+$/.test(cleaned.bvn)) {
        errors.push("BVN must contain only digits");
      }
      if (cleaned.bvn.length !== 11) {
        errors.push("BVN must be exactly 11 digits");
      }
    }

    if (errors.length > 0) {
      setModalConfig({
        message: errors.map((e) => `• ${e}`).join("\n"),
        variant: "error",
      });
      setModalVisible(true);
      return false;
    }

    return true;
  };

  /* ================= SAVE ================= */
  const saveData = () => {
    if (!validate()) return false;

    updatePhase2({
      payment: {
        bank: clean(selectedBank),
        account_number: clean(accountNumber),
        account_name: clean(accountName),
        bvn: clean(bvn),
      },
    });

    return true;
  };

  /* ================= CONTINUE ================= */
  const handleContinue = () => {
    if (!saveData()) return;

    markGroupComplete("setupPayments");
    router.push("/superForm2/checklist");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Set up your payment</Text>
          <Text style={styles.subtitle}>Add your bank details</Text>

          {/* Bank */}
          <CustomDropdown
            label="Bank"
            options={banks}
            placeholder="Select"
            value={selectedBank}
            onChange={setSelectedBank}
            required
          />

          {/* Account Number */}
          <CustomInput
            label="Account number"
            placeholder="e.g 0123456789"
            value={accountNumber}
            onChange={setAccountNumber}
            required
            type="tel"
          />

          {/* Account Name */}
          <CustomInput
            label="Account name"
            placeholder="e.g Clinton Bassey"
            value={accountName}
            onChange={setAccountName}
            required
          />

          {/* BVN */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Bank Verification Number (BVN)</Text>
              <Text style={styles.required}> *</Text>
              <TouchableOpacity style={styles.infoIconSmall}>
                <Text style={styles.infoIconText}>i</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bvnInfoBox}>
              <Text style={styles.bvnInfoText}>
                Your BVN is required to verify your identity and secure your
                account. It will not be used to access your bank account.
              </Text>
            </View>

            <View style={styles.inputWrapper}>
              <CustomInput
                placeholder="e.g 12345678901"
                value={bvn}
                onChange={setBvn}
                type="tel"
              />
            </View>
          </View>

          {/* Continue */}
          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL */}
      <FeedbackModal
        visible={modalVisible}
        message={modalConfig.message}
        variant={modalConfig.variant}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
