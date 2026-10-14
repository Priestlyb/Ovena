/**
 * app/(tabs)/ops.tsx
 *
 * Operations tab landing screen. Three sections: Promotions, Push
 * Notifications, Banner Manager — each a card linking into app/ops/.
 */

import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { MOCK_BANNERS } from '@/data/mockOps';

export default function OpsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const activeBanners = MOCK_BANNERS.filter((b) => b.status === 'active').length;

  return (
    <ScreenWrapper noPadding>
      <View
        style={[
          styles.topBar,
          { paddingTop: insets.top, backgroundColor: colors.surfaceContainerLowest, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.topBarTitle, { color: colors.primaryContainer }]}>Operations</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <OpsCard
          icon="pricetag-outline"
          title="Promotions"
          subtitle="Coupons, referral bonuses, discounts & happy hour"
          onPress={() => router.push('/ops/promotions/create' as any)}
          colors={colors}
          accent="lava"
        />

        <OpsCard
          icon="notifications-outline"
          title="Push Notifications"
          subtitle="Send to everyone, customers, restaurants, or riders"
          onPress={() => router.push('/ops/notifications/send' as any)}
          colors={colors}
        />

        <OpsCard
          icon="images-outline"
          title="Banner Manager"
          subtitle={`${activeBanners} active · upload, enable, disable, schedule`}
          onPress={() => router.push('/ops/banners' as any)}
          colors={colors}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

function OpsCard({
  icon, title, subtitle, onPress, colors, accent,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
  accent?: 'lava';
}) {
  const iconColor = accent === 'lava' ? colors.primaryContainer : colors.onSurfaceVariant;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconColor + '22' }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.cardMain}>
        <Text style={[styles.cardTitle, { color: colors.onSurface }]}>{title}</Text>
        <Text style={[styles.cardSubtitle, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceVariant} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    minHeight: 64, justifyContent: 'flex-end', paddingHorizontal: Spacing.gutter,
    paddingBottom: Spacing.sm, borderBottomWidth: 1,
  },
  topBarTitle: { fontFamily: FontFamily.heading, fontSize: 24, fontWeight: '700', letterSpacing: -0.4 },
  content: { padding: Spacing.gutter, gap: Spacing.md },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md,
  },
  iconWrap: {
    width: 48, height: 48, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  cardMain: { flex: 1, gap: 2 },
  cardTitle: { fontFamily: FontFamily.heading, fontSize: 16, fontWeight: '700' },
  cardSubtitle: { fontFamily: FontFamily.body, fontSize: 12, lineHeight: 16 },
});