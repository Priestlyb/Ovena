// screens/EditInfoScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import PageHeader from "../components/PageHeader";
import FormField from "../components/FormField";
import SelectField from "../components/SelectField";

interface EditInfoScreenProps {
  onBack: () => void;
}

const GENDER_OPTIONS = ["Male", "Female", "Prefer not to say"];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => String(currentYear - i));

const EditInfoScreen: React.FC<EditInfoScreenProps> = ({ onBack }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [address, setAddress] = useState("");

  const handleSave = () => {
    if (!firstName || !lastName) {
      Alert.alert("Required", "Please enter your first and last name.");
      return;
    }
    Alert.alert("Saved", "Your information has been updated.");
  };

  return (
    <ScreenWrapper scrollable>
      <PageHeader title="Edit Information" onBack={onBack} />

      <View style={styles.content}>
        {/* First Name */}
        <FormField
          label="First Name"
          iconName="PersonIcon"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />

        {/* Last Name */}
        <FormField
          label="Last Name"
          iconName="PersonIcon"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />

        {/* Phone Number */}
        <View style={styles.phoneWrapper}>
          <Text style={styles.fieldLabel}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <View style={styles.phonePrefix}>
              <Text style={styles.phonePrefixText}>+234</Text>
            </View>
            <View style={styles.phoneInputWrap}>
              <FormField
                label=""
                value={phone}
                onChangeText={setPhone}
                placeholder="e.g 08XXXXXXXXX"
                keyboardType="phone-pad"
                maxLength={11}
              />
            </View>
          </View>
        </View>

        {/* Email */}
        <FormField
          label="Email Address"
          iconName="MailIcon"
          value={email}
          onChangeText={setEmail}
          placeholder=""
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Gender */}
        <SelectField
          label="Gender"
          options={GENDER_OPTIONS}
          value={gender}
          onChange={setGender}
          placeholder="Select"
        />

        {/* Date of Birth */}
        <View style={styles.dobWrapper}>
          <Text style={styles.fieldLabel}>Date of Birth</Text>
          <View style={styles.dobRow}>
            <View style={styles.dobField}>
              <SelectField
                label=""
                options={DAYS}
                value={dobDay}
                onChange={setDobDay}
                placeholder="Day"
              />
            </View>
            <View style={styles.dobField}>
              <SelectField
                label=""
                options={MONTHS}
                value={dobMonth}
                onChange={setDobMonth}
                placeholder="Month"
              />
            </View>
            <View style={styles.dobField}>
              <SelectField
                label=""
                options={YEARS}
                value={dobYear}
                onChange={setDobYear}
                placeholder="Year"
              />
            </View>
          </View>
        </View>

        {/* Residential Address */}
        <FormField
          label="Residential Address"
          iconName="LocationArrowIcon"
          value={address}
          onChangeText={setAddress}
          placeholder=""
          autoCapitalize="words"
        />

        {/* Save */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default EditInfoScreen;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
    marginBottom: 8,
  },

  /* Phone */
  phoneWrapper: {
    marginBottom: 20,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 0,
  },
  phonePrefix: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRightWidth: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  phonePrefixText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  phoneInputWrap: {
    flex: 1,
  },

  /* DOB */
  dobWrapper: {
    marginBottom: 20,
  },
  dobRow: {
    flexDirection: "row",
    gap: 8,
  },
  dobField: {
    flex: 1,
  },

  /* Save */
  saveBtn: {
    backgroundColor: "#D44C0C",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});