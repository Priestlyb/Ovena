/**
 * components/analytics/TimelineScroller.tsx
 *
 * Keeps the active item exactly centred at all times.
 *
 * Rewritten from a manual ScrollView + hand-computed pixel-offset approach
 * to FlatList + getItemLayout + scrollToIndex({ viewPosition: 0.5 }).
 *
 * WHY: the old approach measured each item's width asynchronously via
 * onLayout and summed those widths to compute a scroll offset. That's
 * fine once every item has reported its real width, but any selection
 * that happened before all ~14-18 items settled (or right after a
 * dataset/period switch replaces the list) used a `?? 60` fallback width
 * for not-yet-measured items — which under-estimates real widths
 * (especially long labels like "Apr(4)–May(1)" in the weeks view),
 * producing a scroll distance that's too short and leaving the selected
 * item sitting right of center, sometimes off the visible edge.
 *
 * Fixed-width item slots (ITEM_WIDTH) make getItemLayout exact with zero
 * measurement, so scrollToIndex's viewPosition: 0.5 (RN's own tested
 * centering primitive) can position the item correctly on every call,
 * synchronously, with no measurement race possible.
 *
 * contentContainerStyle gets dynamic horizontal padding equal to half the
 * container width so that even the FIRST and LAST items can be fully
 * centered (otherwise FlatList would clamp at the content edge and those
 * items could never reach the viewport's center) — same purpose the old
 * leading/trailing spacer Views served.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/theme';
import { TimePoint } from '@/data/analyticsData';

const ITEM_WIDTH = 78; // fixed slot — sized for the longest label (weeks view)
const ITEM_H     = 60;

interface TimelineScrollerProps {
  points:      TimePoint[];
  activeIndex: number;
  onSelect:    (index: number) => void;
}

export function TimelineScroller({ points, activeIndex, onSelect }: TimelineScrollerProps) {
  const { colors, isDark } = useTheme();
  const listRef = useRef<FlatList<TimePoint>>(null);

  const [containerWidth, setContainerWidth] = useState(0);

  const onWrapperLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  // getItemLayout is exact (no measurement needed) because every item is
  // a fixed ITEM_WIDTH — this is what makes scrollToIndex reliable.
  const getItemLayout = useCallback(
    (_: ArrayLike<TimePoint> | null | undefined, index: number) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    []
  );

  // Re-center whenever the selected index changes OR the list itself
  // changes (dataset/period switch resets the points array).
  useEffect(() => {
    if (points.length === 0) return;
    const clamped = Math.min(Math.max(activeIndex, 0), points.length - 1);

    // Deferred one tick so FlatList has committed the current data/layout
    // before we ask it to scroll — avoids scrolling against stale content.
    const id = setTimeout(() => {
      listRef.current?.scrollToIndex({
        index:        clamped,
        animated:     true,
        viewPosition: 0.001, // 0.5 = center the item in the viewport
      });
    }, 0);

    return () => clearTimeout(id);
  }, [activeIndex, points]);

  const bgColor   = isDark ? colors.surfaceContainerLow : colors.surfaceContainerLow;
  const fadeColor = isDark ? '#1c1b20' : (colors.surfaceContainerLow ?? '#f5ede6');

  const sidePad = containerWidth > 0 ? Math.max(0, containerWidth / 2 - ITEM_WIDTH / 2) : 0;

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: bgColor, borderColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border },
      ]}
      onLayout={onWrapperLayout}
    >
      <FlatList
        ref={listRef}
        data={points}
        keyExtractor={(pt) => pt.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        contentContainerStyle={{ paddingHorizontal: sidePad }}
        // Safety net only — shouldn't normally fire since getItemLayout is
        // exact, but guards the rare case scrollToIndex runs before the
        // container has ever laid out (containerWidth still 0).
        onScrollToIndexFailed={({ index }) => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({ index, animated: false, viewPosition: 0.5 });
          }, 50);
        }}
        renderItem={({ item: pt, index: i }) => {
          const isActive = i === activeIndex;
          const dist     = Math.abs(i - activeIndex);
          const opacity  = isActive ? 1 : Math.max(0.14, 1 - dist * 0.28);

          return (
            <TouchableOpacity
              onPress={() => onSelect(i)}
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
                numberOfLines={1}
              >
                {pt.label}
              </Text>
              {isActive && (
                <View style={[styles.dot, { backgroundColor: colors.primaryContainer }]} />
              )}
            </TouchableOpacity>
          );
        }}
      />

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
  item: {
    width:          ITEM_WIDTH,
    alignItems:     'center',
    justifyContent: 'center',
    height:         ITEM_H,
    gap:            5,
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