/**
 * app/ops/orders/index.tsx
 *
 * Full order management — unlike Active Orders (reached from Home), this
 * shows every status so ops can look up and manage any order regardless
 * of where it is in its lifecycle. Status filter chips narrow the list
 * client-side (same caveat as Active Orders: no confirmed `?status=`
 * query param, so this fetches a page and filters in memory — see
 * services/adminOrdersApi.ts).
 *
 * Tapping a row goes to the same app/order/[orderId].tsx detail screen
 * Active Orders uses, so every management action (Change Status, Assign
 * Rider, Cancel Order, etc.) lives in one place rather than being
 * duplicated per entry point.
 */

import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ScreenWrapper from "@/components/ScreenWrapper";
import { Skeleton } from "@/components/Skeleton";
import { FontFamily, Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  AdminOrdersApiError,
  AdminOrderSummary,
  fetchAdminOrders,
} from "@/services/adminOrdersApi";
import { ORDER_STATUS_LABEL } from "@/types/dashboard";

const LOG_TAG = "[OpsOrders]";

// All statuses observed in a real captured response, plus "All". More may
// exist server-side that just haven't shown up in a sample yet — an
// unlisted status still renders fine (falls back to the raw string), it
// just won't get its own filter chip until added here.
const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "payment_pending", label: "Payment Pending" },
  { key: "awaiting_payment_method", label: "Awaiting Payment" },
  { key: "payment_initialization_failed", label: "Payment Failed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function OpsOrdersScreen() {
  const { colors } = useTheme();
  const { tokens } = useAuth();
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(
    async (isRefresh = false) => {
      if (!tokens?.accessToken) return;
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      try {
        const page = await fetchAdminOrders(tokens.accessToken, {
          limit: 100,
          offset: 0,
        });
        console.log(
          `${LOG_TAG} ✅ ${page.results.length} of ${page.count} total orders`,
        );
        setOrders(page.results);
      } catch (err) {
        const message =
          err instanceof AdminOrdersApiError
            ? err.message
            : "Failed to load orders";
        console.error(`${LOG_TAG} ❌`, message);
        setError(message);
      } finally {
        isRefresh ? setRefreshing(false) : setLoading(false);
      }
    },
    [tokens?.accessToken],
  );

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      statusFilter === "all"
        ? orders
        : orders.filter((o) => o.status === statusFilter),
    [orders, statusFilter],
  );

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: "Orders" }} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {STATUS_FILTERS.map((f) => {
          const active = statusFilter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setStatusFilter(f.key)}
              style={[
                styles.filterChip,
                {
                  borderColor: colors.borderSubtle,
                  backgroundColor: colors.surfaceContainer,
                },
                active && {
                  backgroundColor: colors.primaryContainer,
                  borderColor: colors.primaryContainer,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: active
                      ? colors.onPrimaryContainer
                      : colors.onSurfaceVariant,
                  },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={styles.content}>
          {Array.from({ length: 8 }).map((_, i) => (
            <OrderRowSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.content}
          renderItem={({ item }) => <OrderRow order={item} />}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
            />
          }
          ListEmptyComponent={
            <Text
              style={[styles.emptyText, { color: colors.onSurfaceVariant }]}
            >
              {error ?? "No orders match this filter."}
            </Text>
          }
        />
      )}
    </ScreenWrapper>
  );
}

function OrderRow({ order }: { order: AdminOrderSummary }) {
  const { colors } = useTheme();

  const handlePress = () => {
    console.log(`${LOG_TAG} 📦➡️ opening order #${order.id}`, order);
    router.push({
      pathname: "users/order/[orderId]",
      params: {
        orderId: String(order.id),
        branchName: order.branch_name,
        ordererName: order.orderer_name ?? "",
        driverName: order.driver_name ?? "",
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
        {
          backgroundColor: colors.surfaceContainer,
          borderColor: colors.borderSubtle,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.rowMain}>
        <Text style={[styles.orderId, { color: colors.onSurface }]}>
          Order #{order.id}
        </Text>
        <Text
          style={[styles.subtle, { color: colors.onSurfaceVariant }]}
          numberOfLines={1}
        >
          {order.branch_name}
          {order.orderer_name ? ` • ${order.orderer_name}` : ""}
        </Text>
        {!!order.driver_name && (
          <Text
            style={[styles.subtle, { color: colors.onSurfaceVariant }]}
            numberOfLines={1}
          >
            Driver: {order.driver_name}
          </Text>
        )}
      </View>

      <View style={styles.rowEnd}>
        <StatusPill status={order.status} colors={colors} />
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.onSurfaceVariant}
        />
      </View>
    </Pressable>
  );
}

function StatusPill({
  status,
  colors,
}: {
  status: string;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const label = ORDER_STATUS_LABEL[status] ?? status;
  const fg =
    status === "cancelled" || status === "payment_initialization_failed"
      ? colors.error
      : status === "delivered" || status === "ready"
        ? colors.success
        : colors.primaryContainer;
  return (
    <View style={[styles.pill, { backgroundColor: fg + "22" }]}>
      <Text style={[styles.pillText, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function OrderRowSkeleton() {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.surfaceContainer,
          borderColor: colors.borderSubtle,
          marginBottom: Spacing.sm,
        },
      ]}
    >
      <View style={styles.rowMain}>
        <Skeleton width={90} height={14} />
        <Skeleton width={160} height={11} style={{ marginTop: 6 }} />
      </View>
      <Skeleton width={70} height={20} borderRadius={Radius.full} />
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.gutter,
    paddingVertical: Spacing.sm,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  filterChipText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.gutter,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  rowMain: { flex: 1, gap: 2 },
  rowEnd: { alignItems: "flex-end", gap: 6 },
  orderId: { fontFamily: FontFamily.heading, fontSize: 14, fontWeight: "700" },
  subtle: { fontFamily: FontFamily.body, fontSize: 12 },
  pill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    maxWidth: 140,
  },
  pillText: { fontFamily: FontFamily.body, fontSize: 10, fontWeight: "700" },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
});
