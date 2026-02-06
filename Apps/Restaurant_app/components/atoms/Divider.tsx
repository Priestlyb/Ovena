// components/atoms/Divider.tsx - Atomic divider component
import React from 'react';
import { View } from 'react-native';
import { styles } from '@/constants/styles';

export type DividerOrientation = 'horizontal' | 'vertical';

interface DividerProps {
  orientation?: DividerOrientation;
  spacing?: number;
  color?: string;
  thickness?: number;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  spacing = 0,
  color = '#E5E7EB',
  thickness = 1,
}) => {
  return (
    <View
      style={[
        styles.divider,
        orientation === 'horizontal' ? {
          height: thickness,
          width: '100%',
          marginVertical: spacing,
          backgroundColor: color,
        } : {
          width: thickness,
          height: '100%',
          marginHorizontal: spacing,
          backgroundColor: color,
        }
      ]}
    />
  );
};