/**
 * components/home/QuickActions.tsx
 *
 * Two pill-shaped shortcut buttons.
 *
 * Animation fix: scale (native) and backgroundColor (non-native) must
 * never share the same Animated.View node.
 *   OUTER Animated.View → backgroundColor interpolation (useNativeDriver: false)
 *   INNER Animated.View → transform: scale            (useNativeDriver: true)
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

interface QuickActionButtonProps {
  icon:     keyof typeof Ionicons.glyphMap;
  label:    string;
  onPress?: () => void;
}

function QuickActionButton({ icon, label, onPress }: QuickActionButtonProps) {
  const { colors, isDark } = useTheme();

  // Non-native value — backgroundColor only
  const bgAnim = useRef(new Animated.Value(0)).current;
  const bgColor = bgAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [colors.surfaceContainerHigh, colors.surfaceContainerHighest],
  });

  // Native value — transform only
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    // Fire separately — never in Animated.parallel across different drivers
    Animated.spring(scale,  { toValue: 0.96, useNativeDriver: true,  speed: 50, bounciness: 4 }).start();
    Animated.timing(bgAnim, { toValue: 1,    useNativeDriver: false, duration: 120 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale,  { toValue: 1, useNativeDriver: true,  speed: 20, bounciness: 6 }).start();
    Animated.timing(bgAnim, { toValue: 0, useNativeDriver: false, duration: 200 }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      {/* OUTER: backgroundColor (non-native) — no transform here */}
      <Animated.View
        style={[
          styles.outerWrap,
          {
            backgroundColor: bgColor,
            borderColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border,
          },
        ]}
      >
        {/* INNER: transform scale (native) — no backgroundColor here */}
        <Animated.View
          style={[styles.innerRow, { transform: [{ scale }] }]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: colors.surfaceContainerHighest,
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border,
              },
            ]}
          >
            <Ionicons name={icon} size={17} color={colors.primaryContainer} />
          </View>
          <Text style={[styles.label, { color: colors.onSurface }]}>{label}</Text>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

interface QuickActionsProps {
  onCouponManager?:   () => void;
  onAssignSpinwheel?: () => void;
}

export function QuickActions({ onCouponManager, onAssignSpinwheel }: QuickActionsProps) {
  return (
    <View style={styles.row}>
      <QuickActionButton
        icon="settings"
        label="Coupon Manager"
        onPress={onCouponManager}
      />
      <QuickActionButton
        icon="add-circle"
        label="Assign Spinwheel"
        onPress={onAssignSpinwheel}
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
  // Outer: non-native bg — must not have transform
  outerWrap: {
    flex:         1,
    borderRadius: Radius.xl,
    borderWidth:  1,
    overflow:     'hidden',
  },
  // Inner: native scale — must not have backgroundColor
  innerRow: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             Spacing.xs,
    paddingVertical:   Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  iconCircle: {
    width:          34,
    height:         34,
    borderRadius:   17,
    justifyContent: 'center',
    alignItems:     'center',
    borderWidth:    1,
  },
  label: {
    fontFamily:  FontFamily.body,
    fontSize:    13,
    fontWeight:  '500',
    flex:        1,
  },
});