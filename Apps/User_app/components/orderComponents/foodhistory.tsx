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

interface FoodHistoryCardProps {
  order: FoodOrder;
}

const FoodHistoryCard: React.FC<FoodHistoryCardProps> = ({ order }) => (
  <View style={styles.foodCardRed}>
    <Text style={styles.cardTitleWhite}>{order.name}</Text>
    <Text style={styles.cardDescriptionWhite}>{order.description}</Text>
    <Text style={styles.cardDescriptionWhite}>{order.extras}</Text>
    
    <View style={styles.ratingPriceRow}>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={14} color="#F6D44F" />
        <Text style={styles.ratingTextWhite}>{order.rating}</Text>
      </View>
      <Text style={styles.priceTextWhite}>${order.price}</Text>
    </View>
    
    <View style={styles.locationRow}>
      <Ionicons name="location" size={14} color="#fff" />
      <Text style={styles.locationTextWhite}>{order.location}</Text>
    </View>
    
    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.rateButton}>
        <Text style={styles.rateButtonText}>Rate</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.reOrderButton}>
        <Text style={styles.reOrderButtonText}>Re-Order</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  foodCardRed: {
    backgroundColor: '#D9502E',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitleWhite: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  cardDescriptionWhite: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
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
  ratingTextWhite: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  priceTextWhite: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  locationTextWhite: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rateButton: {
    flex: 1,
    backgroundColor: '#8B1E0F',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  rateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reOrderButton: {
    flex: 1,
    backgroundColor: '#F6D44F',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  reOrderButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FoodHistoryCard;