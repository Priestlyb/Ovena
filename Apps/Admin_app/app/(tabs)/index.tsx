/**
 * app/(tabs)/index.tsx
 *
 * Home screen. Layout order mirrors the HTML exactly:
 *   Header (topbar + greeting)
 *   StatsRow
 *   CouponWheelBanner + QuickActions  (single "Promotion Engine" section in HTML)
 *   LiveLogistics
 *   PanicProtocol
 *
 * Mock data matches the HTML exactly:
 *   - Rider #4402  → ETA 8m  → lava left border
 *   - Pasta Palace → Delay 15m → error left border
 *   - Sarah J.     → no ETA  → no border
 */

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import ScreenWrapper                        from '@/components/ScreenWrapper';
import { Header }                           from '@/components/home/Header';
import { StatsRow }                         from '@/components/home/StatsRow';
import { CouponWheelBanner }                from '@/components/home/CouponWheelBanner';
import { QuickActions }                     from '@/components/home/QuickActions';
import { LiveLogistics, LogisticsItem }     from '@/components/home/LiveLogistics';
import { PanicProtocol }                    from '@/components/home/PanicProtocol';
import { useTheme }                         from '@/context/ThemeContext';
import { Spacing }                          from '@/constants/theme';

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
        <StatsRow
          activeOrders={124}
          activeOrdersDelta="+12%"
          activeOrdersPositive
          pendingValidation={8}
          pendingDelta="-2%"
          pendingDeltaPositive={false}
        />

        {/* Promotion Engine: banner + quick actions */}
        <View style={styles.section}>
          <CouponWheelBanner onLaunch={() => router.push('/spinwheel')} />
          <QuickActions
            onCouponManager={()    => router.push('/coupons')}
            onAssignSpinwheel={()  => router.push('/spinwheel')}
          />
        </View>

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
  section: {
    gap: Spacing.md,
  },
  panicSection: {
    marginTop: Spacing.lg,
  },
});