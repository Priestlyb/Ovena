import { View, Text, StyleSheet } from 'react-native';
import { StatusButton } from './StatusButton';

interface OrderCardProps {
  itemName: string;
  orderId: string;
  price: number;
  time: string;
  status: string;
  onStatusPress?: () => void;
}

export function OrderCard({
  itemName,
  orderId,
  price,
  time,
  status,
  onStatusPress,
}: OrderCardProps) {
  return (
    <View style={styles.container}>
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
    </View>
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
