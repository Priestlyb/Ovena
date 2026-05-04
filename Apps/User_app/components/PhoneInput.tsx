import React from "react";
import { View, Text, TextInput, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";

interface PhoneInputProps {
  value: string;
  onChange: (text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export default function PhoneInput({
  value,
  onChange,
  containerStyle,
  inputStyle,
}: PhoneInputProps) {
  return (
    <View style={[styles.row, containerStyle]}>
      {/* Flag + Country Code */}
      <View style={styles.countryBox}>
        <Text style={styles.flag}>🇳🇬</Text>
        <Text style={styles.code}>+234</Text>
      </View>

      {/* Phone Input */}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="Phone number"
        keyboardType="phone-pad"
        value={value}
        onChangeText={onChange}
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  countryBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  flag: {
    fontSize: 20,
  },
  code: {
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    minHeight: 50,
  },
});