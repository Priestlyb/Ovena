import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FoodOrder {
  name: string;
  description: string;
  extras: string;
  rating: string;
  price: string;
  location: string;
}

interface FoodOrderCardProps {
  order: FoodOrder;
}

const FoodOrderCard: React.FC<FoodOrderCardProps> = ({ order }) => (
  <View style={styles.foodCardYellow}>
    <Text style={styles.cardTitle}>{order.name}</Text>
    <Text style={styles.cardDescription}>{order.description}</Text>
    <Text style={styles.cardDescription}>{order.extras}</Text>
    
    <View style={styles.ratingPriceRow}>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={14} color="#F5A623" />
        <Text style={styles.ratingText}>{order.rating}</Text>
      </View>
      <Text style={styles.priceText}>${order.price}</Text>
    </View>
    
    <View style={styles.locationRow}>
      <Ionicons name="location" size={14} color="#D9502E" />
      <Text style={styles.locationText}>{order.location}</Text>
    </View>
    
    <TouchableOpacity style={styles.checkOrderButton}>
      <Text style={styles.checkOrderText}>Check Order</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  foodCardYellow: {
    backgroundColor: '#FFF9E6',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 12,
    color: '#555',
    flex: 1,
  },
  checkOrderButton: {
    backgroundColor: '#D9502E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FoodOrderCard;