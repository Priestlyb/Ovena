import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { IconName } from "@/components/ui/icon-symbol";

interface MenuItemProps {
  iconName: IconName;
  label: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ iconName, label, onPress }) => (
    
  <TouchableOpacity
    onPress={onPress}
    style={styles.menuItem}
  >
    <View style={styles.menuItemLeft}>
      <IconSymbol name={iconName} size={20} color="#333" />
      <Text style={styles.menuItemLabel}>{label}</Text>
    </View>
    <IconSymbol name="ChevronForwardIcon" size={20} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default MenuItem;