// components/signup/PersonalInformation.tsx
import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  ScrollView, StyleSheet, View, Text,
  KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import FormInput, { validateField } from "../FormInput";
import { useTheme } from "../../context/ThemeContext";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PersonalStepProps {
  personalInfo: {
    first_name: string;
    last_name: string;
    // These store the FULL number including country code, e.g. "+234 08012345678"
    phone_number: string;
    email: string;
    password: string;
    gender: string;
    birth_date: { day: string; month: string; year: string };
    residential_address: string;
    next_of_kin_name?: string;
    next_of_kin_phone?: string;  // full number with country code
    next_of_kin_address?: string;
  };
  setPersonalInfo: (state: any) => void;
}

type ErrorMap = Record<string, string>;

export function validatePersonalInfo(p: PersonalStepProps["personalInfo"]): ErrorMap {
  return {
    first_name:          validateField(p.first_name, "First Name", "name"),
    last_name:           validateField(p.last_name, "Last Name", "name"),
    phone_number:        validateField(p.phone_number, "Phone Number", "phone"),
    email:               validateField(p.email, "Email Address", "email"),
    password:            validateField(p.password, "Password", "password", false, 6),
    gender:              p.gender ? "" : "Please select a gender.",
    birth_date:
      p.birth_date.day && p.birth_date.month && p.birth_date.year
        ? ""
        : "Please select a complete date of birth.",
    residential_address: validateField(p.residential_address, "Residential Address", "address"),
    next_of_kin_name:    validateField(p.next_of_kin_name ?? "", "Next of Kin Name", "name"),
    next_of_kin_phone:   validateField(p.next_of_kin_phone ?? "", "Next of Kin Phone", "phone"),
    next_of_kin_address: validateField(p.next_of_kin_address ?? "", "Next of Kin Address", "address"),
  };
}

export function isPersonalInfoValid(errors: ErrorMap): boolean {
  return Object.values(errors).every((e) => !e);
}

export interface PersonalStepRef { triggerValidation: () => boolean; }

// ── Component ─────────────────────────────────────────────────────────────────

const PersonalStep = forwardRef<PersonalStepRef, PersonalStepProps>(
  ({ personalInfo, setPersonalInfo }, ref) => {
    const { colors } = useTheme();
    const [errors, setErrors] = useState<ErrorMap>({});
    const [confirmPassword, setConfirmPassword] = useState("");

    useImperativeHandle(ref, () => ({
      triggerValidation: () => {
        const errs = validatePersonalInfo(personalInfo);

        const confirmError =
          confirmPassword.trim() === ""
            ? "Please confirm your password."
            : confirmPassword !== personalInfo.password
            ? "Passwords do not match."
            : "";

        const allErrors = { ...errs, confirm_password: confirmError };
        setErrors(allErrors);
        return isPersonalInfoValid(errs) && !confirmError;
      },
    }));

    // Generic field change — also clears that field's error
    const handleChange = (field: string, value: string) => {
      setPersonalInfo({ ...personalInfo, [field]: value });
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleConfirmPasswordChange = (value: string) => {
      setConfirmPassword(value);
      if (errors.confirm_password) {
        setErrors((prev) => ({ ...prev, confirm_password: "" }));
      }
    };

    const pickerItemStyle = { color: colors.textPrimary, backgroundColor: colors.card };
    const icons = {
      name: "UserIcon", email: "EmailIcon",
      password: "PassWordIcon", address: "HomeIcon",
    };

    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.header}>
              <Text style={[styles.headerText, { color: colors.textPrimary }]}>
                Personal Information
              </Text>
            </View>

            <ScrollView
              style={[styles.form, { backgroundColor: colors.background }]}
              contentContainerStyle={{ paddingBottom: 40 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <FormInput
                label="First Name"
                value={personalInfo.first_name}
                onChange={(t) => handleChange("first_name", t)}
                iconName={icons.name}
                type="name"
                maxLength={50}
                error={errors.first_name}
              />
              <FormInput
                label="Last Name"
                value={personalInfo.last_name}
                onChange={(t) => handleChange("last_name", t)}
                iconName={icons.name}
                type="name"
                maxLength={50}
                error={errors.last_name}
              />

              {/* ── Phone — country code picker built in ── */}
              <FormInput
                label="Phone Number"
                value={personalInfo.phone_number}
                onChange={(full) => handleChange("phone_number", full)}
                iconName="PhoneIcon"
                type="phone"
                error={errors.phone_number}
              />

              <FormInput
                label="Email Address"
                value={personalInfo.email}
                onChange={(t) => handleChange("email", t)}
                iconName={icons.email}
                type="email"
                error={errors.email}
              />
              <FormInput
                label="Password"
                placeholder="Minimum 6 characters"
                value={personalInfo.password}
                onChange={(t) => handleChange("password", t)}
                iconName={icons.password}
                type="password"
                minLength={6}
                error={errors.password}
              />

              {/* ── Confirm Password ── */}
              <FormInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                iconName={icons.password}
                type="password"
                error={errors.confirm_password}
              />

              {/* ── Gender ── */}
              <View style={styles.inputWrapper}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Gender</Text>
                <View style={[
                  styles.pickerContainer,
                  { backgroundColor: colors.card, borderColor: errors.gender ? "#e53935" : colors.separatorColor },
                ]}>
                  <Picker
                    selectedValue={personalInfo.gender}
                    onValueChange={(v) => {
                      setPersonalInfo({ ...personalInfo, gender: v });
                      setErrors((p) => ({ ...p, gender: "" }));
                    }}
                    style={{ flex: 1, color: colors.textPrimary }}
                    dropdownIconColor={colors.textPrimary}
                  >
                    <Picker.Item label="Select Gender" value="" style={pickerItemStyle} />
                    <Picker.Item label="Male"   value="male"   style={pickerItemStyle} />
                    <Picker.Item label="Female" value="female" style={pickerItemStyle} />
                    <Picker.Item label="Other"  value="other"  style={pickerItemStyle} />
                  </Picker>
                </View>
                {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
              </View>

              {/* ── Date of Birth ── */}
              <View style={styles.inputWrapper}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Date of Birth</Text>
                <View style={styles.dobContainer}>
                  {(["day", "month", "year"] as const).map((part) => (
                    <View
                      key={part}
                      style={[
                        styles.dobPickerContainer,
                        {
                          backgroundColor: colors.card,
                          borderColor: errors.birth_date ? "#e53935" : colors.separatorColor,
                        },
                      ]}
                    >
                      <Picker
                        selectedValue={personalInfo.birth_date[part]}
                        style={{ color: colors.textPrimary }}
                        dropdownIconColor={colors.textPrimary}
                        onValueChange={(v) => {
                          setPersonalInfo({
                            ...personalInfo,
                            birth_date: { ...personalInfo.birth_date, [part]: v },
                          });
                          setErrors((p) => ({ ...p, birth_date: "" }));
                        }}
                      >
                        <Picker.Item
                          label={part.charAt(0).toUpperCase() + part.slice(1)}
                          value=""
                          style={pickerItemStyle}
                        />
                        {part === "day" &&
                          Array.from({ length: 31 }, (_, i) => (
                            <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} style={pickerItemStyle} />
                          ))}
                        {part === "month" &&
                          Array.from({ length: 12 }, (_, i) => (
                            <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} style={pickerItemStyle} />
                          ))}
                        {part === "year" &&
                          Array.from({ length: 76 }, (_, i) => {
                            const y = 1950 + i;
                            return <Picker.Item key={y} label={`${y}`} value={`${y}`} style={pickerItemStyle} />;
                          })}
                      </Picker>
                    </View>
                  ))}
                </View>
                {errors.birth_date ? <Text style={styles.errorText}>{errors.birth_date}</Text> : null}
              </View>

              <FormInput
                label="Residential Address"
                value={personalInfo.residential_address}
                onChange={(t) => handleChange("residential_address", t)}
                iconName={icons.address}
                type="address"
                error={errors.residential_address}
              />

              <FormInput
                label="Next of Kin Name"
                value={personalInfo.next_of_kin_name ?? ""}
                onChange={(t) => handleChange("next_of_kin_name", t)}
                iconName={icons.name}
                type="name"
                error={errors.next_of_kin_name}
              />

              {/* ── Next of kin phone — country code picker built in ── */}
              <FormInput
                label="Next of Kin Phone Number"
                value={personalInfo.next_of_kin_phone ?? ""}
                onChange={(full) => handleChange("next_of_kin_phone", full)}
                iconName="PhoneIcon"
                type="phone"
                error={errors.next_of_kin_phone}
              />

              <FormInput
                label="Next of Kin Address"
                placeholder="Road 77"
                value={personalInfo.next_of_kin_address ?? ""}
                onChange={(t) => handleChange("next_of_kin_address", t)}
                iconName={icons.address}
                type="address"
                error={errors.next_of_kin_address}
              />
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
);

export default PersonalStep;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  form: { flex: 1, paddingHorizontal: 20 },
  header: { alignItems: "center", marginBottom: 20, marginTop: 10 },
  headerText: { fontSize: 20, fontWeight: "bold" },
  inputWrapper: { marginVertical: 10 },
  label: { marginBottom: 8, fontWeight: "600", fontSize: 16 },
  pickerContainer: {
    borderWidth: 1, borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 4, elevation: 3,
  },
  dobContainer: { flexDirection: "row", justifyContent: "space-between" },
  dobPickerContainer: {
    flex: 1, marginHorizontal: 5, borderRadius: 15, borderWidth: 1,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, overflow: "hidden",
  },
  errorText: { color: "#e53935", fontSize: 12, marginTop: 4, marginLeft: 4 },
});