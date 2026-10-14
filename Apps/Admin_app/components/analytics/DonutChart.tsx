/**
 * components/analytics/DonutChart.tsx
 *
 * MODE A — animKey changes (dataset / period switch):
 *   All segments fan out from 0 → target with staggered Easing.back pop.
 *
 * MODE B — segments change, animKey unchanged (timeline tap):
 *   Each segment morphs from its previous arc length and offset to the new
 *   values in 560ms with Easing.inOut(Easing.cubic).
 *
 * Key design decisions:
 *  - `renderStateRef` holds the {fromArc, fromOffset, toArc, toOffset, progress}
 *    snapshot that AnimatedSegment reads. It is updated synchronously before
 *    the component re-renders, so child components always see consistent values.
 *  - `prevArcsRef` stores the last completed arc layout for Mode B from-values.
 *  - Progress Animated.Values are reused across renders (keyed by segment key)
 *    and reset to 0 at the start of every animation cycle.
 *  - All animations are useNativeDriver: false because they drive SVG props.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { DonutSegment } from '@/data/analyticsData';
import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

// ─── Geometry ─────────────────────────────────────────────────────────────────
const VIEWBOX       = 100;
const CX            = 50;
const CY            = 50;
const R             = 33;
const STROKE_W      = 15;
const CIRCUMFERENCE = 2 * Math.PI * R;
const GAP           = STROKE_W * 0.10;

interface ArcSlice {
  key:       string;
  color:     string;
  arcLength: number;
  startAt:   number;
}

function computeArcs(segments: DonutSegment[]): ArcSlice[] {
  const total = segments.reduce((s, seg) => s + seg.percent, 0) || 100;
  let cursor  = 0;
  return segments.map(seg => {
    const fullSlice = (seg.percent / total) * CIRCUMFERENCE;
    const arcLength = Math.max(0, fullSlice - GAP);
    const startAt   = cursor;
    cursor         += fullSlice;
    return { key: seg.key, color: seg.color, arcLength, startAt };
  });
}

// ─── Per-segment render state ─────────────────────────────────────────────────
interface SegmentRenderState {
  fromArc:    number;
  fromOffset: number;
  toArc:      number;
  toOffset:   number;
  color:      string;
  progress:   Animated.Value;
}

// ─── Animated segment ─────────────────────────────────────────────────────────
function AnimatedSegment({ state }: { state: SegmentRenderState }) {
  const { fromArc, fromOffset, toArc, toOffset, color, progress } = state;

  const [drawn,  setDrawn]  = useState(fromArc);
  const [offset, setOffset] = useState(fromOffset);

  useEffect(() => {
    const fa = fromArc,   fo = fromOffset;
    const ta = toArc,     to_ = toOffset;

    const id = progress.addListener(({ value }) => {
      setDrawn( fa + value * (ta  - fa));
      setOffset(fo + value * (to_ - fo));
    });
    return () => progress.removeListener(id);
  }, [fromArc, fromOffset, toArc, toOffset, progress]);

  const ghost = Math.max(0, CIRCUMFERENCE - drawn);
  return (
    <Circle
      cx={CX} cy={CY} r={R}
      fill="transparent"
      stroke={color}
      strokeWidth={STROKE_W}
      strokeDasharray={`${Math.max(0, drawn)} ${ghost}`}
      strokeDashoffset={-offset}
      strokeLinecap="butt"
    />
  );
}

// ─── Chart ────────────────────────────────────────────────────────────────────
export interface DonutChartProps {
  segments:      DonutSegment[];
  totalLabel:    string;
  subLabel?:     string;
  activePeriod?: string;
  size?:         number;
  animKey:       string;
}

export function DonutChart({
  segments,
  totalLabel,
  subLabel     = 'Total',
  activePeriod,
  size         = 260,
  animKey,
}: DonutChartProps) {
  const { colors } = useTheme();

  // Stable refs — never cause re-renders
  const prevAnimKeyRef  = useRef<string>('__INIT__');
  const prevArcsRef     = useRef<ArcSlice[]>([]);
  const progressRefs    = useRef<Record<string, Animated.Value>>({});
  // Snapshot read during render — set synchronously before render
  const renderStateRef  = useRef<Record<string, SegmentRenderState>>({});

  const targetArcs = useMemo(() => computeArcs(segments), [segments]);

  const modeA = animKey !== prevAnimKeyRef.current;

  // Build render state synchronously (before render, not in effect)
  targetArcs.forEach(arc => {
    // Create progress value if this key is new
    if (!progressRefs.current[arc.key]) {
      progressRefs.current[arc.key] = new Animated.Value(0);
    }

    const prev       = prevArcsRef.current.find(p => p.key === arc.key);
    const fromArc    = modeA ? 0            : (prev?.arcLength ?? 0);
    const fromOffset = modeA ? arc.startAt  : (prev?.startAt   ?? arc.startAt);

    renderStateRef.current[arc.key] = {
      fromArc,
      fromOffset,
      toArc:    arc.arcLength,
      toOffset: arc.startAt,
      color:    arc.color,
      progress: progressRefs.current[arc.key],
    };
  });

  // Fire animations in effect (after render)
  useEffect(() => {
    const isModeA = animKey !== prevAnimKeyRef.current;

    // Stop in-flight
    Object.values(progressRefs.current).forEach(p => p.stopAnimation());

    const animations = targetArcs.map((arc, i) => {
      const prog = progressRefs.current[arc.key];
      prog.setValue(0);

      if (isModeA) {
        return Animated.sequence([
          Animated.delay(i * 65),
          Animated.timing(prog, {
            toValue:         1,
            duration:        820,
            easing:          Easing.out(Easing.back(1.35)),
            useNativeDriver: false,
          }),
        ]);
      }
      return Animated.timing(prog, {
        toValue:         1,
        duration:        560,
        easing:          Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      });
    });

    Animated.parallel(animations).start();

    // Commit refs for next cycle
    prevAnimKeyRef.current = animKey;
    prevArcsRef.current    = targetArcs;
  }, [segments, animKey]);

  return (
    <View style={styles.wrapper}>
      {activePeriod ? (
        <Text style={[styles.periodLabel, { color: colors.onSurfaceVariant }]}>
          {activePeriod.toUpperCase()}
        </Text>
      ) : null}

      <View style={[styles.chartWrap, { width: size, height: size }]}>
        <Svg
          width={size} height={size}
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          style={styles.svg}
        >
          <Circle
            cx={CX} cy={CY} r={R}
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={STROKE_W}
          />
          {targetArcs.map(arc => {
            const state = renderStateRef.current[arc.key];
            if (!state) return null;
            return <AnimatedSegment key={arc.key} state={state} />;
          })}
        </Svg>

        <View style={styles.centerLabel} pointerEvents="none">
          <Text style={[styles.totalValue, { color: colors.onSurface }]}>
            {totalLabel}
          </Text>
          <Text style={[styles.subLabel, { color: colors.onSurfaceVariant }]}>
            {subLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap:        8,
    width:      '100%',
  },
  periodLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      11,
    fontWeight:    '600',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    alignSelf:     'flex-start',
  },
  chartWrap: {
    alignItems:     'center',
    justifyContent: 'center',
    alignSelf:      'center',
  },
  svg: { transform: [{ rotate: '-90deg' }] },
  centerLabel: {
    position:       'absolute',
    alignItems:     'center',
    justifyContent: 'center',
  },
  totalValue: {
    fontFamily:    FontFamily.heading,
    fontSize:      30,
    fontWeight:    '700',
    letterSpacing: -1.2,
    lineHeight:    38,
    textAlign:     'center',
  },
  subLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginTop:     3,
    textAlign:     'center',
  },
});