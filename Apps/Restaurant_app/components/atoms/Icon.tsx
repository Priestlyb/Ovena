// components/atoms/Icon.tsx - Atomic icon wrapper component
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { styles } from '@/constants/styles';

export type IconSize = 'small' | 'medium' | 'large' | 'xlarge';

interface IconProps {
  icon: React.ReactNode;
  size?: IconSize;
  color?: string;
  onPress?: () => void;
  badge?: number;
}

export const Icon: React.FC<IconProps> = ({
  icon,
  size = 'medium',
  color,
  onPress,
  badge,
}) => {
  const iconSizes = {
    small: 16,
    medium: 24,
    large: 32,
    xlarge: 48,
  };

  const content = (
    <View style={[
      styles.iconContainer,
      { width: iconSizes[size], height: iconSizes[size] }
    ]}>
      {icon}
      {badge !== undefined && badge > 0 && (
        <View style={styles.iconBadge}>
          <View style={styles.iconBadgeText}>{badge > 99 ? '99+' : badge}</View>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.iconTouchable}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};