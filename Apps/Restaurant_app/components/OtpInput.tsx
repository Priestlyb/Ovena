import React, { useMemo } from "react";
import { TextInput, View } from "react-native";
import { styles } from "../constants/styles";
import { OTPInputProps } from "../types";

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
}) => {
  const inputRefs = useMemo(
    () => Array.from({ length }, () => React.createRef<TextInput>()),
    [length],
  );

  const handleChange = (index: number, text: string) => {
    // Keep only digits
    const digits = text.replace(/\D/g, "");

    // User pasted the whole OTP
    if (digits.length > 1) {
      const pasted = digits.slice(0, length);

      onChange(pasted);

      const lastIndex = Math.min(pasted.length - 1, length - 1);

      inputRefs[lastIndex]?.current?.focus();

      return;
    }

    const chars = value.split("");

    while (chars.length < length) {
      chars.push("");
    }

    chars[index] = digits;

    onChange(chars.join(""));

    if (digits && index < length - 1) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !value[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={inputRefs[index]}
          style={styles.otpBox}
          value={value[index] ?? ""}
          onChangeText={(text) => handleChange(index, text)}
          onKeyPress={({ nativeEvent }) =>
            handleKeyPress(index, nativeEvent.key)
          }
          keyboardType="number-pad"
          maxLength={length}
          textAlign="center"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          importantForAutofill="yes"
          autoCorrect={false}
          autoCapitalize="none"
        />
      ))}
    </View>
  );
};
