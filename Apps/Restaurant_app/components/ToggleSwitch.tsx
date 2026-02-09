// ToggleSwitch.tsx - Reusable toggle switch component
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '@/constants/styles';

interface ToggleSwitchProps {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  value,
  onChange,
  activeLabel = 'Open',
  inactiveLabel = 'Closed',
}) => {
  return (
    <View style={styles.toggleContainer}>
      {label && <Text style={styles.toggleLabel}>{label}</Text>}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleStatusText}>
          {value ? activeLabel : inactiveLabel}
        </Text>
        <TouchableOpacity
          style={[styles.toggleSwitch, value && styles.toggleSwitchActive]}
          onPress={() => onChange(!value)}
          activeOpacity={0.8}
        >
          <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};