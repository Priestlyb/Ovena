/**
 * components/analytics/TimelineScroller.tsx
 *
 * Horizontal scrolling timeline.
 * - Active item is centred, full-brightness, slightly larger (scale 1.1)
 * - Inactive items fade by distance from centre
 * - Left/right gradient fade edges (same as HTML)
 * - Scrolls active into centre on period or data change
 */

import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { FontFamily, Spacing } from '@/constants/theme';
import { TimePoint } from '@/data/analyticsData';

const SCREEN_W  = Dimensions.get('window').width;
const ITEM_W    = 80;   // approximate item width including gap

interface TimelineScrollerProps {
  points:      TimePoint[];
  activeIndex: number;
  onSelect:    (index: number) => void;
}

export function TimelineScroller({ points, activeIndex, onSelect }: TimelineScrollerProps) {
  const { colors, isDark } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  // Centre the active item on change
  useEffect(() => {
    if (!scrollRef.current) return;
    const offset = activeIndex * ITEM_W - SCREEN_W / 2 + ITEM_W / 2;
    scrollRef.current.scrollTo({ x: Math.max(0, offset), animated: true });
  }, [activeIndex, points]);

  const containerBg = isDark ? colors.surfaceContainerLow : colors.surfaceContainerLow;
  const fadeColor   = isDark ? '#1c1b20' : colors.surfaceContainerLow;

  return (
    <View style={[styles.wrapper, { backgroundColor: containerBg, borderColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Leading spacer so first item can centre */}
        <View style={{ width: SCREEN_W / 2 - ITEM_W / 2 }} />

        {points.map((pt, i) => {
          const isActive = i === activeIndex;
          const dist     = Math.abs(i - activeIndex);
          // Opacity drops with distance: 1 → 0.6 → 0.35 → 0.2
          const opacity  = isActive ? 1 : Math.max(0.18, 1 - dist * 0.28);

          return (
            <TouchableOpacity
              key={pt.key}
              onPress={() => onSelect(i)}
              style={styles.item}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.itemText,
                  {
                    color:       isActive ? colors.primaryContainer : colors.onSurface,
                    opacity,
                    transform:   [{ scale: isActive ? 1.1 : 1 }],
                    fontWeight:  isActive ? '700' : '400',
                  },
                ]}
              >
                {pt.label}
              </Text>
              {isActive && (
                <View style={[styles.activeDot, { backgroundColor: colors.primaryContainer }]} />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Trailing spacer */}
        <View style={{ width: SCREEN_W / 2 - ITEM_W / 2 }} />
      </ScrollView>

      {/* Left fade */}
      <View style={[styles.fadeLeft,  { backgroundColor: `${fadeColor}` }]} pointerEvents="none" />
      {/* Right fade */}
      <View style={[styles.fadeRight, { backgroundColor: `${fadeColor}` }]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 24,
    borderWidth:  1,
    height:       56,
    overflow:     'hidden',
    justifyContent: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    height:     56,
  },
  item: {
    width:          ITEM_W,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            4,
    paddingVertical: 8,
  },
  itemText: {
    fontFamily:    FontFamily.mono,
    fontSize:      12,
    letterSpacing: 0.3,
    textAlign:     'center',
  },
  activeDot: {
    width:        4,
    height:       4,
    borderRadius: 2,
  },
  fadeLeft: {
    position: 'absolute',
    left:     0,
    top:      0,
    bottom:   0,
    width:    48,
    opacity:  0.95,
  },
  fadeRight: {
    position: 'absolute',
    right:    0,
    top:      0,
    bottom:   0,
    width:    48,
    opacity:  0.95,
  },
});