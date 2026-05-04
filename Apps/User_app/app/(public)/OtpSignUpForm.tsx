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
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { useAuth } from "@/context/AuthContext";
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

const isLeapYear = (y: number) =>
  (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

const getDaysInMonth = (m: number, y: number) =>
  m === 1 ? (isLeapYear(y) ? 29 : 28) : [3, 5, 8, 10].includes(m) ? 30 : 31;

const is18Plus = (date: Date) => {
  const min = new Date(
    TODAY.getFullYear() - 18,
    TODAY.getMonth(),
    TODAY.getDate(),
  );
  return date <= min;
};

export default function OtpSignUpForm() {
  const { accessToken, completeOtpSignup, logout } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  /* ---------------- DOB ---------------- */
  const years = useMemo(generateYears, []);
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(years[0]);
  const [showPicker, setShowPicker] = useState(false);

  const daysInMonth = useMemo(() => getDaysInMonth(month, year), [month, year]);
  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth],
  );

  useEffect(() => {
    if (day > daysInMonth) setDay(daysInMonth);
  }, [daysInMonth]);

  /* ---------------- LOCATION ---------------- */
  const fetchLocation = async () => {
    try {
      setLocationLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location Denied", "Cannot proceed without location");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLatitude(loc.coords.latitude);
      setLongitude(loc.coords.longitude);

      console.log("Raw Location:", loc.coords);
    } catch (err) {
      console.log("Location error:", err);
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    console.log("OTP Signup Submit Initiated");

    if (!accessToken) {
      await logout();
      return;
    }

    // ---------------- Validation ----------------
    if (!fullName.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Full name is required",
        position: "top",
      });
      return;
    }

    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Email is required",
        position: "top",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Enter a valid email address",
        position: "top",
      });
      return;
    }

    if (latitude === null || longitude === null) {
      Toast.show({
        type: "error",
        text1: "Location Required",
        text2: "Please allow location access",
        position: "top",
      });
      return;
    }

    const dob = new Date(year, month, day);
    if (!is18Plus(dob)) {
      Toast.show({
        type: "error",
        text1: "Age Restriction",
        text2: "You must be 18+ to sign up",
        position: "top",
      });
      return;
    }

    // ---------------- Submit ----------------
    try {
      setLoading(true);

      const payload = {
        name: fullName.trim(),
        email: email.trim(),
        lat: latitude,
        long: longitude,
        birth_date: dob.toISOString().split("T")[0],
      };

      console.log("Final Payload:", payload);

      const res = await fetch(`${BASE_URL}/accounts/register-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Server Response:", data);

      if (!res.ok) {
        // Extract first meaningful error
        let errorMsg = "Signup failed";
        if (data) {
          const firstField = Object.keys(data)[0];
          if (Array.isArray(data[firstField])) {
            errorMsg = data[firstField][0];
          } else if (typeof data[firstField] === "string") {
            errorMsg = data[firstField];
          }
        }

        throw new Error(errorMsg);
      }

      await completeOtpSignup();

      Toast.show({
        type: "success",
        text1: "Signup Successful",
        text2: "Welcome aboard!",
        position: "top",
      });

      console.log("OTP Signup Complete");
    } catch (e: any) {
      console.error("Signup Error:", e.message);

      Toast.show({
        type: "error",
        text1: "Signup Error",
        text2: e.message,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={{ flex: 1, backgroundColor: "#D9502E" }}>
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
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.locationBtn} onPress={fetchLocation}>
            {locationLoading ? (
              <ActivityIndicator />
            ) : (
              <Text>
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
              <Text style={{ color: "#fff" }}>Done</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

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

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  banner: { flexDirection: "row", padding: 50, alignItems: "center" },
  bannerText: { fontSize: 22, fontWeight: "bold", lineHeight: 35 },
  formContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
  },
  label: { fontSize: 16, fontWeight: "600", marginTop: 25 },
  input: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
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
  wheelRow: { flexDirection: "row", flex: 1 },
  picker: { flex: 1 },
  doneBtn: { alignItems: "flex-end", paddingHorizontal: 20, paddingBottom: 10 },
  doneText: { fontSize: 16, fontWeight: "600", color: "#D9502E" },
});
