// PersonalStep.tsx
import React from "react";
import { ScrollView, TextInput, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { IconSymbol } from "../components/ui/icon-symbol";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  dob: { day: string; month: string; year: string };
  address: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
}

// ── Canonical default — import and use this wherever you initialise state ────
export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  gender: "",
  dob: { day: "", month: "", year: "" },
  address: "",
  nextOfKinName: "",
  nextOfKinPhone: "",
};

interface PersonalStepProps {
  personalInfo?: PersonalInfo;          // optional — safe even if parent hasn't initialised yet
  setPersonalInfo: (state: PersonalInfo) => void;
  onUpdate?: () => void;         // called when Update button is pressed
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PersonalStep({
  personalInfo = DEFAULT_PERSONAL_INFO, // ← FIX 1: default so undefined never crashes us
  setPersonalInfo,
  onUpdate,
}: PersonalStepProps) {

  // ── FIX 2: typed merge helper so we never accidentally lose nested fields ──
  const update = (patch: Partial<PersonalInfo>) =>
    setPersonalInfo({ ...personalInfo, ...patch });

  const updateDob = (patch: Partial<PersonalInfo["dob"]>) =>
    update({ dob: { ...personalInfo.dob, ...patch } });

  // ── Reusable text-input row ───────────────────────────────────────────────
  const renderInput = (
    label: string,
    placeholder: string,
    value: string,
    onChange: (text: string) => void,
    iconName: string,
    keyboardType?: any
  ) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <IconSymbol name={iconName as any} size={22} color="#555" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType || "default"}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Personal Information</Text>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 40 }}>
        {renderInput(
          "First Name", "Enter your first name",
          personalInfo.firstName,
          (text) => update({ firstName: text }),
          "UserIcon"
        )}

        {renderInput(
          "Last Name", "Enter your last name",
          personalInfo.lastName,
          (text) => update({ lastName: text }),
          "UserIcon"
        )}

        {renderInput(
          "Phone Number", "e.g 08XXXXXXXXX",
          personalInfo.phone,
          (text) => update({ phone: text }),
          "PhoneIcon", "phone-pad"
        )}

        {renderInput(
          "Email Address", "Enter your email address",
          personalInfo.email,
          (text) => update({ email: text }),
          "EmailIcon", "email-address"
        )}

        {/* Gender */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={personalInfo.gender}
              onValueChange={(v) => update({ gender: v })}
              style={{ flex: 1 }}
            >
              <Picker.Item label="Select" value="" />
              <Picker.Item label="Male"   value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other"  value="other" />
            </Picker>
          </View>
        </View>

        {/* Date of Birth */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Date of Birth</Text>
          <View style={styles.dobContainer}>
            {/* Day */}
            <View style={styles.dobPickerContainer}>
              <Picker
                selectedValue={personalInfo.dob.day}
                onValueChange={(v) => updateDob({ day: v })}   // ← FIX 3: updateDob keeps other dob fields
              >
                <Picker.Item label="Day" value="" />
                {Array.from({ length: 31 }, (_, i) => (
                  <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
                ))}
              </Picker>
            </View>

            {/* Month */}
            <View style={styles.dobPickerContainer}>
              <Picker
                selectedValue={personalInfo.dob.month}
                onValueChange={(v) => updateDob({ month: v })}
              >
                <Picker.Item label="Month" value="" />
                {Array.from({ length: 12 }, (_, i) => (
                  <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
                ))}
              </Picker>
            </View>

            {/* Year */}
            <View style={styles.dobPickerContainer}>
              <Picker
                selectedValue={personalInfo.dob.year}
                onValueChange={(v) => updateDob({ year: v })}
              >
                <Picker.Item label="Year" value="" />
                {Array.from({ length: 76 }, (_, i) => {
                  const year = 1950 + i;
                  return <Picker.Item key={year} label={`${year}`} value={`${year}`} />;
                })}
              </Picker>
            </View>
          </View>
        </View>

        {renderInput(
          "Residential Address", "Enter your residential address",
          personalInfo.address,
          (text) => update({ address: text }),
          "HomeIcon"
        )}

        {renderInput(
          "Next of Kin Name", "Enter next of kin name",
          personalInfo.nextOfKinName,
          (text) => update({ nextOfKinName: text }),
          "UserIcon"
        )}

        {renderInput(
          "Next of Kin Phone Number", "e.g 08XXXXXXXXX",
          personalInfo.nextOfKinPhone,
          (text) => update({ nextOfKinPhone: text }),
          "PhoneIcon", "phone-pad"
        )}
      </ScrollView>

      {/* ── Fixed Update button ── */}
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

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  form: { flex: 1, paddingHorizontal: 20 },
  header: { alignItems: "center", marginBottom: 20, marginTop: 10 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#333" },
  inputWrapper: { marginVertical: 15 },
  label: { marginBottom: 15, fontWeight: "600", color: "#333", fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingHorizontal: 12,
    height: 55,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: { flex: 1, height: "100%", color: "#000" },
  dobContainer: { flexDirection: "row", justifyContent: "space-between" },
  dobPickerContainer: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },

  /* Update button bar */
  container: {
    flex: 1,
  },
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