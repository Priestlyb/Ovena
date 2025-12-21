import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ iconName, label, onPress }) => (
    
  <TouchableOpacity
    onPress={onPress}
    style={styles.menuItem}
  >
    <View style={styles.menuItemLeft}>
      <Ionicons name={iconName} size={20} color="#333" />
      <Text style={styles.menuItemLabel}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#999" />
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