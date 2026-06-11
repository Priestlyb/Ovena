/**
 * components/home/StatsRow.tsx
 *
 * Two glass stat cards side by side.
 *
 * Animation fix: scale (native) and lava-glow shadow (static, on outer View)
 * are fine together. The card's static backgroundColor is on a plain View,
 * not animated — so no driver conflict here. iconOp drives opacity only,
 * which is native-safe.
 */

import React, { useRef } from 'react';
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

function usePressScale() {
  const scale  = useRef(new Animated.Value(1)).current;
  const iconOp = useRef(new Animated.Value(0.10)).current;

  const onPressIn = () => {
    // Both are native-safe (transform + opacity) — parallel is fine here
    Animated.spring(scale,  { toValue: 0.95, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
    Animated.timing(iconOp, { toValue: 0.20, useNativeDriver: true, duration: 120 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale,  { toValue: 1,    useNativeDriver: true, speed: 20, bounciness: 6 }).start();
    Animated.timing(iconOp, { toValue: 0.10, useNativeDriver: true, duration: 200 }).start();
  };

  return { scale, iconOp, onPressIn, onPressOut };
}

interface StatCardProps {
  label:         string;
  value:         string | number;
  delta:         string;
  deltaPositive: boolean;
  icon:          keyof typeof Ionicons.glyphMap;
  lavaGlow?:     boolean;
  onPress?:      () => void;
}

function StatCard({ label, value, delta, deltaPositive, icon, lavaGlow, onPress }: StatCardProps) {
  const { colors, isDark } = useTheme();
  const { scale, iconOp, onPressIn, onPressOut } = usePressScale();

  const cardBg     = isDark ? 'rgba(27,27,30,0.6)' : colors.surfaceContainer;
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : colors.border;

  return (
    <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      {/*
        Single Animated.View is fine here because:
          - backgroundColor is a static string (not an interpolation from a non-native value)
          - transform uses native driver
          - opacity/shadow are also native-safe
        No mixed-driver conflict.
      */}
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor:     cardBorder,
            transform:       [{ scale }],
          },
          lavaGlow && isDark && {
            shadowColor:   '#f56e0f',
            shadowOffset:  { width: 0, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius:  20,
            elevation:     8,
          },
        ]}
      >
        {/* Ghost icon */}
        <Animated.View style={[styles.ghostIcon, { opacity: iconOp }]} pointerEvents="none">
          <Ionicons name={icon} size={64} color={colors.onSurface} />
        </Animated.View>

        <Text style={[
          styles.label,
          { color: deltaPositive ? colors.primaryContainer : colors.onSurfaceVariant },
        ]}>
          {label}
        </Text>

        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: colors.onSurface }]}>{value}</Text>
          <Text style={[
            styles.delta,
            { color: deltaPositive ? colors.primaryContainer : colors.error },
          ]}>
            {delta}
          </Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

interface StatsRowProps {
  activeOrders:          number;
  activeOrdersDelta:     string;
  activeOrdersPositive?: boolean;
  pendingValidation:     number;
  pendingDelta:          string;
  pendingDeltaPositive?: boolean;
}

export function StatsRow({
  activeOrders,
  activeOrdersDelta,
  activeOrdersPositive = true,
  pendingValidation,
  pendingDelta,
  pendingDeltaPositive = false,
}: StatsRowProps) {
  return (
    <View style={styles.row}>
      <StatCard
        label="Active Orders"
        value={activeOrders}
        delta={activeOrdersDelta}
        deltaPositive={activeOrdersPositive}
        icon="cart-outline"
        lavaGlow
      />
      <StatCard
        label="Pending Validation"
        value={String(pendingValidation).padStart(2, '0')}
        delta={pendingDelta}
        deltaPositive={pendingDeltaPositive}
        icon="checkmark-circle-outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     'row',
    gap:               Spacing.md,
    paddingHorizontal: Spacing.gutter,
  },
  card: {
    flex:              1,
    borderRadius:      Radius.xl,
    paddingVertical:   Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth:       1,
    gap:               Spacing.xs,
    overflow:          'hidden',
  },
  ghostIcon: {
    position: 'absolute',
    right:    -16,
    top:      -16,
  },
  label: {
    fontFamily:    FontFamily.mono,
    fontSize:      12,
    fontWeight:    '500',
    letterSpacing: 0.6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems:    'flex-end',
    gap:           Spacing.xs,
  },
  value: {
    fontFamily:    FontFamily.heading,
    fontSize:      32,
    fontWeight:    '700',
    lineHeight:    40,
    letterSpacing: -1.5,
  },
  delta: {
    fontFamily:   FontFamily.body,
    fontSize:     12,
    fontWeight:   '400',
    lineHeight:   16,
    marginBottom: 4,
  },
});