import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomButton } from '@/components/productComponents/Button';
import { Restaurant } from '../types';

interface RestaurantCartScreenProps {
  restaurants: Restaurant[];
  onShowFees: () => void;
  onGoToCart: () => void;
  onBack?: () => void;
}

 const RestaurantCartScreen: React.FC<RestaurantCartScreenProps> = ({ 
  restaurants,
  onShowFees,
  onGoToCart,
  onBack 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack}>
          <Text style={styles.iconButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurants Cart</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView style={styles.restaurantList}>
        {restaurants.map(restaurant => (
          <View key={restaurant.id} style={styles.restaurantCartItem}>
            <View style={styles.restaurantImageBox} />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantSubtext}>{restaurant.details}</Text>
              <Text style={styles.restaurantItemCount}>{restaurant.itemCount} item</Text>
            </View>
            <Text style={styles.restaurantPrice}>${restaurant.totalPrice.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.feesInfoButton} onPress={onShowFees}>
        <Text style={styles.feesInfoIcon}>ℹ️</Text>
        <Text style={styles.feesInfoText}>Fees Information</Text>
      </TouchableOpacity>

      <View style={styles.bottomButtonContainer}>
        <CustomButton 
          title="Go to Cart"
          onPress={onGoToCart}
        />
      </View>
    </View>
  );
};

export default RestaurantCartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    fontSize: 18,
    color: '#333',
  },
  restaurantList: {
    flex: 1,
  },
  restaurantCartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  restaurantImageBox: {
    width: 60,
    height: 60,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  restaurantSubtext: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  restaurantItemCount: {
    fontSize: 12,
    color: '#666',
  },
  restaurantPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  feesInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  feesInfoIcon: {
    fontSize: 16,
  },
  feesInfoText: {
    fontSize: 14,
    color: '#666',
  },
  bottomButtonContainer: {
    padding: 16,
    paddingBottom: 24,
  },
});
