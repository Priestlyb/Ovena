// screens/EditInfoScreen.tsx
// Uses PersonalInformation component and submits to updatePersonalInfo API.
import React, { useRef, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Alert, ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { IconSymbol } from "../components/ui/icon-symbol";
import PersonalStep, {
  PersonalStepRef,
  validatePersonalInfo,
  isPersonalInfoValid,
} from "../components/signup/PersonalInformation";
import { updatePersonalInfo } from "../services/accountApi";
import ScreenWrapper from "../components/ScreenWrapper";

interface EditInfoScreenProps {
  onBack: () => void;
}

const DEFAULT_INFO = {
  first_name: "", last_name: "", phone_number: "",
  email: "", password: "", gender: "",
  birth_date: { day: "", month: "", year: "" },
  residential_address: "", next_of_kin_name: "",
  next_of_kin_phone: "", next_of_kin_address: "",
};

const EditInfoScreen: React.FC<EditInfoScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const stepRef = useRef<PersonalStepRef>(null);
  const [personalInfo, setPersonalInfo] = useState(DEFAULT_INFO);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    const isValid = stepRef.current?.triggerValidation();
    if (!isValid) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) throw new Error("You are not logged in. Please sign in again.");
      await updatePersonalInfo(personalInfo, token);
      Alert.alert("Success", "Your personal information has been updated.");
    } catch (err: any) {
      Alert.alert("Update Failed", err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.separatorColor }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <IconSymbol name="ArrowBack" size={22} color={colors.iconColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Edit Information</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Form */}
      <View style={[styles.formContainer, { backgroundColor: colors.background }]}>
        <PersonalStep
          ref={stepRef}
          personalInfo={personalInfo}
          setPersonalInfo={setPersonalInfo}
        />
      </View>

      {/* Update button */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.separatorColor }]}>
        <TouchableOpacity
          style={[styles.updateBtn, { backgroundColor: colors.accentOrange }, loading && styles.btnDisabled]}
          onPress={handleUpdate}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.updateBtnText}>Update</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </ScreenWrapper>
  );
};

export default EditInfoScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 36 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  formContainer: { flex: 1 },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  updateBtn: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.6 },
  updateBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});