import React from "react";
import {
  ScrollView,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { IconSymbol } from "../../components/ui/icon-symbol";
import { Picker } from "@react-native-picker/picker";

interface DocumentStepProps {
  docInfo: {
    licensePicture: string;
    nin: string;
    bvn: string;
    vehicleType: string;
    vehicleMake: string;
    plateNumber: string;
    guarantorName: string;
    guarantorPhone?: string;
  };
  setDocInfo: (state: any) => void;
}

export default function DocumentStep({
  docInfo,
  setDocInfo,
}: DocumentStepProps) {
  const icons = {
    licensePicture: "CardOutline",
    nin: "",
    bvn: "UserIcon",
    vehicleType: "",
    vehicleMake: "FileDocumentOutline",
    plateNumber: "FileDocumentOutline",
    guarantor: "UserIcon",
    guarantorPhone: "",
  };

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
        <IconSymbol
          name={iconName as any}
          size={22}
          color="#555"
          style={{ marginRight: 10 }}
        />
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

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Identification & Documentation</Text>
      </View>
      <ScrollView
        style={styles.form}
        contentContainerStyle={{ paddingVertical: 30 }}
      >
        <Text style={styles.label}>Upload A Picture of your Driver’s License</Text>
        <TouchableOpacity style={styles.uploadBox}>
          <IconSymbol name="IdCard" size={30} color="#888" />
          <Text style={{ color: "#555", fontSize: 16 }}>Choose Picture</Text>
        </TouchableOpacity>

        {renderInput(
          "NIN",
          "",
          docInfo.nin,
          (text) => setDocInfo({ ...docInfo, nin: text }),
          icons.nin
        )}
        {renderInput(
          "BVN (Optional)",
          "",
          docInfo.bvn,
          (text) => setDocInfo({ ...docInfo, bvn: text }),
          icons.bvn
        )}

        {/* Vehicle Type */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Vehicle Type</Text>
          <View style={styles.inputContainer}>
            <IconSymbol
              name={icons.vehicleType as any}
              size={22}
              color="#555"
              style={{ marginRight: 10 }}
            />
            <Picker
              selectedValue={docInfo.vehicleType}
              style={{ flex: 1 }}
              onValueChange={(itemValue) =>
                setDocInfo({ ...docInfo, vehicleType: itemValue })
              }
            >
              <Picker.Item label="Select" value="" />
              <Picker.Item label="Bike" value="bike" />
              <Picker.Item label="Car" value="car" />
              <Picker.Item label="Van" value="van" />
            </Picker>
          </View>
        </View>

        {renderInput(
          "Vehicle Make",
          "e.g Toyota",
          docInfo.vehicleMake,
          (text) => setDocInfo({ ...docInfo, vehicleMake: text }),
          icons.vehicleMake
        )}
        {renderInput(
          "Plate Number",
          "e.g ABC-123XY",
          docInfo.plateNumber,
          (text) => setDocInfo({ ...docInfo, plateNumber: text }),
          icons.plateNumber
        )}
        {renderInput(
          "Guarantor One Name",
          "",
          docInfo.guarantorName,
          (text) => setDocInfo({ ...docInfo, guarantorName: text }),
          icons.guarantor
        )}
        {renderInput(
          "Guarantor One Phone Number",
          "e.g 08XXXXXXXXX",
          docInfo.guarantorPhone || "",
          (text) => setDocInfo({ ...docInfo, guarantorPhone: text }),
          icons.guarantorPhone,
          "phone-pad"
        )}
        {renderInput(
          "Guarantor Two Name",
          "",
          docInfo.guarantorName,
          (text) => setDocInfo({ ...docInfo, guarantorName: text }),
          icons.guarantor
        )}
        {renderInput(
          "Guarantor Two Phone Number",
          "e.g 08XXXXXXXXX",
          docInfo.guarantorPhone || "",
          (text) => setDocInfo({ ...docInfo, guarantorPhone: text }),
          icons.guarantorPhone,
          "phone-pad"
        )}
      </ScrollView>
    </>
  );
}

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
});
