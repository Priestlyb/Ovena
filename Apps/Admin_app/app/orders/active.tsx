/**
 * app/orders/active.tsx
 *
 * Full list of active orders. Reached via the "View all active orders"
 * button on LiveMapCard. Each row opens Order Detail.
 */

import React from 'react';
import { FlatList, View, Text, Pressable, StyleSheet } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { MOCK_ACTIVE_ORDERS } from '@/data/mockDashboard';
import { ActiveOrderSummary, OrderStatus } from '@/types/dashboard';

export default function ActiveOrdersScreen() {
  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: 'Active Orders' }} />
      <FlatList
        data={MOCK_ACTIVE_ORDERS}
        keyExtractor={(item) => item.orderId}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => <OrderRow order={item} />}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
      />
    </ScreenWrapper>
  );
}

function OrderRow({ order }: { order: ActiveOrderSummary }) {
  const { colors } = useTheme();

  const handlePress = () => {
    console.log('📦➡️ [ActiveOrders] opening order', order.orderId);
    router.push({ pathname: `users/order/${order.orderId}` } as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={styles.rowMain}>
        <Text style={[styles.orderId, { color: colors.onSurface }]}>{order.orderId}</Text>
        <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
          {order.restaurantName} → {order.customerName}
        </Text>
        <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>
          Driver: {order.driverName ?? 'Unassigned'}
        </Text>
      </View>

      <View style={styles.rowEnd}>
        <StatusDot status={order.status} />
        {order.etaMinutes != null && (
          <Text style={[styles.eta, { color: colors.onSurfaceVariant }]}>{order.etaMinutes}m</Text>
        )}
        <Ionicons name="chevron-forward" size={16} color={colors.onSurfaceVariant} />
      </View>
    </Pressable>
  );
}

function StatusDot({ status }: { status: OrderStatus }) {
  const { colors } = useTheme();
  const color =
    status === 'delayed' || status === 'cancelled'
      ? colors.error
      : status === 'delivered'
      ? colors.success
      : colors.primaryContainer;

  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xl, paddingHorizontal: Spacing.gutter, gap: Spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  rowMain: { flex: 1, gap: 2 },
  rowEnd: { alignItems: 'flex-end', gap: 4 },
  orderId: { fontFamily: FontFamily.heading, fontSize: 14, fontWeight: '700' },
  subtle: { fontFamily: FontFamily.body, fontSize: 12 },
  eta: { fontFamily: FontFamily.body, fontSize: 11, fontWeight: '600' },
  dot: { width: 8, height: 8, borderRadius: Radius.full },
});