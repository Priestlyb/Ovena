// components/PINInput.tsx - 4-digit PIN input component
import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface PINInputProps {
  value: string[];
  onChange: (pin: string[]) => void;
  length?: number;
  autoFocus?: boolean;
}

export const PINInput: React.FC<PINInputProps> = ({
  value,
  onChange,
  length = 4,
  autoFocus = true,
}) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    // Only allow numbers
    if (text && !/^\d$/.test(text)) return;

    const newValue = [...value];
    newValue[index] = text;
    onChange(newValue);

    // Auto-focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={styles.input}
          value={value[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={autoFocus && index === 0}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  input: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#FEF3E7',
    borderWidth: 2,
    borderColor: '#FF6B35',
    fontSize: 32,
    fontWeight: '600',
    color: '#FF6B35',
    textAlign: 'center',
  },
});