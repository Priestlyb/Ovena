import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";

import { IconSymbol, IconName } from "@/components/ui/icon-symbol";
import { useAuth } from "@/context/AuthContext";
import { debugSecureStore } from "@/src/utils/debugSecureStore";

/* -------------------- Helpers -------------------- */
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

const generateYears = () =>
  Array.from({ length: 100 }, (_, i) => TODAY.getFullYear() - i);

const isLeapYear = (y: number) =>
  (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

const getDaysInMonth = (m: number, y: number) =>
  m === 1 ? (isLeapYear(y) ? 29 : 28) : [3, 5, 8, 10].includes(m) ? 30 : 31;

const is18Plus = (date: Date) => {
  const min = new Date(
    TODAY.getFullYear() - 18,
    TODAY.getMonth(),
    TODAY.getDate()
  );
  return date <= min;
};

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

export default function SignUpForm() {
  const {
    phoneNumber,
    isNewUser,
    loading: authLoading,
    getValidAccessToken,
    logout,
    completeSignup,
  } = useAuth();

  const [fullName, setFullName] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  /* -------------------- AUTH GUARDS -------------------- */
  useEffect(() => {
    if (!authLoading) debugSecureStore();
  }, [authLoading]);

  useEffect(() => {
    if (!authLoading && !phoneNumber) {
      router.replace("/login");
    } else if (!authLoading && !isNewUser) {
      router.replace("/(tabs)/homepage");
    }
  }, [authLoading, phoneNumber, isNewUser]);

  /* -------------------- DOB -------------------- */
  const years = useMemo(generateYears, []);
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(years[0]);
  const [showPicker, setShowPicker] = useState(false);

  const daysInMonth = useMemo(() => getDaysInMonth(month, year), [month, year]);
  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  useEffect(() => {
    if (day > daysInMonth) setDay(daysInMonth);
  }, [daysInMonth]);

  /* -------------------- LOCATION -------------------- */
  const fetchLocation = async () => {
    try {
      setLocationLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLatitude(loc.coords.latitude);
      setLongitude(loc.coords.longitude);

      console.log(
        "📍 Auto Location:",
        loc.coords.latitude,
        loc.coords.longitude
      );
    } catch (e) {
      console.log("❌ Location Error:", e);
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Full name is required");
      return;
    }

    if (latitude === null || longitude === null) {
      Alert.alert("Location Required", "Please allow location access");
      return;
    }

    const dob = new Date(year, month, day);
    if (!is18Plus(dob)) {
      Alert.alert("Age restriction", "Must be 18+");
      return;
    }

    try {
      setLoading(true);

      const token = await getValidAccessToken();
      if (!token || !phoneNumber) {
        await logout();
        router.replace("/login");
        return;
      }

      // ✅ Backend-required integer format
      const latInt = Math.round(latitude * 1000);
      const longInt = Math.round(longitude * 1000);

      const payload = {
        phone_number: phoneNumber,
        name: fullName,
        lat: latInt,
        long: longInt,
        date_of_birth: dob.toISOString().split("T")[0],
      };

      console.log("📤 Signup Payload:", payload);

      const res = await fetch(`${BASE_URL}/accounts/register-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 Signup Response:", data);

      if (!res.ok) {
        throw new Error(
          data?.non_field_errors?.[0] || data?.detail || "Signup failed"
        );
      }

      await completeSignup();
      router.replace("/(tabs)/homepage");
    } catch (e: any) {
      Alert.alert("Signup Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={50} color="#D9502E" />
      </View>
    );
  }

  /* -------------------- UI (UNCHANGED) -------------------- */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={{ flex: 1, backgroundColor: "#D9502E" }}>
        <TouchableOpacity
          onPress={() => router.replace("/login")}
          style={{ marginTop: 70, marginLeft: 30 }}
        >
          <Ionicons name="arrow-back" size={25} />
        </TouchableOpacity>

        <View style={styles.banner}>
          <Image
            source={require("../../assets/images/signupBanner.png")}
            style={{ width: 300, height: 300 }}
          />
          <Text style={styles.bannerText}>
            A Few Questions{"\n"}to Help Us Create{"\n"}Our Perfect Meal
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Full Name"
            icon="ProfileIcon"
            value={fullName}
            onChange={setFullName}
          />

          <TouchableOpacity style={styles.locationBtn} onPress={fetchLocation}>
            {locationLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={{ fontWeight: "600" }}>
                {latitude ? "Location Added ✔" : "Allow Location Access"}
              </Text>
            )}
          </TouchableOpacity>

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
              <Text style={styles.submitText}>Done</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles.done}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.wheelRow}>
              <Picker
                selectedValue={day}
                style={styles.wheel}
                onValueChange={setDay}
              >
                {days.map((d) => (
                  <Picker.Item key={d} label={`${d}`} value={d} />
                ))}
              </Picker>

              <Picker
                selectedValue={month}
                style={styles.wheel}
                onValueChange={setMonth}
              >
                {MONTHS.map((m, i) => (
                  <Picker.Item key={m} label={m} value={i} />
                ))}
              </Picker>

              <Picker
                selectedValue={year}
                style={styles.wheel}
                onValueChange={setYear}
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

/* -------------------- Input -------------------- */
function Input({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: IconName;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContain}>
        <IconSymbol name={icon} size={24} color="#000" />
        <TextInput
          value={value}
          onChangeText={onChange}
          style={styles.otpInput}
        />
      </View>
    </View>
  );
}

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "600", marginTop: 25 },
  inputContain: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  otpInput: { flex: 1, height: 50 },
  banner: { flexDirection: "row", padding: 50, alignItems: "center" },
  bannerText: {
    marginLeft: -100,
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 35,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
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
  locationBtn: {
    marginTop: 25,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
  },
  submitBtn: {
    marginTop: 40,
    backgroundColor: "#D9502E",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 20 },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  cancel: { color: "#999" },
  done: { color: "#D9502E", fontWeight: "600" },
  wheelRow: { flexDirection: "row", height: 220 },
  wheel: { flex: 1 },
});
