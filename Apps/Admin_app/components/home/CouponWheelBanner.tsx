/**
 * components/home/CouponWheelBanner.tsx
 *
 * HTML source:
 *  - bg-primary-container + gradient overlay from-primary-container to-[#ff3d00] opacity-80
 *  - rounded-[2.5rem] (40px)
 *  - Giant casino icon bottom-right: opacity-20, group-hover:scale-110 transition 700ms
 *  - Title: text-on-primary (dark brown #531f00)
 *  - Subtitle: text-on-primary/80
 *
 * Coupon Manager / Assign Spinwheel / Active Orders now render as three
 * square, solid-surface buttons side by side inside the banner — same
 * bg/text treatment the old "Launch Engine" pill used (colors.surface bg,
 * colors.primaryContainer text/icon), just split into square tiles
 * instead of one wide pill.
 *
 * This box is no longer coupon-wheel-specific — title/subtitle updated to
 * reflect it as the general management-actions entry point (Active Orders
 * added as the third tile, replacing the entry point that used to live on
 * the now-removed LiveMapCard). Dice decoration kept since Assign
 * Spinwheel still lives here; swap it if that reads wrong now that the
 * box covers more than just the spinwheel.
 */

import { FontFamily, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CouponWheelBannerProps {
  onCouponManager?: () => void;
  onAssignSpinwheel?: () => void;
  onActiveOrders?: () => void;
}

export function CouponWheelBanner({
  onCouponManager,
  onAssignSpinwheel,
  onActiveOrders,
}: CouponWheelBannerProps) {
  const { colors } = useTheme();

  // Casino icon hover scale (group-hover:scale-110 duration-700)
  const diceScale = useRef(new Animated.Value(1)).current;
  const onBannerPressIn = () =>
    Animated.timing(diceScale, {
      toValue: 1.1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  const onBannerPressOut = () =>
    Animated.spring(diceScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 8,
      bounciness: 4,
    }).start();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onBannerPressIn}
        onPressOut={onBannerPressOut}
        style={styles.bannerOuter}
      >
        <LinearGradient
          colors={["#f56e0f", "#ff3d00"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "#f56e0f", opacity: 0.15 },
          ]}
        />

        {/* Decorative dice icon — bottom right */}
        <Animated.View
          style={[styles.diceDecor, { transform: [{ scale: diceScale }] }]}
          pointerEvents="none"
        >
          <Ionicons name="dice" size={160} color="rgba(255,255,255,0.20)" />
        </Animated.View>

        {/* Content */}
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Quick Actions</Text>
          <Text style={styles.bannerSubtitle}>
            Common management activities, one tap away.
          </Text>

          {/* Square action tiles, side by side */}
          <View style={styles.actionsRow}>
            <SquareActionButton
              icon="settings"
              label="Coupon Manager"
              onPress={onCouponManager}
              colors={colors}
            />
            <SquareActionButton
              icon="add-circle"
              label="Assign Spinwheel"
              onPress={onAssignSpinwheel}
              colors={colors}
            />
            <SquareActionButton
              icon="receipt"
              label="Active Orders"
              onPress={onActiveOrders}
              colors={colors}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

interface SquareActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
}

function SquareActionButton({
  icon,
  label,
  onPress,
  colors,
}: SquareActionButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn = () =>
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  const onOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();

  return (
    <Animated.View style={[styles.squareBtnWrap, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={[styles.squareBtn, { backgroundColor: colors.surface }]}
        onPress={onPress}
        onPressIn={onIn}
        onPressOut={onOut}
        activeOpacity={1}
      >
        <Ionicons name={icon} size={22} color={colors.primaryContainer} />
        <Text
          style={[styles.squareBtnText, { color: colors.primaryContainer }]}
          numberOfLines={2}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.gutter,
  },
  bannerOuter: {
    borderRadius: 40, // rounded-[2.5rem]
    overflow: "hidden",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    minHeight: 180,
  },
  diceDecor: {
    position: "absolute",
    right: -40,
    bottom: -40,
  },
  bannerContent: {
    gap: Spacing.xs,
    position: "relative",
    zIndex: 10,
  },
  bannerTitle: {
    fontFamily: FontFamily.heading,
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
    letterSpacing: -0.3,
    color: "#531f00", // on-primary-container — fixed, design token
  },
  bannerSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    color: "rgba(83,31,0,0.80)",
    maxWidth: 200,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },

  // Square action tiles, side by side
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  squareBtnWrap: {
    flex: 1,
    maxWidth: 100, // keeps tiles roughly square rather than stretching wide
  },
  squareBtn: {
    aspectRatio: 3 / 2,
    borderRadius: Radius.lg, // squared corners, not full/pill
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
    // subtle elevation so the solid surface lifts off the gradient
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  squareBtnText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 12,
  },
});
