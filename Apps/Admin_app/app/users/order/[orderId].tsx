/**
 * app/order/[orderId].tsx
 *
 * Order detail screen. Reached from LiveMapCard markers, LiveLogistics
 * items, and the Active Orders list. Now includes a link to the driver's
 * profile and order-level admin actions (status change, rider assignment,
 * cancellation, contact).
 *
 * Actions are stubbed with console.log, consistent with other unwired
 * actions in this codebase (e.g. PanicProtocol.onActivate) — wire to real
 * endpoints once they exist.
 */

import React, { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { getMockOrderDetail } from '@/data/mockDashboard';
import { OrderStatus } from '@/types/dashboard';

export default function OrderDetailScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { colors } = useTheme();

  const order = useMemo(() => getMockOrderDetail(orderId ?? ''), [orderId]);

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: order.orderId }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View
          style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}
        >
          <View style={styles.rowBetween}>
            <Text style={[styles.orderId, { color: colors.onSurface }]}>{order.orderId}</Text>
            <StatusPill status={order.status} />
          </View>
          <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>
            {order.restaurantName} → {order.customerName}
          </Text>
          {order.etaMinutes != null && (
            <Text style={[styles.eta, { color: colors.primaryContainer }]}>
              ETA {order.etaMinutes}m
            </Text>
          )}
        </View>

        <Section title="Driver" colors={colors}>
          {order.driverName ? (
            <>
              <InfoRow label="Name" value={order.driverName} colors={colors} />
              <InfoRow label="Phone" value={order.driverPhone ?? '—'} colors={colors} />
            </>
          ) : (
            <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>
              Not yet assigned
            </Text>
          )}
        </Section>

        {order.driverId && (
          <Pressable
            onPress={() =>
            
              // ⚠️ ID SCHEME MISMATCH: order.driverId is currently a mock
              // string like 'RDR-4402' (see data/mockDashboard.ts), but
              // this route expects the real numeric admin-users id from
              // GET /api/admin/users/. This link will not resolve to a
              // real user until order data carries that real id — fix
              // the mock/real order data before relying on this in testing.
              router.push({ pathname: '/users/detail/[userId]', params: { userId: order.driverId! } })
            }
            style={[styles.linkRow, { borderColor: colors.borderSubtle, backgroundColor: colors.surfaceContainer }]}
          >
            <Text style={[styles.linkText, { color: colors.primaryContainer }]}>View driver profile</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primaryContainer} />
          </Pressable>
        )}

        <Section title="Delivery" colors={colors}>
          <InfoRow label="Address" value={order.deliveryAddress} colors={colors} />
        </Section>

        <Section title="Items" colors={colors}>
          {order.items.map((item, idx) => (
            <Text key={idx} style={[styles.itemName, { color: colors.onSurface }]}>
              {item.quantity}× {item.name}
            </Text>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <InfoRow label="Subtotal" value={formatNaira(order.subtotal)} colors={colors} />
          <InfoRow label="Delivery fee" value={formatNaira(order.deliveryFee)} colors={colors} />
          <InfoRow label="Service fee" value={formatNaira(order.serviceFee)} colors={colors} />
          <InfoRow label="Total" value={formatNaira(order.total)} colors={colors} bold />
        </Section>

        <Section title="Status History" colors={colors}>
          {order.statusHistory.map((h, idx) => (
            <View key={idx} style={styles.historyRow}>
              <Ionicons name="ellipse" size={8} color={colors.primaryContainer} />
              <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>
                {h.status} — {new Date(h.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))}
        </Section>

        <View style={styles.actionsGrid}>
          <ActionButton
            label="Track Rider"
            icon="navigate-outline"
            onPress={() => console.log('track_rider', order.orderId)}
            colors={colors}
            accent="lava"
          />
          <ActionButton
            label="Change Status"
            icon="swap-horizontal-outline"
            onPress={() => console.log('change_status', order.orderId)}
            colors={colors}
          />
          <ActionButton
            label="Assign Rider"
            icon="person-add-outline"
            onPress={() => console.log('assign_rider', order.orderId)}
            colors={colors}
          />
          <ActionButton
            label="Cancel Order"
            icon="close-circle-outline"
            onPress={() => console.log('cancel_order', order.orderId)}
            colors={colors}
            accent="error"
          />
          <ActionButton
            label="Contact Customer"
            icon="call-outline"
            onPress={() => console.log('contact_customer', order.orderId)}
            colors={colors}
          />
          <ActionButton
            label="Contact Restaurant"
            icon="storefront-outline"
            onPress={() => console.log('contact_restaurant', order.orderId)}
            colors={colors}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

function Section({
  title,
  colors,
  children,
}: {
  title: string;
  colors: ReturnType<typeof useTheme>['colors'];
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
      <Text style={[styles.sectionTitle, { color: colors.onSurfaceVariant }]}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function InfoRow({
  label,
  value,
  colors,
  bold,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>['colors'];
  bold?: boolean;
}) {
  return (
    <View style={styles.rowBetween}>
      <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.onSurface, fontWeight: bold ? '700' : '500' }]}>
        {value}
      </Text>
    </View>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const { colors } = useTheme();
  const { bg, fg, label } = statusStyle(status, colors);
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color: fg }]}>{label}</Text>
    </View>
  );
}

function statusStyle(status: OrderStatus, colors: ReturnType<typeof useTheme>['colors']) {
  switch (status) {
    case 'cancelled':
      return { bg: colors.errorContainer, fg: colors.onErrorContainer, label: 'Cancelled' };
    case 'on_the_way':
      return { bg: colors.primaryContainer + '33', fg: colors.primaryContainer, label: 'On the Way' };
    case 'picked_up':
      return { bg: colors.primaryContainer + '33', fg: colors.primaryContainer, label: 'Picked Up' };
    case 'rider_assigned':
      return { bg: colors.secondaryContainer, fg: colors.onSecondaryContainer, label: 'Rider Assigned' };
    case 'preparing':
      return { bg: colors.secondaryContainer, fg: colors.onSecondaryContainer, label: 'Preparing' };
    case 'restaurant_accepted':
      return { bg: colors.secondaryContainer, fg: colors.onSecondaryContainer, label: 'Restaurant Accepted' };
    case 'delivered':
      return { bg: colors.success + '33', fg: colors.success, label: 'Delivered' };
    default:
      return { bg: colors.secondaryContainer, fg: colors.onSecondaryContainer, label: 'New Order' };
  }
}

function ActionButton({
  label,
  icon,
  onPress,
  colors,
  accent,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
  accent?: 'error' | 'lava';
}) {
  const fg = accent === 'error' ? colors.error : accent === 'lava' ? colors.primaryContainer : colors.onSurface;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionBtn,
        { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Ionicons name={icon} size={18} color={fg} />
      <Text style={[styles.actionLabel, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md, paddingBottom: Spacing.xl, paddingHorizontal: Spacing.gutter },
  card: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, gap: Spacing.xs },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderId: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '700' },
  subtle: { fontFamily: FontFamily.body, fontSize: 12 },
  eta: { fontFamily: FontFamily.body, fontSize: 13, fontWeight: '700' },
  sectionTitle: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionBody: { gap: Spacing.xs },
  itemName: { fontFamily: FontFamily.body, fontSize: 13 },
  infoValue: { fontFamily: FontFamily.body, fontSize: 13 },
  divider: { height: 1, marginVertical: 4 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pill: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  pillText: { fontFamily: FontFamily.body, fontSize: 11, fontWeight: '700' },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.sm,
  },
  linkText: { fontFamily: FontFamily.body, fontSize: 13, fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  actionBtn: {
    flexBasis: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.sm,
  },
  actionLabel: { fontFamily: FontFamily.body, fontSize: 12, fontWeight: '600' },
});