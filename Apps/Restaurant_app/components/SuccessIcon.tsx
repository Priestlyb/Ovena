// components/SuccessIcon.tsx - Success checkmark icon
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

interface SuccessIconProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export const SuccessIcon: React.FC<SuccessIconProps> = ({
  size = 100,
  color = '#FFFFFF',
  backgroundColor = '#10B981',
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      <Check size={size * 0.5} color={color} strokeWidth={3} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});