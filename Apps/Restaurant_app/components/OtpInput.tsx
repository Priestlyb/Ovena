import React, { useRef } from 'react';
import { View, TextInput } from 'react-native';
import { OTPInputProps } from '../types';
import { styles } from '../constants/styles';


export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 4,
}) => {
  const inputRefs = Array.from({ length }, () => useRef<TextInput>(null));

  const handleChange = (index: number, text: string) => {
    if (text.length > 1) text = text[0];
    
    const newValue = value.split('');
    while (newValue.length < length) newValue.push('');
    newValue[index] = text;
    onChange(newValue.join(''));

    if (text && index < length - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={inputRefs[index]}
          style={styles.otpBox}
          value={value[index] || ''}
          onChangeText={(text) => handleChange(index, text)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
        />
      ))}
    </View>
  );
};