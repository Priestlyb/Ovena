import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface CheckboxItemProps {
  label: string;
  price: number;
  checked: boolean;
  onToggle: () => void;
}

export const CheckboxItem: React.FC<CheckboxItemProps> = ({ 
  label, 
  price, 
  checked, 
  onToggle 
}) => (
  <TouchableOpacity style={styles.checkboxItem} onPress={onToggle}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
    <Text style={styles.checkboxPrice}>${price.toFixed(2)}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#ff6347',
    borderColor: '#ff6347',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  checkboxPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});