/**
 * app/orders/active.tsx
 *
 * Full list of active orders — backed by GET /api/admin/orders/
 * (services/adminOrdersApi.ts), filtered client-side to
 * ACTIVE_ORDER_STATUSES (types/dashboard.ts): pending, payment_pending,
 * ready, payment_initialization_failed, preparing.
 *
 * ⚠️ FIX: pathname corrected to '/users/order/[orderId]' — the detail
 * screen's real location, confirmed from a crash stack trace. An earlier
 * version pointed at '/order/[orderId]' based on an unverified header
 * comment in that file.
 */

import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import ScreenWrapper from '@/components/ScreenWrapper';
import { Skeleton } from '@/components/Skeleton';
import { FontFamily, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import {
  AdminOrderSummary,
  AdminOrdersApiError,
  fetchAdminOrders,
} from '@/services/adminOrdersApi';
import { ACTIVE_ORDER_STATUSES, ORDER_STATUS_LABEL } from '@/types/dashboard';

const LOG_TAG = '[ActiveOrders]';

export default function ActiveOrdersScreen() {
  const { colors } = useTheme();
  const { tokens } = useAuth();
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (!tokens?.accessToken) return;
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const page = await fetchAdminOrders(tokens.accessToken, { limit: 100, offset: 0 });
      const active = page.results.filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status));
      console.log(`${LOG_TAG} ✅ ${active.length} active of ${page.results.length} fetched`);
      setOrders(active);
    } catch (err) {
      const message = err instanceof AdminOrdersApiError ? err.message : 'Failed to load orders';
      console.error(`${LOG_TAG} ❌`, message);
      setError(message);
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }, [tokens?.accessToken]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <ScreenWrapper>
        <Stack.Screen options={{ title: 'Active Orders' }} />
        <View style={styles.content}>
          {Array.from({ length: 6 }).map((_, i) => <OrderRowSkeleton key={i} />)}
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: 'Active Orders' }} />
      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => <OrderRow order={item} />}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
            {error ?? 'No active orders right now.'}
          </Text>
        }
      />
    </ScreenWrapper>
  );
}

function OrderRow({ order }: { order: AdminOrderSummary }) {
  const { colors } = useTheme();

  const handlePress = () => {
    console.log(`${LOG_TAG} 📦➡️ opening order #${order.id}`, order);
    router.push({
      pathname: '/users/order/[orderId]',
      params: {
        orderId: String(order.id),
        branchName: order.branch_name,
        ordererName: order.orderer_name ?? '',
        driverName: order.driver_name ?? '',
        status: order.status,
        subtotal: order.subtotal,
        grandTotal: order.grand_total,
      },
    } as any);
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
        <Text style={[styles.orderId, { color: colors.onSurface }]}>Order #{order.id}</Text>
        <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
          {order.branch_name}{order.orderer_name ? ` • ${order.orderer_name}` : ''}
        </Text>
      </View>

      <View style={styles.rowEnd}>
        <StatusPill status={order.status} colors={colors} />
        <Ionicons name="chevron-forward" size={16} color={colors.onSurfaceVariant} />
      </View>
    </Pressable>
  );
}

function StatusPill({ status, colors }: { status: string; colors: ReturnType<typeof useTheme>['colors'] }) {
  const label = ORDER_STATUS_LABEL[status] ?? status;
  const fg =
    status === 'payment_initialization_failed' ? colors.error :
    status === 'ready' ? colors.success :
    colors.primaryContainer;
  return (
    <View style={[styles.pill, { backgroundColor: fg + '22' }]}>
      <Text style={[styles.pillText, { color: fg }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function OrderRowSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle, marginBottom: Spacing.sm }]}>
      <View style={styles.rowMain}>
        <Skeleton width={90} height={14} />
        <Skeleton width={160} height={11} style={{ marginTop: 6 }} />
      </View>
      <Skeleton width={70} height={20} borderRadius={Radius.full} />
    </View>
  );
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
  rowEnd: { alignItems: 'flex-end', gap: 6 },
  orderId: { fontFamily: FontFamily.heading, fontSize: 14, fontWeight: '700' },
  subtle: { fontFamily: FontFamily.body, fontSize: 12 },
  pill: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full, maxWidth: 150 },
  pillText: { fontFamily: FontFamily.body, fontSize: 10, fontWeight: '700' },
  emptyText: { fontFamily: FontFamily.body, fontSize: 13, textAlign: 'center', marginTop: Spacing.xl },
});