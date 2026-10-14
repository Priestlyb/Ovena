/**
 * app/(tabs)/index.tsx
 *
 * Home screen. Layout order:
 *   Header (topbar + greeting)
 *   StatsScrollStrip  (10 metrics, horizontal scroll)
 *   CouponWheelBanner (now includes Coupon Manager + Assign Spinwheel
 *     as glass buttons inside the banner — QuickActions row removed)
 *   LiveMapCard  (placeholder map + "view all active orders")
 *   LiveLogistics
 *   PanicProtocol
 */

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import ScreenWrapper                        from '@/components/ScreenWrapper';
import { Header }                           from '@/components/home/Header';
import { StatsScrollStrip, StatCardData }   from '@/components/home/StatsScrollStrip';
import { CouponWheelBanner }                from '@/components/home/CouponWheelBanner';
import { LiveMapCard }                      from '@/components/home/LiveMapCard';
import { LiveLogistics, LogisticsItem }     from '@/components/home/LiveLogistics';
import { PanicProtocol }                    from '@/components/home/PanicProtocol';
import { useTheme }                         from '@/context/ThemeContext';
import { Spacing }                          from '@/constants/theme';
import { MOCK_MAP_MARKERS }                 from '@/data/mockDashboard';

const LOGISTICS: LogisticsItem[] = [
  {
    id:          '4402',
    type:        'rider',
    name:        'Rider ID #4402',
    subtitle:    "Active Delivery • McDonald's",
    eta:         '8m',
    stk:         120,
    leftBorder:  'lava',
  },
  {
    id:          'pasta',
    type:        'store',
    name:        'Store: Pasta Palace',
    subtitle:    'Order Prep Overload',
    delay:       '15m',
    stk:         85,
    leftBorder:  'error',
  },
  {
    id:          'sarah',
    type:        'client',
    name:        'Client: Sarah J.',
    subtitle:    'Support Request Pending',
    leftBorder:  'none',
  },
];

// ⚠️ UNVERIFIED: values are mock/display-formatted until the real
// dashboard-summary endpoint is confirmed.
const STATS: StatCardData[] = [
  { id: 'total-orders',   label: 'Total Orders Today',   value: '312',      icon: 'receipt-outline',          delta: '+12%', deltaPositive: true },
  { id: 'in-progress',    label: 'Orders In Progress',   value: '124',      icon: 'sync-outline',              accent: 'lava' },
  { id: 'completed',      label: 'Completed Orders',     value: '178',      icon: 'checkmark-circle-outline',  accent: 'success' },
  { id: 'cancelled',      label: 'Cancelled Orders',     value: '10',       icon: 'close-circle-outline',      accent: 'error', delta: '-2%', deltaPositive: false },
  { id: 'revenue',        label: 'Total Revenue Today',  value: '₦1.82M',   icon: 'cash-outline',              accent: 'lava' },
  { id: 'delivery-fees',  label: 'Delivery Fees Earned', value: '₦248K',    icon: 'bicycle-outline' },
  { id: 'service-fees',   label: 'Service Fees Earned',  value: '₦96K',     icon: 'construct-outline' },
  { id: 'commissions',    label: 'Restaurant Commissions', value: '₦412K',  icon: 'storefront-outline' },
  { id: 'active-riders',  label: 'Active Riders',        value: '47',       icon: 'people-outline' },
  { id: 'online-restaurants', label: 'Online Restaurants', value: '63',     icon: 'restaurant-outline' },
];

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <ScreenWrapper noPadding>
      <Header
        adminName="Smith"
        avatarUri="https://lh3.googleusercontent.com/aida-public/AB6AXuClnpuEkERs3otQ5_fyuuajmhWVukNk_qf5tdVUzM4GwH9X8mXMnQ8Bxf2uX0ISNLp6uMdN7GX7jD_mTMPkF61a2KnsUps7qjJpCzsvFj9xCSAbOIgyb3-jPPfaZ-wuPbvVGB7JZt9Pws3F1d3epAjUUMmYE13YLBraJ35RM1Ptyumlf1EMXVZ9Z89si3LOOnwSKoMn_DuVCCGF6AzPpqqXo5EpUStiKOXh5EIsKtmZPFYMFkBcVsuFCALw4C1mNhJuZQUobrzKQATy"
        onNotificationPress={() => console.log('notifications')}
        onAvatarPress={() => router.push('/profile')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <StatsScrollStrip stats={STATS} />

        {/* Promotion Engine — actions now live inside the banner */}
        <CouponWheelBanner
          onCouponManager={()   => router.push('/coupons')}
          onAssignSpinwheel={() => router.push('/spinwheel')}
        />

        {/* Live map of active deliveries */}
        <LiveMapCard markers={MOCK_MAP_MARKERS} />

        {/* Live Logistics */}
        <LiveLogistics items={LOGISTICS} />

        {/* Panic Protocol */}
        <View style={styles.panicSection}>
          <PanicProtocol onActivate={() => console.log('panic')} />
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
    gap:           Spacing.lg,
    paddingBottom: Spacing.md,
  },
  panicSection: {
    marginTop: Spacing.lg,
  },
});