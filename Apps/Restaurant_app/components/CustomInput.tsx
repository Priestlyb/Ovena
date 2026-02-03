import React, { useState, } from 'react';
import { View, Text, TouchableOpacity, TextInput} from 'react-native';
import { CustomInputProps } from '@/types';
import { styles } from '../constants/styles';
import { Eye, EyeOff } from 'lucide-react-native';



export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  type = 'text',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'tel':
        return 'phone-pad';
      default:
        return 'default';
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
          secureTextEntry={type === 'password' && !showPassword}
          keyboardType={getKeyboardType()}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        />
        {type === 'password' && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeIcon}>{showPassword ? <Eye /> : <EyeOff />}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};