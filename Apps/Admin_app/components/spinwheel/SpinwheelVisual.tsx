/**
 * components/spinwheel/SpinwheelVisual.tsx
 *
 * Animated SVG conic-gradient-style spinwheel.
 * - Renders N equal segments with the Lava Admin colour palette
 * - Slow continuous rotation (20s loop) — matches HTML animation
 * - Lava glow drop-shadow
 * - White centre dot
 * - Each segment label shown at its midpoint angle
 * - `spin` prop triggers a fast 5-turn animation that decelerates to a winner
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { WHEEL_SEGMENT_COLORS } from '@/data/couponData';
import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface SpinwheelVisualProps {
  labels:      string[];   // one per segment — uses coupon codes or reward names
  size?:       number;
  autoSpin?:   boolean;    // slow background rotation
  onSpinEnd?:  (winnerIndex: number) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function segmentPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(cx, cy, r, endDeg);
  const end   = polarToCartesian(cx, cy, r, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

export function SpinwheelVisual({
  labels,
  size = 220,
  autoSpin = true,
  onSpinEnd,
}: SpinwheelVisualProps) {
  const { colors } = useTheme();
  const n         = Math.max(2, labels.length);
  const sliceDeg  = 360 / n;
  const cx        = 50;
  const cy        = 50;
  const r         = 46;
  const innerR    = 8;

  // Slow continuous rotation
  const slowRot = useRef(new Animated.Value(0)).current;
  // Fast spin rotation
  const spinRot = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner]         = useState<number | null>(null);

  // Slow auto-spin loop
  useEffect(() => {
    if (!autoSpin) return;
    const loop = Animated.loop(
      Animated.timing(slowRot, {
        toValue:         1,
        duration:        20000,
        easing:          Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [autoSpin]);

  const slowDeg = slowRot.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Trigger fast spin
  const triggerSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);
    spinRot.setValue(0);

    // Pick a random winner
    const winIdx = Math.floor(Math.random() * n);
    // Total rotation: 5 full turns + land on winner's midpoint
    const winAngle = 360 - (winIdx * sliceDeg + sliceDeg / 2);
    const totalRot = 360 * 5 + winAngle;

    Animated.timing(spinRot, {
      toValue:         totalRot,
      duration:        3200,
      easing:          Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
      setWinner(winIdx);
      onSpinEnd?.(winIdx);
    });
  };

  const spinDeg = spinRot.interpolate({
    inputRange:  [0, 360 * 6],
    outputRange: ['0deg', `${360 * 6}deg`],
  });

  // Use spinDeg when spinning, else slowDeg
  const rotation = isSpinning ? spinDeg : slowDeg;

  return (
    <View style={[styles.wrapper, { width: size + 40, alignItems: 'center', gap: 12 }]}>
      {/* Wheel */}
      <View style={[styles.glowWrap, { width: size, height: size }]}>
        <Animated.View style={{ transform: [{ rotate: rotation }], width: size, height: size }}>
          <Svg width={size} height={size} viewBox="0 0 100 100">
            {labels.map((label, i) => {
              const startDeg = i * sliceDeg;
              const endDeg   = startDeg + sliceDeg;
              const midDeg   = startDeg + sliceDeg / 2;
              const segColor = WHEEL_SEGMENT_COLORS[i % WHEEL_SEGMENT_COLORS.length];
              // Label position at 72% of radius
              const lp = polarToCartesian(cx, cy, r * 0.68, midDeg);
              // Truncate long labels
              const shortLabel = label.length > 8 ? label.slice(0, 7) + '…' : label;

              return (
                <G key={i}>
                  <Path
                    d={segmentPath(cx, cy, r, startDeg, endDeg)}
                    fill={segColor}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth={0.5}
                  />
                  {/* Segment label — counter-rotated to stay upright */}
                  <SvgText
                    x={lp.x}
                    y={lp.y}
                    fill="rgba(255,255,255,0.92)"
                    fontSize={n <= 6 ? 5.5 : 4}
                    fontWeight="700"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${midDeg}, ${lp.x}, ${lp.y})`}
                  >
                    {shortLabel}
                  </SvgText>
                </G>
              );
            })}
            {/* Outer ring */}
            <Circle cx={cx} cy={cy} r={r} fill="transparent" stroke="rgba(255,255,255,0.12)" strokeWidth={0.8} />
            {/* Centre dot */}
            <Circle cx={cx} cy={cy} r={innerR} fill="white" />
            <Circle cx={cx} cy={cy} r={innerR - 2} fill="#1b1b1e" />
          </Svg>
        </Animated.View>

        {/* Pointer triangle at top */}
        <View style={styles.pointer} pointerEvents="none">
          <View style={[styles.pointerTriangle, { borderBottomColor: colors.primaryContainer }]} />
        </View>
      </View>

      {/* Winner badge */}
      {winner !== null && (
        <View style={[styles.winnerBadge, { backgroundColor: `${colors.primaryContainer}20`, borderColor: colors.primaryContainer }]}>
          <Text style={[styles.winnerText, { color: colors.primaryContainer }]}>
            🎉 {labels[winner]}
          </Text>
        </View>
      )}

      {/* Spin button */}
      <TouchableOpacity
        style={[
          styles.spinBtn,
          {
            backgroundColor: isSpinning ? colors.surfaceContainerHigh : colors.primaryContainer,
            opacity:         isSpinning ? 0.7 : 1,
          },
        ]}
        onPress={triggerSpin}
        activeOpacity={0.85}
        disabled={isSpinning}
      >
        <Text style={[styles.spinBtnText, { color: colors.onPrimaryContainer }]}>
          {isSpinning ? 'Spinning…' : 'Spin to Preview'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  glowWrap: {
    borderRadius:  999,
    shadowColor:   '#f56e0f',
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius:  20,
    elevation:     12,
    alignItems:    'center',
    justifyContent: 'center',
    position:      'relative',
  },
  pointer: {
    position:  'absolute',
    top:       -6,
    alignSelf: 'center',
    alignItems: 'center',
  },
  pointerTriangle: {
    width:           0,
    height:          0,
    borderLeftWidth:  8,
    borderRightWidth: 8,
    borderBottomWidth: 14,
    borderLeftColor:  'transparent',
    borderRightColor: 'transparent',
  },
  winnerBadge: {
    paddingHorizontal: 16,
    paddingVertical:   8,
    borderRadius:      999,
    borderWidth:       1,
  },
  winnerText: {
    fontFamily:    FontFamily.heading,
    fontSize:      14,
    fontWeight:    '700',
    letterSpacing: -0.2,
  },
  spinBtn: {
    paddingHorizontal: 28,
    paddingVertical:   12,
    borderRadius:      999,
  },
  spinBtnText: {
    fontFamily:    FontFamily.heading,
    fontSize:      14,
    fontWeight:    '700',
    letterSpacing: -0.2,
  },
});