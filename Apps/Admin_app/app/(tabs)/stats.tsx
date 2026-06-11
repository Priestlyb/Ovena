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

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function StatsScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

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
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Best Sellers</Text>
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

        {/* ── Top Venues ── */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>Top Venues</Text>
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
});