// screens/DocumentsScreen.tsx
// Uses IdentificationDocumentation component and submits to updateDocuments API.
import React, { useRef, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Alert, ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { IconSymbol } from "../components/ui/icon-symbol";
import DocumentStep, {
  DocumentStepRef,
  DEFAULT_DOC_INFO,
} from "../components/signup/IdentificationDocumentation";
import { updateDocuments } from "../services/accountApi";
import ScreenWrapper from "../components/ScreenWrapper";

interface DocumentsScreenProps {
  onBack: () => void;
}

const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const stepRef = useRef<DocumentStepRef>(null);
  const [docInfo, setDocInfo] = useState(DEFAULT_DOC_INFO);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    const isValid = stepRef.current?.triggerValidation();
    if (!isValid) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) throw new Error("You are not logged in. Please sign in again.");
      await updateDocuments(
        {
          drivers_license:  docInfo.drivers_license,
          nin:              docInfo.nin,
          bvn:              docInfo.bvn,
          vehicleType:      docInfo.vehicleType,
          vehicleMake:      docInfo.vehicleMake,
          plateNumber:      docInfo.plateNumber,
          guarantorName:    docInfo.guarantorName,
          guarantorPhone:   docInfo.guarantorPhone,
          guarantorTwoName:  docInfo.guarantorTwoName,
          guarantorTwoPhone: docInfo.guarantorTwoPhone,
        },
        token
      );
      Alert.alert("Success", "Your documents have been updated.");
    } catch (err: any) {
      Alert.alert("Update Failed", err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper >
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.separatorColor }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <IconSymbol name="ArrowBack" size={22} color={colors.iconColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Documents</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Form */}
      <View style={[styles.formContainer, { backgroundColor: colors.background }]}>
        <DocumentStep
          ref={stepRef}
          docInfo={docInfo}
          setDocInfo={setDocInfo}
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

export default DocumentsScreen;

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