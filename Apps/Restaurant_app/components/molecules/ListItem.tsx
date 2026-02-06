// components/molecules/ListItem.tsx - Molecule list item component
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { styles } from '@/constants/styles';
import { Text } from '../atoms/Text';
import { Avatar } from '../atoms/Avatar';
import { Icon } from '../atoms/Icon';
import { Checkbox } from '../atoms/Checkbox';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  leftAvatar?: string;
  rightIcon?: React.ReactNode;
  rightText?: string;
  checkbox?: boolean;
  checked?: boolean;
  onPress?: () => void;
  onCheckChange?: (checked: boolean) => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  leftAvatar,
  rightIcon,
  rightText,
  checkbox = false,
  checked = false,
  onPress,
  onCheckChange,
}) => {
  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      {/* Left Content */}
      {leftAvatar && (
        <View style={styles.listItemLeft}>
          <Avatar source={leftAvatar} size="md" />
        </View>
      )}
      {leftIcon && (
        <View style={styles.listItemLeft}>
          {leftIcon}
        </View>
      )}

      {/* Center Content */}
      <View style={styles.listItemCenter}>
        <Text variant="body" weight="semibold">{title}</Text>
        {subtitle && (
          <Text variant="bodySmall" color="secondary">{subtitle}</Text>
        )}
      </View>

      {/* Right Content */}
      {rightText && (
        <Text variant="body" color="secondary" style={styles.listItemRightText}>
          {rightText}
        </Text>
      )}
      {rightIcon && (
        <View style={styles.listItemRight}>
          {rightIcon}
        </View>
      )}
      {checkbox && onCheckChange && (
        <View style={styles.listItemRight}>
          <Checkbox
            checked={checked}
            onChange={onCheckChange}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};