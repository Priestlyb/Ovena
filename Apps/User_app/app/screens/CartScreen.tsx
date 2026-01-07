import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomButton } from '@/components/productComponents/Button';
import { CartItemComponent } from '@/components/productComponents/CartItemComponent';
import { CartItem } from '@/app/types';

interface OrderSummary {
  products: number;
  delivery: number;
  discount: number;
}

interface CartScreenProps {
  cartItems: CartItem[];
  orderSummary: OrderSummary;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onCheckout: () => void;
  onBack?: () => void;
  onClearCart?: () => void;
}

 const CartScreen: React.FC<CartScreenProps> = ({ 
  cartItems,
  orderSummary,
  onIncrement,
  onDecrement,
  onDeleteItem,
  onCheckout,
  onBack,
  onClearCart
}) => {
  const calculateTotal = (): number => {
    return orderSummary.products + orderSummary.delivery - orderSummary.discount;
  };

  const restaurantName = cartItems[0]?.restaurant || '';
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack}>
          <Text style={styles.iconButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carts</Text>
        <TouchableOpacity style={styles.iconButton} onPress={onClearCart}>
          <Text style={styles.iconButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.cartSubheader}>
        {totalItems} Product from {restaurantName}
      </Text>

      <ScrollView style={styles.cartListContainer}>
        {cartItems.map((item) => (
          <CartItemComponent 
            key={item.id}
            item={item}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onDelete={onDeleteItem}
          />
        ))}

        <TouchableOpacity style={styles.addMoreItemsButton}>
          <Text style={styles.addMoreItemsText}>Add more items</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.orderSummaryCard}>
        <Text style={styles.orderSummaryTitle}>Order Summary</Text>
        
        <View style={styles.summaryLine}>
          <Text style={styles.summaryLineLabel}>Products</Text>
          <Text style={styles.summaryLineValue}>${orderSummary.products.toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryLine}>
          <Text style={styles.summaryLineLabel}>Delivery</Text>
          <Text style={styles.summaryLineValue}>${orderSummary.delivery.toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryLine}>
          <Text style={styles.summaryLineLabel}>Discount</Text>
          <Text style={styles.summaryLineValue}>${orderSummary.discount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryLine}>
          <Text style={styles.summaryTotalLabel}>Total Payment</Text>
          <Text style={styles.summaryTotalValue}>${calculateTotal().toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.bottomButtonContainer}>
        <CustomButton 
          title="Checkout Now"
          onPress={onCheckout}
        />
      </View>
    </View>
  );
};

export default CartScreen;

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
  cartSubheader: {
    padding: 16,
    fontSize: 13,
    color: '#666',
    backgroundColor: '#fafafa',
  },
  cartListContainer: {
    flex: 1,
  },
  addMoreItemsButton: {
    padding: 16,
    alignItems: 'center',
  },
  addMoreItemsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff6347',
  },
  orderSummaryCard: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLineLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryLineValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  bottomButtonContainer: {
    padding: 16,
    paddingBottom: 24,
  },
});