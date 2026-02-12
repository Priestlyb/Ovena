// components/StatsCard.tsx - Stats card with dynamic icons
import { View, Text, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { Package, ShoppingCart, DollarSign, CheckCircle } from 'lucide-react-native';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  subtitleValue?: string | number;
  icon?: ReactNode;
  iconName?: 'shipment' | 'order' | 'revenue' | 'delivered';
}

export function StatsCard({
  title,
  value,
  subtitle,
  subtitleValue,
  icon,
  iconName,
}: StatsCardProps) {
  const getIcon = () => {
    if (icon) return icon;

    const iconProps = { color: '#FF6B35', size: 28 };

    switch (iconName) {
      case 'shipment':
        return <Package {...iconProps} />;
      case 'order':
        return <ShoppingCart {...iconProps} />;
      case 'revenue':
        return <DollarSign {...iconProps} />;
      case 'delivered':
        return <CheckCircle {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {getIcon()}
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtitle && (
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.subtitleValue}>{subtitleValue}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 160,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitleContainer: {
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  subtitleValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
});