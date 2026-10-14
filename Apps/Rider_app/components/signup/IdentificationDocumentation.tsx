import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  ScrollView, StyleSheet, View, TouchableOpacity, Text,
  Image, Alert, KeyboardAvoidingView, TouchableWithoutFeedback,
  Keyboard, Platform, ActivityIndicator,
} from "react-native";
import { IconSymbol } from "../../components/ui/icon-symbol";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import FormInput, { validateField } from "../FormInput";
import SelectField from "../SelectField";
import { useTheme } from "../../context/ThemeContext";

export interface DocInfo {
  drivers_license: string;
  nin: string;
  bvn: string;
  vehicleType: string;
  vehicleMake: string;
  plateNumber: string;
  guarantorName: string;
  guarantorPhone: string;
  guarantorTwoName: string;
  guarantorTwoPhone: string;
}

export const DEFAULT_DOC_INFO: DocInfo = {
  drivers_license: "",
  nin: "",
  bvn: "",
  vehicleType: "",
  vehicleMake: "",
  plateNumber: "",
  guarantorName: "",
  guarantorPhone: "",
  guarantorTwoName: "",
  guarantorTwoPhone: "",
};

type ErrorMap = Record<string, string>;

export function validateDocInfo(d: DocInfo): ErrorMap {
  return {
    drivers_license:   d.drivers_license ? "" : "Please upload a picture of your driver's license.",
    nin:               validateField(d.nin, "NIN", "number", false, 11, 11),
    bvn:               validateField(d.bvn, "BVN", "number", true, 11, 11),
    vehicleType:       d.vehicleType ? "" : "Please select a vehicle type.",
    vehicleMake:       validateField(d.vehicleMake, "Vehicle Make", "text"),
    plateNumber:       validateField(d.plateNumber, "Plate Number", "text"),
    guarantorName:     validateField(d.guarantorName, "Guarantor One Name", "name"),
    guarantorPhone:    validateField(d.guarantorPhone, "Guarantor One Phone", "phone"),
    guarantorTwoName:  validateField(d.guarantorTwoName, "Guarantor Two Name", "name"),
    guarantorTwoPhone: validateField(d.guarantorTwoPhone, "Guarantor Two Phone", "phone"),
  };
}

export function isDocInfoValid(errors: ErrorMap): boolean {
  return Object.values(errors).every((e) => !e);
}

export interface DocumentStepRef { triggerValidation: () => boolean; }

interface DocumentStepProps {
  docInfo: DocInfo;
  setDocInfo: (state: DocInfo) => void;
}

const DocumentStep = forwardRef<DocumentStepRef, DocumentStepProps>(
  ({ docInfo, setDocInfo }, ref) => {
    const { colors } = useTheme();
    const [errors, setErrors] = useState<ErrorMap>({});
    const [imageLoading, setImageLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      triggerValidation: () => {
        const errs = validateDocInfo(docInfo);
        setErrors(errs);
        return isDocInfoValid(errs);
      },
    }));

    const handleChange = (field: keyof DocInfo, value: string) => {
      setDocInfo({ ...docInfo, [field]: value });
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const pickLicenseImage = async () => {
      setImageLoading(true);
      try {
        const result = await DocumentPicker.getDocumentAsync({
          // Restrict to image types only — non-images are grayed out in the picker
          type: ["image/jpeg", "image/png", "image/jpg"],
          // copyToCacheDirectory: true copies the file into the app's cache and
          // returns a guaranteed file:// URI — this is the key fix that was not
          // available in expo-image-picker
          copyToCacheDirectory: true,
          multiple: false,
        });

        // User pressed cancel
        if (result.canceled) return;

        const asset = result.assets[0];
        const uri = asset.uri;

        // Confirm the file has bytes before accepting it
        const info = await FileSystem.getInfoAsync(uri);
        console.log("📦 License file info:", info);

        if (!info.exists || info.size === 0) {
          Alert.alert(
            "File Error",
            "The selected file could not be read. Please try a different photo."
          );
          return;
        }

        setDocInfo({ ...docInfo, drivers_license: uri });
        setErrors((prev) => ({ ...prev, drivers_license: "" }));
        console.log("📸 License image ready to upload:", uri, "size:", info.size);
      } catch (err) {
        Alert.alert("Error", "Could not open the file picker. Please try again.");
        console.error("Document picker error:", err);
      } finally {
        setImageLoading(false);
      }
    };

    const icons = { id: "UserIcon", vehicle: "FileDocumentOutline", phone: "PhoneIcon" };

    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.header}>
              <Text style={[styles.headerText, { color: colors.textPrimary }]}>Identification & Documentation</Text>
            </View>

            <ScrollView
              style={[styles.form, { backgroundColor: colors.background }]}
              contentContainerStyle={{ paddingVertical: 20, paddingBottom: 40 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Driver's License Upload */}
              <Text style={[styles.label, { color: colors.textPrimary }]}>Driver's License Photo</Text>
              <TouchableOpacity
                style={[
                  styles.uploadBox,
                  { backgroundColor: colors.inputBg, borderColor: colors.separatorColor },
                  errors.drivers_license ? styles.uploadBoxError : null,
                ]}
                onPress={pickLicenseImage}
                activeOpacity={0.75}
                disabled={imageLoading}
              >
                {imageLoading ? (
                  <ActivityIndicator size="large" color={colors.accentOrange} />
                ) : docInfo.drivers_license ? (
                  <>
                    <Image
                      source={{ uri: docInfo.drivers_license }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                    <View style={styles.changeOverlay}>
                      <IconSymbol name="IdCard" size={20} color="#fff" />
                      <Text style={styles.changeText}>Tap to change</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <IconSymbol
                      name="IdCard"
                      size={30}
                      color={errors.drivers_license ? "#e53935" : colors.textMuted}
                    />
                    <Text style={[
                      styles.uploadPrompt,
                      { color: colors.textMuted },
                      errors.drivers_license ? { color: "#e53935" } : null,
                    ]}>
                      Choose Picture
                    </Text>
                    <Text style={[styles.uploadSubtext, { color: colors.textMuted }]}>JPG, PNG supported</Text>
                  </>
                )}
              </TouchableOpacity>
              {errors.drivers_license ? (
                <Text style={styles.errorText}>{errors.drivers_license}</Text>
              ) : null}

              <FormInput
                label="NIN"
                placeholder="11-digit NIN"
                value={docInfo.nin}
                onChange={(t) => handleChange("nin", t)}
                iconName={icons.id}
                type="number"
                maxLength={11}
                error={errors.nin}
              />

              <FormInput
                label="BVN"
                placeholder="11-digit BVN"
                value={docInfo.bvn}
                onChange={(t) => handleChange("bvn", t)}
                iconName={icons.id}
                type="number"
                maxLength={11}
                optional
                error={errors.bvn}
              />

              <SelectField
                label="Vehicle Type"
                options={[
                  { label: "Bike", value: "bike" },
                  { label: "Car",  value: "car"  },
                  { label: "Van",  value: "van"  },
                ]}
                value={docInfo.vehicleType}
                onChange={(v) => {
                  setDocInfo({ ...docInfo, vehicleType: v });
                  setErrors((p) => ({ ...p, vehicleType: "" }));
                }}
                placeholder="Select Vehicle Type"
                error={errors.vehicleType}
              />

              <FormInput
                label="Vehicle Make"
                placeholder="e.g Toyota"
                value={docInfo.vehicleMake}
                onChange={(t) => handleChange("vehicleMake", t)}
                iconName={icons.vehicle}
                type="text"
                error={errors.vehicleMake}
              />

              <FormInput
                label="Plate Number"
                placeholder="e.g ABC-123XY"
                value={docInfo.plateNumber}
                onChange={(t) => handleChange("plateNumber", t)}
                iconName={icons.vehicle}
                type="text"
                maxLength={10}
                error={errors.plateNumber}
              />

              <FormInput
                label="Guarantor One Name"
                value={docInfo.guarantorName}
                onChange={(t) => handleChange("guarantorName", t)}
                iconName="UserIcon"
                type="name"
                error={errors.guarantorName}
              />

              <FormInput
                label="Guarantor One Phone"
                placeholder="e.g 08XXXXXXXXX"
                value={docInfo.guarantorPhone}
                onChange={(t) => handleChange("guarantorPhone", t)}
                iconName={icons.phone}
                type="phone"
                maxLength={15}
                error={errors.guarantorPhone}
              />

              <FormInput
                label="Guarantor Two Name"
                value={docInfo.guarantorTwoName}
                onChange={(t) => handleChange("guarantorTwoName", t)}
                iconName="UserIcon"
                type="name"
                error={errors.guarantorTwoName}
              />

              <FormInput
                label="Guarantor Two Phone"
                placeholder="e.g 08XXXXXXXXX"
                value={docInfo.guarantorTwoPhone}
                onChange={(t) => handleChange("guarantorTwoPhone", t)}
                iconName={icons.phone}
                type="phone"
                maxLength={15}
                error={errors.guarantorTwoPhone}
              />
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
);

export default DocumentStep;

const styles = StyleSheet.create({
  form: { flex: 1, paddingHorizontal: 20 },
  header: { alignItems: "center", marginBottom: 20, marginTop: 10 },
  headerText: { fontSize: 20, fontWeight: "bold" },
  inputWrapper: { marginVertical: 10 },
  label: { marginBottom: 8, fontWeight: "600", fontSize: 16 },
  pickerContainer: {
    borderWidth: 1, borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  pickerError: { borderColor: "#e53935", borderWidth: 1.5 },
  uploadBox: {
    height: 175, borderWidth: 1, borderRadius: 15,
    justifyContent: "center", alignItems: "center", marginVertical: 8,
    overflow: "hidden", shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  uploadBoxError: { borderColor: "#e53935", borderWidth: 1.5 },
  uploadPrompt: { fontSize: 16, marginTop: 8 },
  uploadSubtext: { fontSize: 12, marginTop: 4 },
  previewImage: { width: "100%", height: "100%", borderRadius: 15 },
  changeOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.45)", paddingVertical: 8,
    flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6,
  },
  changeText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  errorText: { color: "#e53935", fontSize: 12, marginTop: 4, marginLeft: 4 },
});