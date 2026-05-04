import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const TODAY = new Date();
const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

/* -------------------- Helpers -------------------- */

const generateYears = () =>
  Array.from({ length: 100 }, (_, i) => TODAY.getFullYear() - i);

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\s+/g, "");

  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("0")) return "+234" + cleaned.slice(1);

  return cleaned;
};

const formatBirthDate = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export default function GoogleSignUpForm() {
  const { loginWithOAuth } = useAuth();
  const params = useLocalSearchParams();

  const accessToken = (params.accessToken as string) || "";

  const lat = Number(params.lat) || 0;
  const long = Number(params.long) || 0;

  const [phoneNumber, setPhoneNumber] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);

  const years = useMemo(generateYears, []);

  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(years[0]);

  const [showPicker, setShowPicker] = useState(false);

  /* -------------------- Days Logic -------------------- */

  const getDaysInMonth = (m: number, y: number) =>
    m === 1
      ? (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
        ? 29
        : 28
      : [3, 5, 8, 10].includes(m)
        ? 30
        : 31;

  const daysInMonth = useMemo(() => getDaysInMonth(month, year), [month, year]);

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth],
  );

  useEffect(() => {
    if (day > daysInMonth) setDay(daysInMonth);
  }, [daysInMonth]);

  /* -------------------- Submit -------------------- */

  const handleSubmit = async () => {
    if (loading) return;

    try {
      if (!accessToken) throw new Error("Authentication session expired");

      if (!phoneNumber.trim()) throw new Error("Phone number is required");

      if (phoneNumber.length < 10)
        throw new Error("Enter a valid phone number");

      const payload = {
        phone_number: formatPhone(phoneNumber),
        birth_date: formatBirthDate(year, month, day),
        lat,
        long,
        referral_code: referralCode.trim(),
      };

      console.log("REGISTER PAYLOAD:", payload);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      setLoading(true);

      const res = await fetch(`${BASE_URL}/accounts/register-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await res.json();

      clearTimeout(timeout);

      console.log("STATUS:", res.status);
      console.log("RESPONSE:", data);

      if (!res.ok) {
        const message =
          data?.phone_number?.[0] ||
          data?.detail ||
          data?.non_field_errors?.[0] ||
          "Signup failed";

        throw new Error(message);
      }

      Toast.show({
        type: "success",
        text1: "Account Created ",
        text2: "Welcome to Ovena!",
      });

      
      await loginWithOAuth("google", accessToken, null, false);

      Toast.show({
        type: "success",
        text1: "Account Created 🎉",
        text2: "Welcome to Ovena!",
      });
    } catch (err: any) {
      console.log("Signup Error:", err);

      if (err.name === "AbortError") {
        Toast.show({
          type: "error",
          text1: "Network Timeout",
          text2: "Please try again",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Signup Failed",
          text2: err?.message || "Something went wrong",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: "#D9502E", paddingTop: 250 }}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Complete Your Signup</Text>

          <Text style={styles.subtitle}>
            Enter your details to complete registration
          </Text>

          <Text style={styles.label}>Phone Number</Text>

          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={11}
            style={styles.input}
          />

          <Text style={styles.label}>Referral Code (optional)</Text>

          <TextInput
            value={referralCode}
            onChangeText={setReferralCode}
            placeholder="Referral Code"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <Text style={styles.label}>Date of Birth</Text>

          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setShowPicker(true)}
          >
            <Text>{`${day} ${MONTHS[month]} ${year}`}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* DATE PICKER */}

      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              onPress={() => setShowPicker(false)}
              style={styles.doneBtn}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>

            <View style={styles.wheelRow}>
              <Picker
                selectedValue={day}
                onValueChange={setDay}
                style={styles.picker}
              >
                {days.map((d) => (
                  <Picker.Item key={d} label={`${d}`} value={d} />
                ))}
              </Picker>

              <Picker
                selectedValue={month}
                onValueChange={setMonth}
                style={styles.picker}
              >
                {MONTHS.map((m, i) => (
                  <Picker.Item key={m} label={m} value={i} />
                ))}
              </Picker>

              <Picker
                selectedValue={year}
                onValueChange={setYear}
                style={styles.picker}
              >
                {years.map((y) => (
                  <Picker.Item key={y} label={`${y}`} value={y} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

/* -------------------- Styles -------------------- */

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    minHeight: "100%",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 25,
  },

  input: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },

  dateBox: {
    height: 55,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },

  submitBtn: {
    marginTop: 40,
    backgroundColor: "#D9502E",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  pickerContainer: {
    backgroundColor: "#fff",
    paddingBottom: 20,
    paddingTop: 10,
    height: 300,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  wheelRow: {
    flexDirection: "row",
    flex: 1,
  },

  picker: {
    flex: 1,
  },

  doneBtn: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  doneText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#D9502E",
  },
});
