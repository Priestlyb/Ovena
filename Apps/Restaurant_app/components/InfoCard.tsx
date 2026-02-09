// components/InfoCard.tsx - Information card with title and content
import React from 'react';
import { View, StyleSheet } from 'react-native';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Spacer } from '@/components/atoms/Spacer';
import { Divider } from '@/components/atoms/Divider';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  showShadow?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  showShadow = true,
}) => {
  return (
    <View style={[styles.container, showShadow && styles.shadow]}>
      <Text variant="h4" weight="bold">{title}</Text>
      <Spacer size="md" />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
  bold?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, bold = false }) => {
  return (
    <View style={styles.row}>
      <Text variant="body" color="secondary">{label}</Text>
      <Spacer size="xs" />
      <Text variant="body" weight={bold ? 'bold' : 'regular'}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    gap: 12,
  },
  row: {
    gap: 4,
  },
});