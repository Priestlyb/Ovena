import { CustomInputProps } from "@/types";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../constants/styles";

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  type = "text",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getKeyboardType = () => {
    switch (type) {
      case "email":
        return "email-address";
      case "tel":
        return "phone-pad";
      case "currency":
        return "phone-pad";
      case "number":
        return "phone-pad";
      default:
        return "default";
    }
  };

  return (
    <View style={styles.inputContainer}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}> *</Text>}
        </View>
      )}

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={type === "password" && !showPassword}
          keyboardType={getKeyboardType()}
          autoCapitalize={type === "email" ? "none" : "sentences"}
        />
        {type === "password" && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeIcon}>
              {showPassword ? <Eye /> : <EyeOff />}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
