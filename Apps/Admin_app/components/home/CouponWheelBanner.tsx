/**
 * components/home/CouponWheelBanner.tsx
 *
 * HTML source:
 *  - bg-primary-container + gradient overlay from-primary-container to-[#ff3d00] opacity-80
 *  - rounded-[2.5rem] (40px)
 *  - Giant casino icon bottom-right: opacity-20, group-hover:scale-110 transition 700ms
 *  - Title: text-on-primary (dark brown #531f00)
 *  - Subtitle: text-on-primary/80
 *  - Button: bg-surface text-primary rounded-full hover:scale-105 active:scale-95
 *  - Two quick-action buttons below: glass bg, border-white/5, rounded-2xl, hover:bg-surface-container-highest
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

interface CouponWheelBannerProps {
  onLaunch?: () => void;
}

export function CouponWheelBanner({ onLaunch }: CouponWheelBannerProps) {
  const { colors, isDark } = useTheme();

  // Casino icon hover scale (group-hover:scale-110 duration-700)
  const diceScale = useRef(new Animated.Value(1)).current;
  const onBannerPressIn  = () =>
    Animated.timing(diceScale, { toValue: 1.10, duration: 700, useNativeDriver: true }).start();
  const onBannerPressOut = () =>
    Animated.spring(diceScale, { toValue: 1, useNativeDriver: true, speed: 8, bounciness: 4 }).start();

  // Launch button: hover:scale-105 active:scale-95
  const btnScale = useRef(new Animated.Value(1)).current;
  const onBtnIn  = () => Animated.spring(btnScale, { toValue: 0.95, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onBtnOut = () => Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  return (
    <View style={styles.wrapper}>
      {/* ── Main promo card ── */}
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onBannerPressIn}
        onPressOut={onBannerPressOut}
        style={styles.bannerOuter}
      >
        <LinearGradient
          colors={['#f56e0f', '#ff3d00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Gradient overlay at 80% — matches "bg-gradient-to-br ... opacity-80" */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#f56e0f', opacity: 0.15 }]} />

        {/* Decorative dice icon — bottom right */}
        <Animated.View
          style={[styles.diceDecor, { transform: [{ scale: diceScale }] }]}
          pointerEvents="none"
        >
          <Ionicons name="dice" size={160} color="rgba(255,255,255,0.20)" />
        </Animated.View>

        {/* Content */}
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Create Coupon Wheel</Text>
          <Text style={styles.bannerSubtitle}>
            Design custom gamified rewards for seasonal campaigns.
          </Text>

          <Animated.View style={[styles.launchBtnWrap, { transform: [{ scale: btnScale }] }]}>
            <TouchableOpacity
              style={[styles.launchBtn, { backgroundColor: colors.surface }]}
              onPress={onLaunch}
              onPressIn={onBtnIn}
              onPressOut={onBtnOut}
              activeOpacity={1}
            >
              <Text style={[styles.launchBtnText, { color: colors.primaryContainer }]}>
                Launch Engine
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.gutter,
  },
  bannerOuter: {
    borderRadius:  40,   // rounded-[2.5rem]
    overflow:      'hidden',
    paddingVertical:   Spacing.lg,
    paddingHorizontal: Spacing.xl,
    minHeight:     180,
  },
  diceDecor: {
    position: 'absolute',
    right:    -40,
    bottom:   -40,
  },
  bannerContent: {
    gap:      Spacing.xs,
    position: 'relative',
    zIndex:   10,
  },
  bannerTitle: {
    fontFamily:    FontFamily.heading,
    fontSize:      24,
    fontWeight:    '600',
    lineHeight:    32,
    letterSpacing: -0.3,
    color:         '#531f00',  // on-primary-container — fixed, design token
  },
  bannerSubtitle: {
    fontFamily:  FontFamily.body,
    fontSize:    14,
    lineHeight:  20,
    fontWeight:  '400',
    color:       'rgba(83,31,0,0.80)',
    maxWidth:    200,
    marginTop:   4,
    marginBottom: Spacing.lg,
  },
  launchBtnWrap: {
    alignSelf: 'flex-start',
  },
  launchBtn: {
    paddingVertical:   Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius:      Radius.full,
  },
  launchBtnText: {
    fontFamily:    FontFamily.heading,
    fontSize:      20,
    fontWeight:    '600',
    lineHeight:    28,
    letterSpacing: -0.2,
  },
});