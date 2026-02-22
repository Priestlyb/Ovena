// screens/PaymentScreen.tsx
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import PageHeader from "../components/PageHeader";
import FormField from "../components/FormField";
import SelectField from "../components/SelectField";

interface PaymentScreenProps {
  onBack: () => void;
}

const NIGERIAN_BANKS = [
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

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onBack }) => {
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const handleUpdate = () => {
    if (!bank || !accountNumber || !accountName) {
      Alert.alert("Incomplete", "Please fill in all fields.");
      return;
    }
    Alert.alert("Success", "Payment details updated.");
  };

  return (
    <ScreenWrapper scrollable>
      <PageHeader title="Payment" onBack={onBack} />

      <View style={styles.content}>
        {/* Bank selector */}
        <SelectField
          label="What Bank?"
          options={NIGERIAN_BANKS}
          value={bank}
          onChange={setBank}
          placeholder="Select"
        />

        {/* Account Number */}
        <FormField
          label="Account Number"
          value={accountNumber}
          onChangeText={setAccountNumber}
          placeholder=""
          keyboardType="number-pad"
          maxLength={10}
        />

        {/* Name on Account */}
        <FormField
          label="Name on Account"
          value={accountName}
          onChangeText={setAccountName}
          placeholder=""
          autoCapitalize="words"
        />

        {/* Update button */}
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={handleUpdate}
          activeOpacity={0.85}
        >
          <Text style={styles.updateBtnText}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  updateBtn: {
    backgroundColor: "#D44C0C",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  updateBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});