// components/atoms/Badge.tsx - Atomic badge component
import React from 'react';
import { View } from 'react-native';
import { styles } from '@/constants/styles';
import { Text } from './Text';

export type BadgeVariant = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  dot = false,
}) => {
  return (
    <View style={[
      styles.badge,
      styles[`badge${size.charAt(0).toUpperCase() + size.slice(1)}`],
      styles[`badge${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    ]}>
      {dot && <View style={styles.badgeDot} />}
      <Text
        variant="caption"
        color="white"
        weight="semibold"
        style={styles.badgeText}
      >
        {label}
      </Text>
    </View>
  );
};