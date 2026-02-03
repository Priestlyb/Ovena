import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { PhoneInputProps } from '../types';
import { styles } from '../constants/styles';


export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  required = false,
  countryCode = '+234',
  countryFlag = '🇳🇬',
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Phone number</Text>
        {required && <Text style={styles.required}> *</Text>}
      </View>
      
      <View style={styles.phoneRow}>
        <View style={styles.countryCodeBox}>
          <Text style={styles.flagEmoji}>{countryFlag}</Text>
          <Text style={styles.countryCodeText}>{countryCode}</Text>
        </View>
        <TextInput
          style={styles.phoneInput}
          value={value}
          onChangeText={onChange}
          placeholder="e.g 09xxxxxxx"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );
};
