// components/ProfileMenuItem.tsx - Menu item for profile sections
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ChevronRight, LucideIcon } from 'lucide-react-native';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Badge } from '@/components/atoms/Badge';

interface ProfileMenuItemProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  badge?: {
    icon?: React.ReactNode;
    color?: string;
  };
}

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon: Icon,
  label,
  onPress,
  badge,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <Icon size={20} color="#6B7280" />
        <Text variant="body" color="primary">{label}</Text>
      </View>

      <View style={styles.rightContent}>
        {badge && (
          <View style={[styles.badgeCircle, { backgroundColor: badge.color || '#FF6B35' }]}>
            {badge.icon}
          </View>
        )}
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});