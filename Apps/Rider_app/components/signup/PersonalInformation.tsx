// PersonalStep.tsx
import React from "react";
import { ScrollView, TextInput, StyleSheet, View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { IconSymbol } from "../../components/ui/icon-symbol";

interface PersonalStepProps {
  personalInfo: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    password: string;
    gender: string;
    birth_date: { day: string; month: string; year: string };
    residential_address: string;
    next_of_kin_name?: string;
    next_of_kin_phone?: string;
    next_of_kin_address?: string;
    referre_code?: string;
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
    password: "PassWordIcon",
    address: "HomeIcon",
    nextOfKinName: "UserIcon",
    nextOfKinPhone: "PhoneIcon",
    ticket: "Ticket"
  };

  const renderInput = (
    label: string,
    placeholder: string,
    value: string,
    onChange: (text: string) => void,
    iconName: string,
    keyboardType?: any,
    error?: string
  ) => (
    <View style={styles.inputWrapper}>
  <Text style={styles.label}>{label}</Text>
  <View style={[styles.inputContainer, error && styles.inputContainerError]}>
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
  {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
          personalInfo.first_name,
          (text) => setPersonalInfo({ ...personalInfo, first_name: text }),
          icons.firstName
        )}
        {renderInput(
          "Last Name",
          "Enter your last name",
          personalInfo.last_name,
          (text) => setPersonalInfo({ ...personalInfo, last_name: text }),
          icons.lastName
        )}
        {renderInput(
          "Phone Number",
          "e.g 08XXXXXXXXX",
          personalInfo.phone_number,
          (text) => setPersonalInfo({ ...personalInfo, phone_number: text }),
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

        {renderInput(
          "Password",
          "Enter your password",
          personalInfo.password,
          (text) => setPersonalInfo({ ...personalInfo, password: text }),
          icons.password,
          "default"
          )}

        {renderInput(
         "Referal code (optional)",
         "Enter your referal code",
          personalInfo.referre_code || "",          // ✅ reads from correct field
          (text) => setPersonalInfo({ ...personalInfo, referre_code: text || "" }), // ✅ returns "" when empty
          icons.ticket,
          "default"
          )}
          

        {/* {renderInput(
          "Confirm Password",
          "Re-enter your password",
          personalInfo.confirmPassword || "",
          (text) => setPersonalInfo({ ...personalInfo, confirmPassword: text }),
          icons.password,
          "default",
           personalInfo.confirmPassword && personalInfo.confirmPassword !== personalInfo.password
           ? "Passwords do not match"
           : undefined  // 👈 only shows error after user starts typing
        )} */}
        

          

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
                selectedValue={personalInfo.birth_date.day}
                onValueChange={(itemValue) =>
                  setPersonalInfo({
                    ...personalInfo,
                    birth_date: { ...personalInfo.birth_date, day: itemValue },
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
                selectedValue={personalInfo.birth_date.month}
                onValueChange={(itemValue) =>
                  setPersonalInfo({
                    ...personalInfo,
                    birth_date: { ...personalInfo.birth_date, month: itemValue },
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
                selectedValue={personalInfo.birth_date.year}
                onValueChange={(itemValue) =>
                  setPersonalInfo({
                    ...personalInfo,
                    birth_date: { ...personalInfo.birth_date, year: itemValue },
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
          personalInfo.residential_address,
          (text) => setPersonalInfo({ ...personalInfo, residential_address: text }),
          icons.address
        )}
        {renderInput(
          "Next of Kin Name",
          "Enter next of kin name",
          personalInfo.next_of_kin_name || "",
          (text) => setPersonalInfo({ ...personalInfo, next_of_kin_name: text }),
          icons.nextOfKinName
        )}
        {renderInput(
          "Next of Kin Phone Number",
          "e.g 08XXXXXXXXX",
          personalInfo.next_of_kin_phone || "",
          (text) => setPersonalInfo({ ...personalInfo, next_of_kin_phone: text }),
          icons.nextOfKinPhone,
          "phone-pad"
        )}
        {renderInput(
          "Next of Kin Address",
          "Road 77",
          personalInfo.next_of_kin_address || "",
          (text) => setPersonalInfo({ ...personalInfo, next_of_kin_address: text }),
          icons.address,
          "address"
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
  inputContainerError: {
  borderColor: "#e53935",
  borderWidth: 1,
},
errorText: {
  color: "#e53935",
  fontSize: 12,
  marginTop: 4,
  marginLeft: 4,
},
});