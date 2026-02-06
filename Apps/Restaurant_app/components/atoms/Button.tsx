// components/atoms/Button.tsx - Atomic button component
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styles } from '@/constants/styles';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`],
        styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
        fullWidth && styles.buttonFullWidth,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {icon && iconPosition === 'left' && <View style={styles.buttonIconLeft}>{icon}</View>}
        <Text style={[
          styles.buttonText,
          styles[`buttonText${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
          disabled && styles.buttonTextDisabled,
        ]}>
          {label}
        </Text>
        {icon && iconPosition === 'right' && <View style={styles.buttonIconRight}>{icon}</View>}
      </View>
    </TouchableOpacity>
  );
};