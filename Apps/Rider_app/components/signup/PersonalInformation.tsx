// PersonalStep.tsx
import React from "react";
import { ScrollView, TextInput, StyleSheet, View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { IconSymbol } from "../../components/ui/icon-symbol";

interface PersonalStepProps {
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    gender: string;
    dob: { day: string; month: string; year: string };
    address: string;
    nextOfKinName?: string;
    nextOfKinPhone?: string;
  };
  setPersonalInfo: (state: any) => void;
}

export default function PersonalStep({
  personalInfo,
  setPersonalInfo,
}: PersonalStepProps) {
  // Map input fields to IconSymbol names
  const icons = {
    firstName: "UserIcon",
    lastName: "UserIcon",
    phone: "PhoneIcon",
    email: "EmailIcon",
    address: "HomeIcon",
    nextOfKinName: "UserIcon",
    nextOfKinPhone: "PhoneIcon",
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
        <Text style={styles.headerText}>Personal Information</Text>
      </View>
      <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 40 }}>
        {renderInput(
          "First Name",
          "Enter your first name",
          personalInfo.firstName,
          (text) => setPersonalInfo({ ...personalInfo, firstName: text }),
          icons.firstName
        )}
        {renderInput(
          "Last Name",
          "Enter your last name",
          personalInfo.lastName,
          (text) => setPersonalInfo({ ...personalInfo, lastName: text }),
          icons.lastName
        )}
        {renderInput(
          "Phone Number",
          "e.g 08XXXXXXXXX",
          personalInfo.phone,
          (text) => setPersonalInfo({ ...personalInfo, phone: text }),
          icons.phone,
          "phone-pad"
        )}
        {renderInput(
          "Email Address",
          "Enter your email address",
          personalInfo.email,
          (text) => setPersonalInfo({ ...personalInfo, email: text }),
          icons.email,
          "email-address"
        )}

        {/* Gender Picker */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={personalInfo.gender}
              onValueChange={(itemValue) =>
                setPersonalInfo({ ...personalInfo, gender: itemValue })
              }
              style={{ flex: 1 }}
            >
              <Picker.Item label="Select" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        {/* Date of Birth Pickers */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Date of Birth</Text>
          <View style={styles.dobContainer}>
            {/* Day */}
            <View style={styles.dobPickerContainer}>
              <Picker
                selectedValue={personalInfo.dob.day}
                onValueChange={(itemValue) =>
                  setPersonalInfo({
                    ...personalInfo,
                    dob: { ...personalInfo.dob, day: itemValue },
                  })
                }
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
                onValueChange={(itemValue) =>
                  setPersonalInfo({
                    ...personalInfo,
                    dob: { ...personalInfo.dob, month: itemValue },
                  })
                }
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
                onValueChange={(itemValue) =>
                  setPersonalInfo({
                    ...personalInfo,
                    dob: { ...personalInfo.dob, year: itemValue },
                  })
                }
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
          "Residential Address",
          "Enter your residential address",
          personalInfo.address,
          (text) => setPersonalInfo({ ...personalInfo, address: text }),
          icons.address
        )}
        {renderInput(
          "Next of Kin Name",
          "Enter next of kin name",
          personalInfo.nextOfKinName || "",
          (text) => setPersonalInfo({ ...personalInfo, nextOfKinName: text }),
          icons.nextOfKinName
        )}
        {renderInput(
          "Next of Kin Phone Number",
          "e.g 08XXXXXXXXX",
          personalInfo.nextOfKinPhone || "",
          (text) => setPersonalInfo({ ...personalInfo, nextOfKinPhone: text }),
          icons.nextOfKinPhone,
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
});