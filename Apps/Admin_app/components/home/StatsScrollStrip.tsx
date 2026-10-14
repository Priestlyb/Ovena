/**
 * components/home/StatsScrollStrip.tsx
 *
 * Horizontal-scrolling strip of compact stat cards for the admin home
 * screen.
 *
 * `loading` renders skeleton placeholder cards (same dimensions as real
 * cards) instead of mapping `stats` — used for the window before the WS
 * `dashboard` snapshot has arrived (see app/(tabs)/index.tsx).
 *
 * ⚠️ UNVERIFIED: `StatCardData.value` is a pre-formatted display string
 * (e.g. "₦482,300", "124", "+12%") since we don't yet know whether the
 * backend returns raw numbers or formatted strings for revenue fields.
 * Format at the call site until the API contract is confirmed.
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeContext';
import { Skeleton } from '@/components/Skeleton';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

export type StatAccent = 'default' | 'lava' | 'success' | 'error';

export interface StatCardData {
  id: string;
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent?: StatAccent;
  delta?: string;
  deltaPositive?: boolean;
}

interface StatsScrollStripProps {
  stats: StatCardData[];
  /** Shows skeleton cards instead of `stats` — e.g. before the first WS dashboard snapshot arrives. */
  loading?: boolean;
  /** How many skeleton cards to show while loading. Defaults to 5. */
  skeletonCount?: number;
}

export function StatsScrollStrip({ stats, loading, skeletonCount = 5 }: StatsScrollStripProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => <StatCardSkeleton key={i} />)
        : stats.map((stat) => <StatCard key={stat.id} stat={stat} />)}
    </ScrollView>
  );
}

function StatCard({ stat }: { stat: StatCardData }) {
  const { colors } = useTheme();
  const accentColor = getAccentColor(colors, stat.accent);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconWrap, { backgroundColor: accentColor + '22' }]}>
          <Ionicons name={stat.icon} size={14} color={accentColor} />
        </View>
        {stat.delta ? (
          <Text
            style={[
              styles.delta,
              { color: stat.deltaPositive ? colors.success : colors.error },
            ]}
          >
            {stat.delta}
          </Text>
        ) : null}
      </View>

      <Text style={[styles.value, { color: colors.onSurface }]} numberOfLines={1}>
        {stat.value}
      </Text>
      <Text style={[styles.label, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
        {stat.label}
      </Text>
    </View>
  );
}

function StatCardSkeleton() {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle },
      ]}
    >
      <View style={styles.cardHeader}>
        <Skeleton width={22} height={22} borderRadius={Radius.full} />
      </View>
      <Skeleton width={48} height={16} style={{ marginTop: 4 }} />
      <Skeleton width={72} height={11} style={{ marginTop: 4 }} />
    </View>
  );
}

function getAccentColor(
  colors: ReturnType<typeof useTheme>['colors'],
  accent?: StatAccent
) {
  switch (accent) {
    case 'lava':
      return colors.primaryContainer;
    case 'success':
      return colors.success;
    case 'error':
      return colors.error;
    default:
      return colors.onSurfaceVariant;
  }
}

const CARD_WIDTH = 108;

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.gutter,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.sm,
    gap: 4,
    paddingHorizontal: Spacing.gutter,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delta: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    fontWeight: '600',
  },
  value: {
    fontFamily: FontFamily.heading,
    fontSize: 16,
    fontWeight: '700',
  },
  label: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 13,
  },
});