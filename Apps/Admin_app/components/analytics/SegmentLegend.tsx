/**
 * components/analytics/SegmentLegend.tsx
 *
 * 2-column grid showing colour dot, category name, value and percentage.
 * Matches image 2 legend layout exactly.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DonutSegment } from '@/data/analyticsData';
import { useTheme } from '@/context/ThemeContext';
import { FontFamily, Spacing } from '@/constants/theme';

interface SegmentLegendProps {
  segments:    DonutSegment[];
  valuePrefix?: string;
}

export function SegmentLegend({ segments, valuePrefix = '$' }: SegmentLegendProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.grid}>
      {segments.map(seg => (
        <View key={seg.key} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: seg.color }]} />
          <View style={styles.text}>
            <Text style={[styles.label, { color: colors.onSurface }]}>
              {seg.label}
            </Text>
            <Text style={[styles.value, { color: colors.onSurfaceVariant }]}>
              {valuePrefix}{seg.value.toLocaleString()} | {seg.percent}%
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection:  'row',
    flexWrap:       'wrap',
    gap:            Spacing.md,
  },
  item: {
    width:         '46%',
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
  },
  dot: {
    width:        10,
    height:       10,
    borderRadius: 5,
    flexShrink:   0,
  },
  text: {
    flex: 1,
    gap:  1,
  },
  label: {
    fontFamily:  FontFamily.mono,
    fontSize:    11,
    fontWeight:  '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  value: {
    fontFamily:  FontFamily.mono,
    fontSize:    10,
    fontWeight:  '400',
  },
});