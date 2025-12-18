import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { IconSymbol } from "@/components/ui/icon-symbol";

/* -------------------- Date Helpers -------------------- */
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

const generateYears = () => {
  const currentYear = TODAY.getFullYear();
  return Array.from({ length: 100 }, (_, i) => currentYear - i);
};

const isLeapYear = (year: number) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const getDaysInMonth = (month: number, year: number) => {
  if (month === 1) return isLeapYear(year) ? 29 : 28;
  if ([3, 5, 8, 10].includes(month)) return 30;
  return 31;
};

const is18Plus = (date: Date) => {
  const minDate = new Date(
    TODAY.getFullYear() - 18,
    TODAY.getMonth(),
    TODAY.getDate()
  );
  return date <= minDate;
};
/* ---------------------------------------------------- */

export default function SignUpForm() {
  /* -------------------- Form State -------------------- */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [dob, setDob] = useState<Date | null>(null);

  /* -------------------- Date Picker State -------------------- */
  const [day, setDay] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [open, setOpen] = useState<"day" | "month" | "year" | null>(null);

  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const years = useMemo(generateYears, []);

  /* -------------------- Days Logic -------------------- */
  const daysInMonth = useMemo(() => {
    if (month === null || year === null) return 31;
    return getDaysInMonth(month, year);
  }, [month, year]);

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  useEffect(() => {
    if (day && day > daysInMonth) setDay(daysInMonth);
  }, [daysInMonth]);

  useEffect(() => {
    if (day && month !== null && year) {
      setDob(new Date(year, month, day));
    }
  }, [day, month, year]);

  /* -------------------- Dropdown Control -------------------- */
  const openDropdown = (type: "day" | "month" | "year") => {
    setOpen(type);
    dropdownAnim.setValue(0);
    Animated.timing(dropdownAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: false,
    }).start();
  };

  const closeDropdown = () => {
    Animated.timing(dropdownAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start(() => setOpen(null));
  };

  /* -------------------- Disabled Logic -------------------- */
  const isFutureYear = (y: number) => y > TODAY.getFullYear();

  const isFutureMonth = (m: number) =>
    year === TODAY.getFullYear() && m > TODAY.getMonth();

  const isFutureDay = (d: number) =>
    year === TODAY.getFullYear() &&
    month === TODAY.getMonth() &&
    d > TODAY.getDate();

  /* -------------------- Submit -------------------- */
  const handleSubmit = () => {
    if (!name || !email || !location || !dob) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!is18Plus(dob)) {
      Alert.alert("Age Restriction", "You must be at least 18 years old");
      return;
    }

    router.push("/screens/Otp");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: "#F6D44F" }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <TouchableOpacity
          onPress={() => router.replace("/login")}
          style={{ marginTop: 70, marginLeft: 30 }}
        >
          <Ionicons name="arrow-back" size={25} />
        </TouchableOpacity>

        {/* Banner */}
        <View style={styles.banner}>
          <Image
            source={require("../../assets/images/signupBanner.png")}
            style={{ width: 300, height: 300 }}
          />
          <Text style={styles.bannerText}>
            A Few Questions {"\n"} to Help Us Create {"\n"} our Perfect Meal
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {[
            {
              label: "Name",
              value: name,
              setter: setName,
              icon: "ProfileIcon",
            },
            {
              label: "Email",
              value: email,
              setter: setEmail,
              icon: "emailIcon",
            },
            {
              label: "Location",
              value: location,
              setter: setLocation,
              icon: "HomeIcon",
            },
          ].map((f, i) => (
            <View key={i}>
              <Text style={styles.label}>{f.label}</Text>
              <View style={styles.inputContain}>
                <IconSymbol name={f.icon as any} size={24} color="#000" />
                <TextInput
                  value={f.value}
                  onChangeText={f.setter}
                  style={styles.otpInput}
                />
              </View>
            </View>
          ))}

          {/* DOB */}
          <Text style={styles.label}>Date of Birth</Text>
          <View style={styles.dateRow}>
            <TouchableOpacity
              style={styles.dateBox}
              onPress={() => openDropdown("day")}
            >
              <Text>{day ?? "Day"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateBox}
              onPress={() => openDropdown("month")}
            >
              <Text>{month !== null ? MONTHS[month] : "Month"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateBox}
              onPress={() => openDropdown("year")}
            >
              <Text>{year ?? "Year"}</Text>
            </TouchableOpacity>
          </View>

          {open && (
            <View style={styles.dropdownWrapper}>
              <Animated.View
                style={{
                  height: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 260],
                  }),
                  overflow: "hidden",
                }}
              >
                <ScrollView
                  contentContainerStyle={{ paddingVertical: 5 }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator
                >
                  {(open === "day"
                    ? days
                    : open === "month"
                    ? MONTHS
                    : years
                  ).map((item: any, index: number) => {
                    const disabled =
                      (open === "year" && isFutureYear(item)) ||
                      (open === "month" && isFutureMonth(index)) ||
                      (open === "day" && isFutureDay(item));

                    return (
                      <TouchableOpacity
                        key={index}
                        disabled={disabled}
                        style={[
                          styles.option,
                          disabled && styles.disabledOption,
                        ]}
                        onPress={() => {
                          if (open === "day") setDay(item);
                          if (open === "month") setMonth(index);
                          if (open === "year") setYear(item);
                          closeDropdown();
                        }}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            disabled && { color: "#aaa" },
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </Animated.View>
            </View>
          )}

          <View style={styles.birthdayNote}>
            <Text>
              {" "}
              <Ionicons name="gift-outline" size={20} color="#D9502E" /> Get
              free delivery and discounts on your birthday
            </Text>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Done</Text>
          </TouchableOpacity>
          <Text style={styles.terms}>
            By continuing you automatically accept our{" "}
            <Text style={styles.link}>Terms & conditions</Text> and{" "}
            <Text style={styles.link}>privacy policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
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
  label: { fontSize: 16, fontWeight: "600", marginTop: 25 },
  inputContain: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  otpInput: { flex: 1, height: 50 },
  dateRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  dateBox: {
    flex: 1,
    height: 55,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownWrapper: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  dropdown: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  option: { padding: 14, borderBottomWidth: 1, borderBottomColor: "#eee" },
  disabledOption: { backgroundColor: "#f5f5f5" },
  optionText: { fontSize: 16 },
  submitBtn: {
    marginTop: 40,
    backgroundColor: "#D9502E",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  birthdayNote: {
    marginTop: 25,
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 10,
    borderRadius: 25,
  },
  submitText: { color: "#fff", fontWeight: "500", fontSize: 20 },
  terms: {
    fontSize: 11,
    color: "#777",
    textAlign: "center",
    marginHorizontal: 20,
    marginTop: 25,
  },
  link: {
    color: "#E4572E",
  },
});
