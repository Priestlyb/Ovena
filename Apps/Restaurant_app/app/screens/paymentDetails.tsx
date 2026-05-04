// app/(tabs)/paymentDetails.tsx

import { Text } from "@/components/atoms/Text";
import { CustomInput } from "@/components/CustomInput";
import { Header } from "@/components/molecules/Header";
import { OtpModal } from "@/components/OtpModal"; // ✅ NEW
import api from "@/services/apiClient";
import { useRouter } from "expo-router";
import { ArrowLeft, Pencil, X } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface PaymentDetails {
  account_name: string;
  account_number: string;
  bank: string;
  bank_code?: string;
  bvn?: string;
}

const OTP_LENGTH = 6;

const PaymentDetailsScreen = () => {
  const router = useRouter();

  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [form, setForm] = useState<PaymentDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // OTP STATE
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);

  const fetchPaymentDetails = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const response = await api.get("/business/payment/");
      setPayment(response.data);
      setForm(response.data);
    } catch (error: any) {
      console.error(
        "Error fetching payment details:",
        error?.response || error,
      );
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const handleChange = (key: keyof PaymentDetails, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  // ========================
  // UPDATE → TRIGGER OTP
  // ========================
  const handleUpdate = async () => {
    if (!form) return;

    try {
      setSaving(true);

      await api.put("/business/payment/", form);

      setOtpModalVisible(true);
      setIsEditing(false);
    } catch (error: any) {
      console.error(
        "Error updating payment details:",
        error?.response || error,
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================
  // VERIFY OTP
  // ========================
  const handleVerifyOtp = async () => {
    const code = otp.join("");

    if (code.length < 6) return;

    try {
      setVerifying(true);

      await api.post("/business/payment/verify/", {
        otp_code: Number(code),
      });

      // success
      setOtpModalVisible(false);
      setOtp(Array(OTP_LENGTH).fill(""));

      fetchPaymentDetails();
    } catch (error: any) {
      console.error("OTP verification failed:", error?.response || error);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#F65513" />
      </SafeAreaView>
    );
  }

  if (!payment || !form) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No payment details found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Header
          title="Payment Details"
          leftIcon={<ArrowLeft size={24} />}
          onLeftIconPress={() => router.back()}
        />

        <View style={styles.card}>
          <Text style={styles.header}>Payment Details</Text>

          {/* ACCOUNT NAME */}
          {isEditing ? (
            <CustomInput
              placeholder="Enter account name"
              label="Account Name"
              value={form.account_name}
              onChange={(text) => handleChange("account_name", text)}
              required
            />
          ) : (
            <View style={styles.row}>
              <Text style={styles.label}>Account Name</Text>
              <Text style={styles.value}>{payment.account_name}</Text>
            </View>
          )}

          {/* ACCOUNT NUMBER */}
          {isEditing ? (
            <CustomInput
              placeholder="Enter account number"
              label="Account Number"
              value={form.account_number}
              onChange={(text) => handleChange("account_number", text)}
              type="tel"
            />
          ) : (
            <View style={styles.row}>
              <Text style={styles.label}>Account Number</Text>
              <Text style={styles.value}>{payment.account_number}</Text>
            </View>
          )}

          {/* BANK */}
          {isEditing ? (
            <CustomInput
              placeholder="Enter bank name"
              label="Bank"
              value={form.bank}
              onChange={(text) => handleChange("bank", text)}
            />
          ) : (
            <View style={styles.row}>
              <Text style={styles.label}>Bank</Text>
              <Text style={styles.value}>{payment.bank}</Text>
            </View>
          )}

          {/* ACTION BUTTONS */}
          {isEditing && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.cancel]}
                onPress={() => {
                  setForm(payment);
                  setIsEditing(false);
                }}
              >
                <X size={18} color="#fff" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.save]}
                onPress={handleUpdate}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* FAB */}
        {!isEditing && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setIsEditing(true)}
          >
            <Pencil size={20} color="#fff" />
          </TouchableOpacity>
        )}

        {/* ✅ OTP MODAL COMPONENT */}
        <OtpModal
          visible={otpModalVisible}
          otp={otp}
          setOtp={setOtp}
          verifying={verifying}
          onVerify={handleVerifyOtp}
          onClose={() => setOtpModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PaymentDetailsScreen;

// ================= STYLES =================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingVertical: 55,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#777",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
  },
  cancel: {
    backgroundColor: "#999",
    marginRight: 10,
  },
  save: {
    backgroundColor: "#FF5920",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 40,
    backgroundColor: "#FF5920",
    padding: 16,
    borderRadius: 50,
  },
});
