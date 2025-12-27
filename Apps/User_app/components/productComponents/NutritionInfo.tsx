import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NutritionInfoProps {
  label: string;
  value: string | number;
  unit: string;
}

export const NutritionInfo: React.FC<NutritionInfoProps> = ({ label, value, unit }) => (
  <View style={styles.nutritionItem}>
    <Text style={styles.nutritionValue}>{value}{unit}</Text>
    <Text style={styles.nutritionLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 11,
    color: '#666',
  },
});