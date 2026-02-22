// screens/DocumentsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import PageHeader from "../components/PageHeader";
import FormField from "../components/FormField";
import SelectField from "../components/SelectField";
import { IconSymbol } from "../components/ui/icon-symbol";

interface DocumentsScreenProps {
  onBack: () => void;
}

const VEHICLE_OPTIONS = ["Bicycle", "Motorcycle", "Car", "Van", "Truck"];

const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ onBack }) => {
  const [licensePhoto, setLicensePhoto] = useState<string | null>(null);
  const [nin, setNin] = useState("");
  const [bvn, setBvn] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [plateNumber, setPlateNumber] = useState("");

  const handleChoosePicture = () => {
    // Integrate with expo-image-picker in production
    Alert.alert("Choose Picture", "Camera or Gallery", [
      { text: "Camera" },
      { text: "Gallery" },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSave = () => {
    if (!nin.trim()) {
      Alert.alert("Required", "NIN is required.");
      return;
    }
    Alert.alert("Saved", "Documents updated successfully.");
  };

  return (
    <ScreenWrapper scrollable>
      <PageHeader title="Documents" onBack={onBack} />

      <View style={styles.content}>
        {/* Driver's license upload */}
        <Text style={styles.uploadLabel}>
          Upload A Picture of your Driver's License
        </Text>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={handleChoosePicture}
          activeOpacity={0.75}
        >
          {licensePhoto ? (
            <Image source={{ uri: licensePhoto }} style={styles.uploadedImage} />
          ) : (
            <>
              <IconSymbol name="IdCardIcon" size={32} color="#aaa" />
              <Text style={styles.uploadHint}>Choose Picture</Text>
            </>
          )}
        </TouchableOpacity>

        {/* NIN */}
        <FormField
          label="NIN"
          required
          value={nin}
          onChangeText={setNin}
          placeholder=""
          keyboardType="number-pad"
          maxLength={11}
        />

        {/* BVN */}
        <FormField
          label="BVN"
          iconName="PersonIcon"
          value={bvn}
          onChangeText={setBvn}
          placeholder=""
          keyboardType="number-pad"
          maxLength={11}
        />

        {/* Vehicle Selection */}
        <SelectField
          label="Vehicle Selection"
          options={VEHICLE_OPTIONS}
          value={vehicleType}
          onChange={setVehicleType}
          placeholder="Select"
        />

        {/* Vehicle Make */}
        <FormField
          label="Vehicle Make"
          iconName="DocumentIcon"
          value={vehicleMake}
          onChangeText={setVehicleMake}
          placeholder="e.g Toyota"
        />

        {/* Plate Number */}
        <FormField
          label="Plate Number"
          iconName="DocumentIcon"
          value={plateNumber}
          onChangeText={setPlateNumber}
          placeholder=""
          autoCapitalize="characters"
        />

        {/* Save button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default DocumentsScreen;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
    marginBottom: 10,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  uploadHint: {
    fontSize: 14,
    color: "#aaa",
    fontWeight: "400",
  },
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