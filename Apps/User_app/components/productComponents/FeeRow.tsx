import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FeeRowProps {
  icon: string;
  label: string;
  description?: string;
  amount: number;
}

export const FeeRow: React.FC<FeeRowProps> = ({ icon, label, description, amount }) => (
  <View style={styles.feeRowContainer}>
    <View style={styles.feeRowLeft}>
      <Text style={styles.feeRowIcon}>{icon}</Text>
      <View style={styles.feeRowContent}>
        <Text style={styles.feeRowLabel}>{label}</Text>
        {description && <Text style={styles.feeRowDescription}>{description}</Text>}
      </View>
    </View>
    <Text style={styles.feeRowAmount}>₦{amount.toFixed(2)}</Text>
  </View>
);

const styles = StyleSheet.create({
  feeRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  feeRowLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 16,
  },
  feeRowIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  feeRowContent: {
    flex: 1,
  },
  feeRowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  feeRowDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  feeRowAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});
