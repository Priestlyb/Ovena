import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Counter } from './Counter';
import { CartItem } from '@/app/types';

interface CartItemComponentProps {
  item: CartItem;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CartItemComponent: React.FC<CartItemComponentProps> = ({ 
  item, 
  onIncrement, 
  onDecrement, 
  onDelete 
}) => (
  <View style={styles.cartItemContainer}>
    <View style={styles.cartItemContent}>
      <View style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemRestaurant}>{item.restaurant}</Text>
      </View>
    </View>
    <View style={styles.cartItemActions}>
      <Counter 
        value={item.quantity} 
        onIncrement={() => onIncrement(item.id)}
        onDecrement={() => onDecrement(item.id)}
        minValue={1}
      />
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteIconButton}>
        <Text style={styles.deleteIconText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  cartItemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  cartItemContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    marginRight: 12,
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  cartItemRestaurant: {
    fontSize: 12,
    color: '#666',
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteIconButton: {
    padding: 8,
    marginLeft: 12,
  },
  deleteIconText: {
    fontSize: 18,
  },
}); 