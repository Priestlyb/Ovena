/**
 * app/(tabs)/stats.tsx
 *
 * Analytics / Stats screen.
 *
 * Layout (top → bottom):
 *   TopBar: "Analytics" title + "Q4 PERFORMANCE" tag
 *   Controls row 1: [Dataset dropdown] [Period dropdown]
 *   Controls row 2: Timeline scroller (changes with period)
 *   Chart section (glass card):
 *     - Animated donut chart (open animation + re-animates on data change)
 *     - Segment legend grid
 *   Best Sellers section
 *   Top Venues section
 *
 * Interactivity:
 *   - Changing the period picker updates the timeline labels
 *   - Tapping a timeline item updates the donut chart data
 *   - Chart animates from 0 every time active data changes
 */

import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';

import {
  OPERATIONAL_METRICS,
  TOP_RIDERS,
  TOP_CUSTOMERS,
} from '@/data/opsMetrics';
import { useAppData } from '@/context/AppDataContext';
import {
  TOP_REFERRERS,
  CAMPAIGNS,
  PROMO_EFFECTIVENESS,
  CampaignStatus,
  RESTAURANT_AD_PERFORMANCE
} from '@/data/growthMetrics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper                 from '@/components/ScreenWrapper';
import { DonutChart }                from '@/components/analytics/DonutChart';
import { TimelineScroller }          from '@/components/analytics/TimelineScroller';
import { SegmentLegend }             from '@/components/analytics/SegmentLegend';
import { useTheme }                  from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import {
  DATASETS,
  DATASET_OPTIONS,
  PERIOD_OPTIONS,
  BEST_SELLERS,
  TOP_VENUES,
  DatasetKey,
  TimePeriod,
} from '@/data/analyticsData';

// ─── Inline dropdown (modal-based, no native Picker dependency) ───────────────
interface DropdownProps<T extends string> {
  options:  { key: T; label: string }[];
  value:    T;
  onChange: (v: T) => void;
  label?:   string;
}

function Dropdown<T extends string>({ options, value, onChange, label }: DropdownProps<T>) {
  const { colors, isDark } = useTheme();
  const [open, setOpen] = useState(false);

  const selected = options.find(o => o.key === value);
  const cardBg   = isDark ? '#1c1b20' : colors.surfaceContainerLow;
  const border   = isDark ? 'rgba(255,255,255,0.10)' : colors.border;

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdown, { backgroundColor: cardBg, borderColor: border }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        {label && (
          <Text style={[styles.dropdownLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
        )}
        <Text style={[styles.dropdownValue, { color: colors.onSurface }]}>
          {selected?.label}
        </Text>
        <Ionicons name="chevron-expand" size={14} color={colors.onSurfaceVariant} />
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>
        <View style={[styles.dropdownMenu, { backgroundColor: cardBg, borderColor: border }]}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.dropdownMenuItem,
                opt.key === value && { backgroundColor: `${colors.primaryContainer}20` },
              ]}
              onPress={() => { onChange(opt.key); setOpen(false); }}
            >
              <Text style={[
                styles.dropdownMenuText,
                { color: opt.key === value ? colors.primaryContainer : colors.onSurface },
              ]}>
                {opt.label}
              </Text>
              {opt.key === value && (
                <Ionicons name="checkmark" size={16} color={colors.primaryContainer} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
}

function CampaignStatusPill({ status, colors }: { status: CampaignStatus; colors: ReturnType<typeof useTheme>['colors'] }) {
  const map: Record<CampaignStatus, { bg: string; fg: string; label: string }> = {
    active:    { bg: colors.success + '33', fg: colors.success, label: 'Active' },
    ended:     { bg: colors.secondaryContainer, fg: colors.onSecondaryContainer, label: 'Ended' },
    scheduled: { bg: colors.primaryContainer + '33', fg: colors.primaryContainer, label: 'Scheduled' },
  };
  const s = map[status];
  return (
    <View style={[styles.campaignPill, { backgroundColor: s.bg }]}>
      <Text style={[styles.campaignPillText, { color: s.fg }]}>{s.label}</Text>
    </View>
  );
}

function CampaignStat({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View style={styles.campaignStat}>
      <Text style={[styles.campaignStatValue, { color: colors.onSurface }]} numberOfLines={1}>{value}</Text>
      <Text style={[styles.campaignStatLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function StatsScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { data: appData } = useAppData();
  const coupons = appData?.coupons ?? [];

  const [dataset,     setDataset]     = useState<DatasetKey>('sales');
  const [period,      setPeriod]      = useState<TimePeriod>('months');
  const [activeIndex, setActiveIndex] = useState(7);  // Aug 2023 default

  // When period changes, reset active to the middle
  const handlePeriodChange = useCallback((p: TimePeriod) => {
    setPeriod(p);
    const pts = DATASETS[dataset][p];
    setActiveIndex(Math.floor(pts.length / 2));
  }, [dataset]);

  const handleDatasetChange = useCallback((d: DatasetKey) => {
    setDataset(d);
    const pts = DATASETS[d][period];
    setActiveIndex(Math.floor(pts.length / 2));
  }, [period]);

  const points       = useMemo(() => DATASETS[dataset][period],   [dataset, period]);
  const activePoint  = useMemo(() => points[activeIndex] ?? points[0], [points, activeIndex]);
  // animKey drives TWO animation modes in DonutChart:
  //   Mode A (fan-out from 0): fires when animKey CHANGES → dataset or period switch
  //   Mode B (smooth morph):   fires when animKey stays same → timeline navigation
  // IMPORTANT: do NOT include activeIndex — timeline taps must use Mode B.
  const animKey = `${dataset}_${period}`;

  // Format total
  const formattedTotal = useMemo(() => {
    const v = activePoint.total;
    if (dataset === 'sales') {
      if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`;
      return `$${v}`;
    }
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return `${v}`;
  }, [activePoint, dataset]);

  const cardBg   = isDark ? 'rgba(27,27,30,0.6)' : colors.surfaceContainer;
  const cardBor  = isDark ? 'rgba(255,255,255,0.08)' : colors.border;

  return (
    <ScreenWrapper noPadding>
      {/* ── Top bar ── */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop:        insets.top,
            backgroundColor:   `${colors.surface}CC`,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border,
          },
        ]}
      >
        <Text style={[styles.topBarTitle, { color: colors.primaryContainer }]}>
          Analytics
        </Text>
        <Text style={[styles.topBarSub, { color: colors.onSurfaceVariant }]}>
          Q4 PERFORMANCE
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 88 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Controls row 1: dropdowns ── */}
        <View style={styles.controlsRow}>
          <View style={styles.dropdownWrap}>
            <Dropdown
              options={DATASET_OPTIONS}
              value={dataset}
              onChange={handleDatasetChange}
              label="VIEW"
            />
          </View>
          <View style={styles.dropdownWrap}>
            <Dropdown
              options={PERIOD_OPTIONS}
              value={period}
              onChange={handlePeriodChange}
              label="PERIOD"
            />
          </View>
        </View>

        {/* ── Controls row 2: timeline scroller ── */}
        <TimelineScroller
          points={points}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />

        {/* ── Chart section ── */}
        <View style={[styles.chartCard, { backgroundColor: cardBg, borderColor: cardBor }]}>
          {/* Donut chart — activePeriod rendered inside the chart component */}
          <DonutChart
            segments={activePoint.segments}
            totalLabel={formattedTotal}
            subLabel={dataset === 'sales' ? 'Total Sales' : 'Total Orders'}
            activePeriod={activePoint.label}
            size={260}
            animKey={animKey}
          />

          {/* Legend */}
          <View style={[styles.legendDivider, { backgroundColor: colors.divider }]} />
          <SegmentLegend
            segments={activePoint.segments}
            valuePrefix={dataset === 'sales' ? '$' : ''}
          />
        </View>

        {/* ── Best Sellers ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Most Ordered Foods</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: colors.primaryContainer }]}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>

          {BEST_SELLERS.map((item, i) => (
            <View
              key={item.id}
              style={[
                styles.sellerRow,
                i < BEST_SELLERS.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border,
                },
              ]}
            >
              <View style={[styles.sellerImg, { backgroundColor: colors.surfaceContainerHighest, borderColor: cardBor }]}>
                {item.imageUri ? (
                  <Image source={{ uri: item.imageUri }} style={StyleSheet.absoluteFill} />
                ) : (
                  <Ionicons name="flame" size={28} color={colors.primaryContainer} />
                )}
              </View>
              <View style={styles.sellerInfo}>
                <Text style={[styles.sellerName, { color: colors.onSurface }]}>{item.name}</Text>
                <Text style={[styles.sellerMeta, { color: colors.onSurfaceVariant }]}>
                  {item.orders.toLocaleString()} orders this week
                </Text>
              </View>
              <View style={styles.sellerRight}>
                <Text style={[styles.sellerPrice, { color: colors.onSurface }]}>{item.price}</Text>
                <View style={styles.trendRow}>
                  <Ionicons name="trending-up" size={10} color={colors.primaryContainer} />
                  <Text style={[styles.sellerTrend, { color: colors.primaryContainer }]}>
                    {item.trend}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── Operational Health ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Operational Health</Text>
          </View>
          <View style={styles.metricsGrid}>
            {OPERATIONAL_METRICS.map((m) => {
              const accentColor =
                m.accent === 'success' ? colors.success :
                m.accent === 'error'   ? colors.error :
                m.accent === 'lava'    ? colors.primaryContainer :
                colors.onSurfaceVariant;
              return (
                <View
                  key={m.id}
                  style={[styles.metricCard, { backgroundColor: colors.surfaceContainerHigh, borderColor: cardBor }]}
                >
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricIconWrap, { backgroundColor: accentColor + '22' }]}>
                      <Ionicons name={m.icon as keyof typeof Ionicons.glyphMap} size={14} color={accentColor} />
                    </View>
                    {m.delta && (
                      <Text style={[styles.metricDelta, { color: m.deltaPositive ? colors.success : colors.error }]}>
                        {m.delta}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.metricValue, { color: colors.onSurface }]}>{m.value}</Text>
                  <Text style={[styles.metricLabel, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                    {m.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Top Riders ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Top Riders</Text>
            <Text style={[styles.viewAll, { color: colors.onSurfaceVariant }]}>BY DELIVERIES</Text>
          </View>

          {TOP_RIDERS.map((rider, i) => (
            <View
              key={rider.id}
              style={[
                styles.sellerRow,
                i < TOP_RIDERS.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border,
                },
              ]}
            >
              <View style={[styles.sellerImg, { backgroundColor: colors.surfaceContainerHighest, borderColor: cardBor }]}>
                {rider.imageUri ? (
                  <Image source={{ uri: rider.imageUri }} style={StyleSheet.absoluteFill} />
                ) : (
                  <Ionicons name="bicycle" size={26} color={colors.primaryContainer} />
                )}
              </View>
              <View style={styles.sellerInfo}>
                <Text style={[styles.sellerName, { color: colors.onSurface }]}>{rider.name}</Text>
                <Text style={[styles.sellerMeta, { color: colors.onSurfaceVariant }]}>
                  {rider.deliveries.toLocaleString()} deliveries · ★{rider.rating}
                </Text>
              </View>
              <View style={styles.sellerRight}>
                <View style={styles.trendRow}>
                  <Ionicons name="trending-up" size={10} color={colors.primaryContainer} />
                  <Text style={[styles.sellerTrend, { color: colors.primaryContainer }]}>
                    {rider.trend}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── Top Customers ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Top Customers</Text>
            <Text style={[styles.viewAll, { color: colors.onSurfaceVariant }]}>BY SPEND</Text>
          </View>

          {TOP_CUSTOMERS.map((customer, i) => (
            <View
              key={customer.id}
              style={[
                styles.sellerRow,
                i < TOP_CUSTOMERS.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border,
                },
              ]}
            >
              <View style={[styles.sellerImg, { backgroundColor: colors.surfaceContainerHighest, borderColor: cardBor }]}>
                {customer.imageUri ? (
                  <Image source={{ uri: customer.imageUri }} style={StyleSheet.absoluteFill} />
                ) : (
                  <Ionicons name="person" size={26} color={colors.primaryContainer} />
                )}
              </View>
              <View style={styles.sellerInfo}>
                <Text style={[styles.sellerName, { color: colors.onSurface }]}>{customer.name}</Text>
                <Text style={[styles.sellerMeta, { color: colors.onSurfaceVariant }]}>
                  {customer.orders} orders
                </Text>
              </View>
              <View style={styles.sellerRight}>
                <Text style={[styles.sellerPrice, { color: colors.onSurface }]}>{customer.totalSpent}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Referral Leaderboard ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Referral Leaderboard</Text>
            <Text style={[styles.viewAll, { color: colors.onSurfaceVariant }]}>TOP REFERRERS</Text>
          </View>

          {TOP_REFERRERS.map((r, i) => (
            <View
              key={r.id}
              style={[
                styles.sellerRow,
                i < TOP_REFERRERS.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border,
                },
              ]}
            >
              <View style={[styles.sellerImg, { backgroundColor: colors.surfaceContainerHighest, borderColor: cardBor }]}>
                <Ionicons name="gift" size={26} color={colors.primaryContainer} />
              </View>
              <View style={styles.sellerInfo}>
                <Text style={[styles.sellerName, { color: colors.onSurface }]}>{r.name}</Text>
                <Text style={[styles.sellerMeta, { color: colors.onSurfaceVariant }]}>
                  {r.referralCount} referrals
                </Text>
              </View>
              <View style={styles.sellerRight}>
                <Text style={[styles.sellerPrice, { color: colors.onSurface }]}>{r.rewardEarned}</Text>
                <View style={styles.trendRow}>
                  <Ionicons name="trending-up" size={10} color={colors.primaryContainer} />
                  <Text style={[styles.sellerTrend, { color: colors.primaryContainer }]}>{r.trend}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── Campaign Performance ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Campaign Performance</Text>
          </View>

          {CAMPAIGNS.map((c) => (
            <View
              key={c.id}
              style={[styles.campaignCard, { backgroundColor: colors.surfaceContainerHigh, borderColor: cardBor }]}
            >
              <View style={styles.rowBetween}>
                <Text style={[styles.campaignName, { color: colors.onSurface }]} numberOfLines={1}>
                  {c.name}
                </Text>
                <CampaignStatusPill status={c.status} colors={colors} />
              </View>
              <View style={styles.campaignStatsRow}>
                <CampaignStat label="Reach" value={c.reach.toLocaleString()} colors={colors} />
                <CampaignStat label="Conversions" value={c.conversions.toLocaleString()} colors={colors} />
                <CampaignStat label="Rate" value={c.conversionRate} colors={colors} />
                <CampaignStat label="Revenue" value={c.revenue} colors={colors} />
              </View>
            </View>
          ))}
        </View>

        {/* ── Coupon Usage — REAL DATA from useAppData().coupons ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Coupon Usage</Text>
            <Text style={[styles.viewAll, { color: colors.onSurfaceVariant }]}>{coupons.length} TOTAL</Text>
          </View>

          {coupons.length === 0 ? (
            <Text style={[styles.emptyCouponText, { color: colors.onSurfaceVariant }]}>
              No coupons found.
            </Text>
          ) : (
            coupons.slice(0, 8).map((coupon, i) => {
              const usagePct = coupon.max_uses > 0
                ? Math.min(100, Math.round((coupon.uses_count / coupon.max_uses) * 100))
                : 0;
              return (
                <View
                  key={coupon.id}
                  style={[
                    styles.couponRow,
                    i < Math.min(coupons.length, 8) - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border,
                    },
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <Text style={[styles.couponCode, { color: colors.onSurface }]} numberOfLines={1}>
                      {coupon.code}
                    </Text>
                    <Text style={[styles.couponMeta, { color: colors.onSurfaceVariant }]}>
                      {coupon.uses_count}/{coupon.max_uses}
                    </Text>
                  </View>
                  <Text style={[styles.couponDesc, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                    {coupon.description || 'No description'}
                  </Text>
                  <View style={[styles.progressTrack, { backgroundColor: colors.surfaceContainerHighest }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${usagePct}%`,
                          backgroundColor: coupon.exhausted ? colors.error : colors.primaryContainer,
                        },
                      ]}
                    />
                  </View>
                  {coupon.exhausted && (
                    <Text style={[styles.exhaustedLabel, { color: colors.error }]}>Exhausted</Text>
                  )}
                </View>
              );
            })
          )}
        </View>

        {/* ── Promo Effectiveness ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Promo Effectiveness</Text>
          </View>
          <View style={styles.metricsGrid}>
            {PROMO_EFFECTIVENESS.map((m) => {
              const accentColor =
                m.accent === 'success' ? colors.success :
                m.accent === 'error'   ? colors.error :
                m.accent === 'lava'    ? colors.primaryContainer :
                colors.onSurfaceVariant;
              return (
                <View
                  key={m.id}
                  style={[styles.metricCard, { backgroundColor: colors.surfaceContainerHigh, borderColor: cardBor }]}
                >
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricIconWrap, { backgroundColor: accentColor + '22' }]}>
                      <Ionicons name={m.icon as keyof typeof Ionicons.glyphMap} size={14} color={accentColor} />
                    </View>
                    {m.delta && (
                      <Text style={[styles.metricDelta, { color: m.deltaPositive ? colors.success : colors.error }]}>
                        {m.delta}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.metricValue, { color: colors.onSurface }]}>{m.value}</Text>
                  <Text style={[styles.metricLabel, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                    {m.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Restaurant Ad Performance ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Restaurant Ad Performance</Text>
            <Text style={[styles.viewAll, { color: colors.onSurfaceVariant }]}>CTR & ORDERS</Text>
          </View>

          {RESTAURANT_AD_PERFORMANCE.map((r, i) => (
            <View
              key={r.id}
              style={[
                styles.sellerRow,
                i < RESTAURANT_AD_PERFORMANCE.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border,
                },
              ]}
            >
              <View style={[styles.sellerImg, { backgroundColor: colors.surfaceContainerHighest, borderColor: cardBor }]}>
                <Ionicons name="megaphone" size={24} color={colors.primaryContainer} />
              </View>
              <View style={styles.sellerInfo}>
                <Text style={[styles.sellerName, { color: colors.onSurface }]}>{r.restaurantName}</Text>
                <Text style={[styles.sellerMeta, { color: colors.onSurfaceVariant }]}>
                  {r.impressions.toLocaleString()} impressions · {r.clicks.toLocaleString()} clicks
                </Text>
              </View>
              <View style={styles.sellerRight}>
                <Text style={[styles.sellerPrice, { color: colors.onSurface }]}>{r.ctr}</Text>
                <Text style={[styles.adOrders, { color: colors.onSurfaceVariant }]}>
                  {r.ordersGenerated} orders
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Top Restaurants ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBor }]}>
          <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Top Restaurants</Text>      
       <Text style={[styles.viewAll, { color: colors.onSurfaceVariant }]}>MOST VISITED</Text>
          </View>
          <View style={styles.venuesRow}>
            {TOP_VENUES.map(venue => (
              <View key={venue.id} style={styles.venueItem}>
                <View style={[styles.venueImg, { borderColor: cardBor }]}>
                  <Image
                    source={{ uri: venue.imageUri }}
                    style={[StyleSheet.absoluteFill, styles.venueImgStyle]}
                  />
                </View>
                <Text style={[styles.venueName, { color: colors.onSurface }]} numberOfLines={1}>
                  {venue.name}
                </Text>
                <Text style={[styles.venueVisitors, { color: colors.onSurfaceVariant }]}>
                  {venue.visitors} VISITORS
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection:    'row',
    justifyContent:   'space-between',
    alignItems:       'flex-end',
    paddingHorizontal: Spacing.gutter,
    paddingBottom:    Spacing.sm,
    borderBottomWidth: 1,
    minHeight:        64,
  },
  topBarTitle: {
    fontFamily:    FontFamily.heading,
    fontSize:      28,
    fontWeight:    '700',
    letterSpacing: -0.5,
    lineHeight:    34,
  },
  topBarSub: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom:  4,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.gutter,
    gap:     Spacing.md,
  },

  // Controls
  controlsRow: {
    flexDirection: 'row',
    gap:           Spacing.sm,
  },
  dropdownWrap: {
    flex: 1,
  },
  dropdown: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             6,
    borderRadius:    Radius.xl,
    borderWidth:     1,
    paddingVertical:   10,
    paddingHorizontal: Spacing.md,
  },
  dropdownLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      9,
    fontWeight:    '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dropdownValue: {
    fontFamily: FontFamily.body,
    fontSize:   13,
    fontWeight: '500',
    flex:       1,
  },
  // Dropdown modal
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownMenu: {
    position:     'absolute',
    top:          '25%',
    left:         Spacing.gutter,
    right:        Spacing.gutter,
    borderRadius: Radius.xl,
    borderWidth:  1,
    overflow:     'hidden',
    zIndex:       100,
  },
  dropdownMenuItem: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    paddingVertical:   Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  dropdownMenuText: {
    fontFamily:  FontFamily.body,
    fontSize:    15,
    fontWeight:  '500',
  },

  // Chart card
  chartCard: {
    borderRadius: 28,
    borderWidth:  1,
    padding:      Spacing.lg,
    gap:          Spacing.lg,
    alignItems:   'center',
  },
  activePeriodLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
    alignSelf:     'flex-start',
  },
  legendDivider: {
    height:    1,
    width:     '100%',
    marginVertical: Spacing.xs,
  },

  // Generic card
  card: {
    borderRadius: 24,
    borderWidth:  1,
    padding:      Spacing.lg,
    gap:          Spacing.md,
  },
  cardHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  cardTitle: {
    fontFamily:    FontFamily.heading,
    fontSize:      18,
    fontWeight:    '600',
    letterSpacing: -0.2,
  },
  viewAll: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Best sellers
  sellerRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.md,
    paddingVertical: Spacing.sm,
  },
  sellerImg: {
    width:          56,
    height:         56,
    borderRadius:   Radius.xl,
    borderWidth:    1,
    overflow:       'hidden',
    flexShrink:     0,
    justifyContent: 'center',
    alignItems:     'center',
  },
  sellerInfo: {
    flex: 1,
    gap:  3,
  },
  sellerName: {
    fontFamily:    FontFamily.body,
    fontSize:      15,
    fontWeight:    '600',
    letterSpacing: -0.1,
  },
  sellerMeta: {
    fontFamily: FontFamily.mono,
    fontSize:   10,
    fontWeight: '500',
  },
  sellerRight: {
    alignItems: 'flex-end',
    gap:        3,
  },
  sellerPrice: {
    fontFamily:    FontFamily.mono,
    fontSize:      14,
    fontWeight:    '600',
    letterSpacing: 0.3,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           3,
  },
  sellerTrend: {
    fontFamily:  FontFamily.mono,
    fontSize:    10,
    fontWeight:  '700',
  },

  // Venues
  venuesRow: {
    flexDirection: 'row',
    gap:           Spacing.md,
  },
  venueItem: {
    flex: 1,
    gap:  Spacing.xs,
  },
  venueImg: {
    width:        '100%',
    aspectRatio:  4 / 3,
    borderRadius: Radius.xl,
    borderWidth:  1,
    overflow:     'hidden',
  },
  venueImgStyle: {
    resizeMode: 'cover',
  },
  venueName: {
    fontFamily:    FontFamily.mono,
    fontSize:      12,
    fontWeight:    '700',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  venueVisitors: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  metricCard: {
    flexBasis: '47%',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.sm,
    gap: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricIconWrap: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricDelta: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '600',
  },
  metricValue: {
    fontFamily: FontFamily.heading,
    fontSize: 18,
    fontWeight: '700',
  },
  metricLabel: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 13,
  },

  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },

  // Campaign cards
  campaignCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  campaignName: { fontFamily: FontFamily.heading, fontSize: 14, fontWeight: '700', flex: 1 },
  campaignPill: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full },
  campaignPillText: { fontFamily: FontFamily.body, fontSize: 10, fontWeight: '700' },
  campaignStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  campaignStat: { alignItems: 'flex-start', gap: 2 },
  campaignStatValue: { fontFamily: FontFamily.mono, fontSize: 13, fontWeight: '700' },
  campaignStatLabel: {
    fontFamily: FontFamily.mono, fontSize: 9, fontWeight: '500',
    letterSpacing: 0.5, textTransform: 'uppercase',
  },

  // Coupon usage (real data)
  couponRow: { paddingVertical: Spacing.sm, gap: 6 },
  couponCode: {
    fontFamily: FontFamily.mono, fontSize: 14, fontWeight: '700',
    letterSpacing: 0.5, flex: 1,
  },
  couponMeta: { fontFamily: FontFamily.mono, fontSize: 11, fontWeight: '600' },
  couponDesc: { fontFamily: FontFamily.body, fontSize: 11 },
  progressTrack: { height: 5, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  exhaustedLabel: { fontFamily: FontFamily.mono, fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  emptyCouponText: { fontFamily: FontFamily.body, fontSize: 13, paddingVertical: Spacing.md },

  // Reused from Operational Health (already present) — metricsGrid, metricCard,
  // metricHeader, metricIconWrap, metricDelta, metricValue, metricLabel

  // Restaurant ad performance
  adOrders: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '600' },
});