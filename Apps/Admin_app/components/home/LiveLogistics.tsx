/**
 * components/home/LiveLogistics.tsx
 *
 * HTML source:
 *  Section header: "Live Logistics" (headline-sm) + pulsing dot + "LIVE" (label-sm, primary)
 *
 *  Each card: glass-card rounded-2xl flex items-center justify-between
 *    - Item 1: border-l-4 border-l-primary-container (lava stripe)
 *    - Item 2: border-l-4 border-l-error
 *    - Item 3: no left border stripe
 *    - Press: scale-95 spring (from the JS micro-interaction script)
 *
 *  Left side: round avatar icon (bg-surface-container-highest) + name/subtitle
 *  Right side: badge pill + STK label
 *    - ETA badge:   bg-primary-container/20 text-primary
 *    - Delay badge: bg-error/20 text-error
 *    - Neutral:     bg-surface-variant text-on-surface-variant
 *
 *  Pulsing LIVE dot: animate-pulse (RN: looping Animated opacity 1→0.3→1)
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────
export type LogisticsItemType = 'rider' | 'store' | 'client';
export type LeftBorderVariant = 'lava' | 'error' | 'none';

export interface LogisticsItem {
  id:           string;
  type:         LogisticsItemType;
  name:         string;
  subtitle:     string;
  eta?:         string;
  delay?:       string;
  stk?:         string | number;
  leftBorder?:  LeftBorderVariant;
}

// ─── Icon map ─────────────────────────────────────────────────────────────────
function rowIcon(type: LogisticsItemType): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'rider':  return 'bicycle';
    case 'store':  return 'storefront';
    case 'client': return 'person';
  }
}

// ─── Pulsing dot (animate-pulse) ─────────────────────────────────────────────
function PulsingDot() {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.25, duration: 800,  useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1,    duration: 800,  useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.liveDot,
        { backgroundColor: colors.primaryContainer, opacity },
      ]}
    />
  );
}

// ─── Single row card ──────────────────────────────────────────────────────────
function LogisticsCard({ item }: { item: LogisticsItem }) {
  const { colors, isDark } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  // glass-card bg
  const cardBg     = isDark ? 'rgba(27,27,30,0.6)' : colors.surfaceContainer;
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : colors.border;

  // Left border colour
  const leftBorderColor =
    item.leftBorder === 'lava'  ? colors.primaryContainer :
    item.leftBorder === 'error' ? colors.error            :
    'transparent';

  // Badge
  const hasDelay   = !!item.delay;
  const badgeLabel =
    item.delay ? `Delay: ${item.delay}` :
    item.eta   ? `ETA: ${item.eta}`     :
    'ETA: --';

  const badgeBg   =
    hasDelay            ? (isDark ? 'rgba(255,180,171,0.20)' : 'rgba(186,26,26,0.12)') :
    item.eta            ? (isDark ? 'rgba(245,110,15,0.20)'  : 'rgba(245,110,15,0.12)') :
    colors.surfaceContainerHighest;

  const badgeColor =
    hasDelay ? colors.error :
    item.eta ? colors.primaryContainer :
    colors.onSurfaceVariant;

  return (
    <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor:     cardBorder,
            borderLeftColor: leftBorderColor,
            borderLeftWidth: item.leftBorder !== 'none' && item.leftBorder ? 4 : 1,
            transform:       [{ scale }],
          },
        ]}
      >
        {/* Left: icon + text */}
        <View style={styles.cardLeft}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surfaceContainerHighest }]}>
            <Ionicons name={rowIcon(item.type)} size={22} color={colors.onSurfaceVariant} />
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.cardName, { color: colors.onSurface }]}>{item.name}</Text>
            <Text style={[styles.cardSub,  { color: colors.onSurfaceVariant }]}>{item.subtitle}</Text>
          </View>
        </View>

        {/* Right: badge + STK */}
        <View style={styles.cardRight}>
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeLabel}</Text>
          </View>
          <Text style={[styles.stk, { color: colors.secondary ?? colors.onSurfaceVariant }]}>
            STK: {item.stk ?? '--'}
          </Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
interface LiveLogisticsProps {
  items: LogisticsItem[];
}

export function LiveLogistics({ items }: LiveLogisticsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
          Live Logistics
        </Text>
        <View style={styles.livePill}>
          <PulsingDot />
          <Text style={[styles.liveLabel, { color: colors.primaryContainer }]}>LIVE</Text>
        </View>
      </View>

      {/* Cards */}
      <View style={styles.cardList}>
        {items.map((item) => (
          <LogisticsCard key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.gutter,
    gap:               Spacing.sm,
  },
  sectionHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-end',
    marginBottom:   Spacing.xs,
  },
  sectionTitle: {
    fontFamily:    FontFamily.heading,
    fontSize:      20,
    fontWeight:    '600',
    lineHeight:    28,
    letterSpacing: -0.2,
  },
  livePill: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
  liveDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
  },
  liveLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 1,
  },
  cardList: {
    gap: Spacing.xs,
  },
  // Card
  card: {
    borderRadius:  Radius.xl,    // rounded-2xl
    borderWidth:   1,
    flexDirection: 'row',
    alignItems:    'center',
    justifyContent: 'space-between',
    paddingVertical:   Spacing.sm,
    paddingHorizontal: Spacing.md,
    overflow:      'hidden',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.md,
    flex:          1,
  },
  iconCircle: {
    width:          40,
    height:         40,
    borderRadius:   20,
    justifyContent: 'center',
    alignItems:     'center',
  },
  textBlock: {
    flex: 1,
    gap:  2,
  },
  cardName: {
    fontFamily:  FontFamily.body,
    fontSize:    14,
    fontWeight:  '400',  // body-md
    lineHeight:  20,
  },
  cardSub: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    lineHeight:    14,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap:        4,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical:   4,
    borderRadius:      Radius.full,
  },
  badgeText: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    lineHeight:    14,
  },
  stk: {
    fontFamily:  FontFamily.body,
    fontSize:    12,
    fontWeight:  '400',
    lineHeight:  16,
  },
});