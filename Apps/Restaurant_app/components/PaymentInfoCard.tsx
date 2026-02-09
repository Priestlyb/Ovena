// components/PaymentInfoCard.tsx - Payment information display card
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Landmark } from 'lucide-react-native';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Spacer } from '@/components/atoms/Spacer';

interface PaymentInfoCardProps {
  bankName: string;
  accountNumber: string;
}

export const PaymentInfoCard: React.FC<PaymentInfoCardProps> = ({
  bankName,
  accountNumber,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Landmark size={24} color="#111827" />
      </View>
      
      <View style={styles.content}>
        <Text variant="body" weight="semibold">{bankName}</Text>
        <Text variant="bodySmall" color="secondary">{accountNumber}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FEF3E7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
});