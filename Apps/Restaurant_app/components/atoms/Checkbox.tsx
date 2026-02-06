// components/atoms/Checkbox.tsx - Atomic checkbox component
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from '@/constants/styles';
import { Check } from 'lucide-react-native';

export type CheckboxSize = 'small' | 'medium' | 'large';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: CheckboxSize;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  size = 'medium',
  disabled = false,
}) => {
  const sizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const dimension = sizes[size];

  return (
    <TouchableOpacity
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            width: dimension,
            height: dimension,
          },
          checked && styles.checkboxChecked,
          disabled && styles.checkboxDisabled,
        ]}
      >
        {checked && (
          <Check
            size={dimension * 0.7}
            color="#fff"
            strokeWidth={3}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};