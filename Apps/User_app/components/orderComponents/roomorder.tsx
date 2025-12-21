import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RoomOrder {
  roomType: string;
  hotelName: string;
  dates: string;
  price: string;
  location: string;
}

interface RoomOrderCardProps {
  order: RoomOrder;
  isHistory: boolean;
}

const RoomOrderCard: React.FC<RoomOrderCardProps> = ({ order, isHistory }) => (
  <View style={isHistory ? styles.roomCardRed : styles.roomCardYellow}>
    <View style={styles.roomHeader}>
      <View>
        <Text style={isHistory ? styles.cardTitleWhite : styles.cardTitle}>
          {order.roomType}
        </Text>
        <Text style={isHistory ? styles.cardDescriptionWhite : styles.cardDescription}>
          {order.hotelName}
        </Text>
      </View>
      <View style={styles.roomPriceSection}>
        <Text style={isHistory ? styles.cardDescriptionWhite : styles.cardDescription}>
          {order.dates}
        </Text>
        <Text style={isHistory ? styles.priceTextWhite : styles.priceText}>
          ${order.price}
        </Text>
      </View>
    </View>
    
    <View style={styles.locationRow}>
      <Ionicons name="location" size={14} color={isHistory ? "#fff" : "#D9502E"} />
      <Text style={isHistory ? styles.locationTextWhite : styles.locationText}>
        {order.location}
      </Text>
    </View>
    
    {isHistory ? (
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.rateButton}>
          <Text style={styles.rateButtonText}>Rate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reBookButton}>
          <Text style={styles.reOrderButtonText}>Re-Book</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity style={styles.checkOrderButton}>
        <Text style={styles.checkOrderText}>View Booking</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  roomCardYellow: {
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
  roomCardRed: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  cardTitleWhite: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardDescriptionWhite: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
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
  locationText: {
    fontSize: 12,
    color: '#555',
    flex: 1,
  },
  locationTextWhite: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
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
  reBookButton: {
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
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  roomPriceSection: {
    alignItems: 'flex-end',
  },
});

export default RoomOrderCard;