/**
 * components/analytics/TimelineScroller.tsx
 *
 * Keeps the active item exactly centred at all times.
 *
 * How centring works:
 *   leading padding = containerWidth / 2  (state, triggers re-render on measure)
 *   trailing padding = containerWidth / 2
 *
 *   This means:
 *     scrollX = 0       → item 0 midpoint is at container centre
 *     scrollX = Σw[0..i-1] + w[i]/2 - containerWidth/2
 *             → item i midpoint is at container centre
 *
 * The key fix over previous versions: containerWidth is STATE not a ref,
 * so when onLayout fires the spacer Views re-render with the correct
 * padding before scrollToActive calculates its target offset.
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/theme';
import { TimePoint } from '@/data/analyticsData';

const ITEM_H       = 60;
const ITEM_PADDING = 14;

interface TimelineScrollerProps {
  points:      TimePoint[];
  activeIndex: number;
  onSelect:    (index: number) => void;
}

export function TimelineScroller({ points, activeIndex, onSelect }: TimelineScrollerProps) {
  const { colors, isDark } = useTheme();

  const scrollRef   = useRef<ScrollView>(null);
  const itemWidths  = useRef<number[]>([]);
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  // STATE — so spacer Views re-render when the container measures
  const [containerWidth, setContainerWidth] = useState(0);

  const scrollToActive = useCallback((animated: boolean, cw: number) => {
    const widths = itemWidths.current;
    if (cw === 0) return;

    let x = 0;
    for (let i = 0; i < activeIndex; i++) {
      x += widths[i] ?? 60;
    }
    x += (widths[activeIndex] ?? 60) / 2;
    x -= cw / 2;

    scrollRef.current?.scrollTo({ x: Math.max(0, x), animated });
  }, [activeIndex]);

  const scheduleScroll = useCallback((animated: boolean, cw: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => scrollToActive(animated, cw), 100);
  }, [scrollToActive]);

  // Re-centre whenever activeIndex or points change
  useEffect(() => {
    // Reset widths array when points list length changes
    if (itemWidths.current.length !== points.length) {
      itemWidths.current = [];
    }
    scheduleScroll(true, containerWidth);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeIndex, points, containerWidth, scheduleScroll]);

  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setContainerWidth(prev => {
      if (prev !== w) {
        // Scroll after the new spacer width has rendered (next frame)
        setTimeout(() => scrollToActive(false, w), 50);
        return w;
      }
      return prev;
    });
  }, [scrollToActive]);

  const onItemLayout = useCallback((index: number) => (e: LayoutChangeEvent) => {
    itemWidths.current[index] = e.nativeEvent.layout.width;
    const allMeasured = itemWidths.current.filter(w => w > 0).length === points.length;
    if (allMeasured) {
      scheduleScroll(true, containerWidth);
    }
  }, [points.length, containerWidth, scheduleScroll]);

  // Half the container width — used as both leading and trailing padding.
  // Because containerWidth is state, changes here cause the spacers to re-render
  // BEFORE the next scrollToActive fires.
  const halfPad = containerWidth > 0 ? containerWidth / 2 : 0;

  const bgColor   = isDark ? colors.surfaceContainerLow : colors.surfaceContainerLow;
  const fadeColor = isDark ? '#1c1b20' : (colors.surfaceContainerLow ?? '#f5ede6');

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: bgColor,
          borderColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border,
        },
      ]}
      onLayout={onContainerLayout}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        {/* Leading pad — re-renders when containerWidth state changes */}
        <View style={{ width: halfPad }} />

        {points.map((pt, i) => {
          const isActive = i === activeIndex;
          const dist     = Math.abs(i - activeIndex);
          const opacity  = isActive ? 1 : Math.max(0.14, 1 - dist * 0.28);

          return (
            <TouchableOpacity
              key={pt.key}
              onPress={() => onSelect(i)}
              onLayout={onItemLayout(i)}
              style={styles.item}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.itemText,
                  {
                    color:      isActive ? colors.primaryContainer : colors.onSurface,
                    opacity,
                    fontWeight: isActive ? '700' : '400',
                    fontSize:   isActive ? 13 : 12,
                  },
                ]}
              >
                {pt.label}
              </Text>
              {isActive && (
                <View style={[styles.dot, { backgroundColor: colors.primaryContainer }]} />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Trailing pad */}
        <View style={{ width: halfPad }} />
      </ScrollView>

      <View style={[styles.fadeEdge, styles.fadeLeft,  { backgroundColor: fadeColor }]} pointerEvents="none" />
      <View style={[styles.fadeEdge, styles.fadeRight, { backgroundColor: fadeColor }]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius:   24,
    borderWidth:    1,
    height:         ITEM_H,
    overflow:       'hidden',
    justifyContent: 'center',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems:    'center',
    height:        ITEM_H,
  },
  item: {
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: ITEM_PADDING,
    height:            ITEM_H,
    gap:               5,
  },
  itemText: {
    fontFamily:    FontFamily.mono,
    letterSpacing: 0.3,
    textAlign:     'center',
  },
  dot: {
    width:        5,
    height:       5,
    borderRadius: 2.5,
  },
  fadeEdge: {
    position: 'absolute',
    top:      0,
    bottom:   0,
    width:    48,
    opacity:  0.95,
  },
  fadeLeft:  { left:  0 },
  fadeRight: { right: 0 },
});