// components/molecules/Header.tsx - Molecule header component
import React from 'react';
import { View } from 'react-native';
import { styles } from '@/constants/styles';
import { Text } from '../atoms/Text';
import { Icon } from '../atoms/Icon';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightContent?: React.ReactNode;
  onLeftIconPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightContent,
  onLeftIconPress,
}) => {
  return (
    <View style={styles.header}>
      {/* Left Icon */}
      {leftIcon && (
        <Icon
          icon={leftIcon}
          size="medium"
          onPress={onLeftIconPress}
        />
      )}

      {/* Title & Subtitle */}
      <View style={[styles.headerContent, !leftIcon && styles.headerContentNoIcon]}>
        <Text variant="h2" weight="bold">{title}</Text>
        {subtitle && (
          <Text variant="bodySmall" color="secondary">{subtitle}</Text>
        )}
      </View>

      {/* Right Content */}
      {rightContent && (
        <View style={styles.headerRight}>
          {rightContent}
        </View>
      )}
    </View>
  );
};