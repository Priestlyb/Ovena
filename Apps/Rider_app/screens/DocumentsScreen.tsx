// DocumentStep.tsx
import React from "react";
import {
  ScrollView,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { Picker } from "@react-native-picker/picker";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DocInfo {
  licensePicture: string;
  nin: string;
  bvn: string;
  vehicleType: string;
  vehicleMake: string;
  plateNumber: string;
  guarantorOneName: string;
  guarantorOnePhone: string;
  guarantorTwoName: string;   // FIX: was sharing same key as guarantorOne
  guarantorTwoPhone: string;  // FIX: was sharing same key as guarantorOne
}

export const DEFAULT_DOC_INFO: DocInfo = {
  licensePicture: "",
  nin: "",
  bvn: "",
  vehicleType: "",
  vehicleMake: "",
  plateNumber: "",
  guarantorOneName: "",
  guarantorOnePhone: "",
  guarantorTwoName: "",
  guarantorTwoPhone: "",
};

interface DocumentStepProps {
  docInfo?: DocInfo;                    // optional — safe if parent hasn't initialised yet
  setDocInfo: (state: DocInfo) => void;
  onUpdate?: () => void;               // called when Update button is pressed
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DocumentStep({
  docInfo = DEFAULT_DOC_INFO,           // default so undefined never crashes us
  setDocInfo,
  onUpdate,
}: DocumentStepProps) {

  // Typed merge helper — never accidentally wipes sibling fields
  const update = (patch: Partial<DocInfo>) =>
    setDocInfo({ ...docInfo, ...patch });

  // Reusable labelled text-input row
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
        {!!iconName && (
          <IconSymbol
            name={iconName as any}
            size={22}
            color="#555"
            style={{ marginRight: 10 }}
          />
        )}
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
        <Text style={styles.headerText}>Identification & Documentation</Text>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={{ paddingVertical: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Driver's License upload */}
        <Text style={styles.label}>Upload A Picture of your Driver's License</Text>
        <TouchableOpacity style={styles.uploadBox} activeOpacity={0.75}>
          <IconSymbol name="IdCard" size={30} color="#888" />
          <Text style={{ color: "#555", fontSize: 16, marginTop: 8 }}>Choose Picture</Text>
        </TouchableOpacity>

        {/* NIN — no icon per design */}
        {renderInput("NIN", "", docInfo.nin,
          (text) => update({ nin: text }), "")}

        {/* BVN — person icon */}
        {renderInput("BVN (Optional)", "", docInfo.bvn,
          (text) => update({ bvn: text }), "UserIcon")}

        {/* Vehicle Type — Picker */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Vehicle Type</Text>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={docInfo.vehicleType}
              style={{ flex: 1 }}
              onValueChange={(v) => update({ vehicleType: v })}
            >
              <Picker.Item label="Select" value="" />
              <Picker.Item label="Bike"  value="bike" />
              <Picker.Item label="Car"   value="car" />
              <Picker.Item label="Van"   value="van" />
            </Picker>
          </View>
        </View>

        {/* Vehicle Make */}
        {renderInput("Vehicle Make", "e.g Toyota", docInfo.vehicleMake,
          (text) => update({ vehicleMake: text }), "FileDocumentOutline")}

        {/* Plate Number */}
        {renderInput("Plate Number", "e.g ABC-123XY", docInfo.plateNumber,
          (text) => update({ plateNumber: text }), "FileDocumentOutline")}

        {/* Guarantor One */}
        {renderInput("Guarantor One Name", "", docInfo.guarantorOneName,
          (text) => update({ guarantorOneName: text }), "UserIcon")}

        {renderInput("Guarantor One Phone Number", "e.g 08XXXXXXXXX",
          docInfo.guarantorOnePhone,
          (text) => update({ guarantorOnePhone: text }),
          "", "phone-pad")}

        {/* Guarantor Two — FIX: now writes to its own separate keys */}
        {renderInput("Guarantor Two Name", "", docInfo.guarantorTwoName,
          (text) => update({ guarantorTwoName: text }), "UserIcon")}

        {renderInput("Guarantor Two Phone Number", "e.g 08XXXXXXXXX",
          docInfo.guarantorTwoPhone,
          (text) => update({ guarantorTwoPhone: text }),
          "", "phone-pad")}
      </ScrollView>

      {/* ── Fixed Update button at the bottom ── */}
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

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    height: 50,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: { flex: 1, height: "100%", color: "#000" },
  uploadBox: {
    height: 175,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    backgroundColor: "#F5F5F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* Update button bar */
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