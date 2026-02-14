import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CustomButton } from '@/components/productComponents/Button';

interface RestaurantCartScreenProps {
  onShowFees: () => void;
  onGoToCart: () => void;
}

const RestaurantCartScreen: React.FC<RestaurantCartScreenProps> = ({
  onShowFees,
  onGoToCart,
}) => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerWithTitle}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Restaurants Cart</Text>

        <View style={styles.iconButton} />
      </View>

      <ScrollView style={styles.restaurantList}>
        <View style={styles.restaurantCartItem}>
          <View style={styles.restaurantImageBox} />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>Eden Kitchen</Text>
            <Text style={styles.restaurantSubtext}>Salad - 20 - 1 item</Text>
            <Text style={styles.restaurantItemCount}>1 item</Text>
          </View>
          <Text style={styles.restaurantPrice}>$10.00</Text>
        </View>

        <View style={styles.restaurantCartItem}>
          <View style={styles.restaurantImageBox} />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>
              Amado&apos;s Shawarma and Pizza
            </Text>
            <Text style={styles.restaurantSubtext}>Salad - 20 - 1 item</Text>
            <Text style={styles.restaurantItemCount}>2 item</Text>
          </View>
          <Text style={styles.restaurantPrice}>$10.00</Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.feesInfoButton}
        onPress={onShowFees}
      >
        <Text style={styles.feesInfoIcon}>ℹ️</Text>
        <Text style={styles.feesInfoText}>Fees Information</Text>
      </TouchableOpacity>

      <View style={styles.bottomButtonContainer}>
        <CustomButton title="Go to Cart" onPress={onGoToCart} />
      </View>
    </View>
  );
};

export default RestaurantCartScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerWithTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
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
    borderBottomColor: '#f0f0f0',
  },
  restaurantImageBox: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#e8e8e8',
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  restaurantSubtext: {
    fontSize: 12,
    color: '#777',
  },
  restaurantItemCount: {
    fontSize: 12,
    color: '#999',
  },
  restaurantPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  feesInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  feesInfoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  feesInfoText: {
    fontSize: 14,
    color: '#555',
  },
  bottomButtonContainer: {
    padding: 16,
    paddingBottom: 24,
  },
});
