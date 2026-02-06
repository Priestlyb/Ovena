// components/atoms/Spacer.tsx - Atomic spacer component
import React from 'react';
import { View } from 'react-native';

export type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface SpacerProps {
  size?: SpacerSize;
  custom?: number;
  horizontal?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  custom,
  horizontal = false,
}) => {
  const sizes = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  };

  const spacing = custom || sizes[size];

  return (
    <View
      style={horizontal ? { width: spacing } : { height: spacing }}
    />
  );
};