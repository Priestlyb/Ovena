import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'small' | 'large';
  minValue?: number;
}

export const Counter: React.FC<CounterProps> = ({ 
  value, 
  onIncrement, 
  onDecrement, 
  size = 'small',
  minValue = 0 
}) => (
  <View style={[styles.counter, size === 'large' && styles.counterLarge]}>
    <TouchableOpacity 
      onPress={onDecrement} 
      style={styles.counterButton}
      disabled={value <= minValue}
    >
      <Text style={styles.counterButtonText}>−</Text>
    </TouchableOpacity>
    <Text style={[styles.counterValue, size === 'large' && styles.counterValueLarge]}>
      {value}
    </Text>
    <TouchableOpacity onPress={onIncrement} style={[styles.counterButton, styles.counterButtonRed]}>
      <Text style={[styles.counterButtonText, styles.counterButtonTextWhite]}>+</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  counterLarge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  counterButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  counterButtonRed: {
    backgroundColor: '#ff6347',
  },
  counterButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  counterButtonTextWhite: {
    color: '#fff',
  },
  counterValue: {
    marginHorizontal: 14,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  counterValueLarge: {
    fontSize: 16,
    marginHorizontal: 16,
  },
});
