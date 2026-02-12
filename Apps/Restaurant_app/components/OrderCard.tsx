// components/OrderCard.tsx - Order card with navigation to details
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusButton } from './StatusButton';

interface OrderCardProps {
  id: string;
  itemName: string;
  orderId: string;
  price: number;
  time: string;
  status: string;
  type: string;
  onStatusPress?: () => void;
}

export function OrderCard({
  id,
  itemName,
  orderId,
  price,
  time,
  status,
  type,
  onStatusPress,
}: OrderCardProps) {
  const router = useRouter();

  const handleCardPress = () => {
    router.push({
      pathname: '/screens/OrderDetailsPage',
      params: { orderId: id },
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <View style={styles.leftSection}>
          <Text style={styles.itemName}>{itemName}</Text>
          <Text style={styles.orderLabel}>Order ID</Text>
          <Text style={styles.orderId}>{orderId}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.price}>₦{price.toLocaleString()}</Text>
          <StatusButton status={status} onPress={onStatusPress} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  orderLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  orderId: {
    fontSize: 12,
    color: '#666',
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
});