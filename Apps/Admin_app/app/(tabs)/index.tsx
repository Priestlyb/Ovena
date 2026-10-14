/**
 * app/(tabs)/index.tsx
 *
 * Home screen. Layout order:
 *   Header (topbar + greeting) — bell icon now opens /notifications
 *   StatsScrollStrip  (built from the real WS `dashboard` snapshot — see
 *     buildStatsFromDashboard below — not mock data)
 *   Actions box        (Coupon Manager, Assign Spinwheel, Active Orders)
 *   LiveLogistics
 *   PanicProtocol
 *
 * Notification toasts do NOT live in this file — NotificationToast is
 * mounted once at the app root (app/_layout.tsx) so it shows on every
 * screen, positioned below the status bar via safe-area insets.
 *
 * ⚠️ STATS: the old mock array is gone — only what's confirmed in the
 * `dashboard` WS payload is shown:
 *   { active_by_status: { [status]: count, ... }, stuck_orders_count,
 *     payment_failure_count, cancelled_today_count, generated_at }
 * One dynamic card per status key PRESENT in active_by_status (a status
 * with zero active orders doesn't appear as a key), plus a total and the
 * three standalone counts. StatsScrollStrip shows skeletons until the
 * first snapshot arrives.
 */

import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import ScreenWrapper from "@/components/ScreenWrapper";
import { CouponWheelBanner } from "@/components/home/CouponWheelBanner";
import { Header } from "@/components/home/Header";
import { LiveLogistics, LogisticsItem } from "@/components/home/LiveLogistics";
import { PanicProtocol } from "@/components/home/PanicProtocol";
import {
  StatCardData,
  StatsScrollStrip,
} from "@/components/home/StatsScrollStrip";
import { Spacing } from "@/constants/theme";
import { useAdminOrdersWS } from "@/context/AdminOrdersWebSocketContext";
import { DashboardSnapshot } from "@/hooks/useAdminOrdersWebSocket";
import { ORDER_STATUS_LABEL } from "@/types/dashboard";

const LOGISTICS: LogisticsItem[] = [
  {
    id: "4402",
    type: "rider",
    name: "Rider ID #4402",
    subtitle: "Active Delivery • McDonald's",
    eta: "8m",
    stk: 120,
    leftBorder: "lava",
  },
  {
    id: "pasta",
    type: "store",
    name: "Store: Pasta Palace",
    subtitle: "Order Prep Overload",
    delay: "15m",
    stk: 85,
    leftBorder: "error",
  },
  {
    id: "sarah",
    type: "client",
    name: "Client: Sarah J.",
    subtitle: "Support Request Pending",
    leftBorder: "none",
  },
];

function buildStatsFromDashboard(dashboard: DashboardSnapshot): StatCardData[] {
  const totalActive = Object.values(dashboard.active_by_status).reduce(
    (sum, n) => sum + n,
    0,
  );

  const stats: StatCardData[] = [
    {
      id: "total-active",
      label: "Total Active Orders",
      value: String(totalActive),
      icon: "receipt-outline",
      accent: "lava",
    },
  ];

  Object.entries(dashboard.active_by_status).forEach(([status, count]) => {
    stats.push({
      id: `active-${status}`,
      label: ORDER_STATUS_LABEL[status] ?? status,
      value: String(count),
      icon: "sync-outline",
    });
  });

  stats.push({
    id: "stuck-orders",
    label: "Stuck Orders",
    value: String(dashboard.stuck_orders_count),
    icon: "alert-circle-outline",
    accent: dashboard.stuck_orders_count > 0 ? "error" : "default",
  });

  stats.push({
    id: "payment-failures",
    label: "Payment Failures",
    value: String(dashboard.payment_failure_count),
    icon: "card-outline",
    accent: dashboard.payment_failure_count > 0 ? "error" : "default",
  });

  stats.push({
    id: "cancelled-today",
    label: "Cancelled Today",
    value: String(dashboard.cancelled_today_count),
    icon: "close-circle-outline",
    accent: dashboard.cancelled_today_count > 0 ? "error" : "default",
  });

  return stats;
}

export default function HomeScreen() {
  const { dashboard } = useAdminOrdersWS();

  const statsLoading = dashboard === null;
  const stats = dashboard ? buildStatsFromDashboard(dashboard) : [];

  return (
    <ScreenWrapper noPadding>
      <Header
        adminName="Smith"
        avatarUri="https://lh3.googleusercontent.com/aida-public/AB6AXuClnpuEkERs3otQ5_fyuuajmhWVukNk_qf5tdVUzM4GwH9X8mXMnQ8Bxf2uX0ISNLp6uMdN7GX7jD_mTMPkF61a2KnsUps7qjJpCzsvFj9xCSAbOIgyb3-jPPfaZ-wuPbvVGB7JZt9Pws3F1d3epAjUUMmYE13YLBraJ35RM1Ptyumlf1EMXVZ9Z89si3LOOnwSKoMn_DuVCCGF6AzPpqqXo5EpUStiKOXh5EIsKtmZPFYMFkBcVsuFCALw4C1mNhJuZQUobrzKQATy"
        onNotificationPress={() => router.push("/notifications" as any)}
        onAvatarPress={() => router.push("/profile")}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StatsScrollStrip stats={stats} loading={statsLoading} />

        <CouponWheelBanner
          onCouponManager={() => router.push("/coupons")}
          onAssignSpinwheel={() => router.push("/spinwheel")}
          onActiveOrders={() => router.push("/orders/active")}
        />

        <LiveLogistics items={LOGISTICS} />

        <View style={styles.panicSection}>
          <PanicProtocol onActivate={() => console.log("panic")} />
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  panicSection: {
    marginTop: Spacing.lg,
  },
});