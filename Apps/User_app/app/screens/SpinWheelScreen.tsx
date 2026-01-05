import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Svg, { G, Path, Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { router } from "expo-router";

const SIZE = 280;
const RADIUS = SIZE / 2;

const rewards = [
  { label: "₦250 Coupon", color: "#2E2459" },
  { label: "₦1000 Coupon", color: "#F9D74C" },
  { label: "₦500 off next order", color: "#F26722" },
  { label: "Free delivery", color: "#FDB94E" },
  { label: "Free meal (5k)", color: "#FFD34E" },
  { label: "Free service", color: "#F44336" },
  { label: "₦1500 Coupon", color: "#8BC34A" },
  { label: "₦2000 Coupon", color: "#1E88A8" },
  { label: "Mask", color: "#FF5252" },
];

const angleStep = (2 * Math.PI) / rewards.length;

export default function SpinWheelScreen() {
  const rotation = useSharedValue(0);
  const [spinning, setSpinning] = useState(false);

  /* ================= ANIMATION ================= */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}rad` }],
  }));

  /* ================= SPIN LOGIC ================= */
  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    const randomIndex = Math.floor(Math.random() * rewards.length);
    const spinAngle =
      Math.PI * 8 + randomIndex * angleStep + angleStep / 2;

    rotation.value = withTiming(
      spinAngle,
      { duration: 4000, easing: Easing.out(Easing.cubic) },
      () => {
        setSpinning(false);
      }
    );

    setTimeout(() => {
      Alert.alert("🎉 Congratulations!", rewards[randomIndex].label);
    }, 4200);
  };

  /* ================= WHEEL SLICE ================= */
  const createSlice = (index: number) => {
    const startAngle = index * angleStep;
    const endAngle = startAngle + angleStep;

    const x1 = RADIUS + RADIUS * Math.cos(startAngle);
    const y1 = RADIUS + RADIUS * Math.sin(startAngle);
    const x2 = RADIUS + RADIUS * Math.cos(endAngle);
    const y2 = RADIUS + RADIUS * Math.sin(endAngle);

    return (
      <Path
        key={index}
        d={`M${RADIUS} ${RADIUS} L${x1} ${y1} A${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2} Z`}
        fill={rewards[index].color}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lucky Spin</Text>

      {/* POINTER */}
      <View style={styles.pointerWrapper}>
        <View style={styles.pointer} />
      </View>

      {/* WHEEL */}
      <View style={styles.wheelContainer}>
        <Animated.View style={animatedStyle}>
          <Svg width={SIZE} height={SIZE}>
            <G>
              {rewards.map((_, i) => createSlice(i))}
              <Circle cx={RADIUS} cy={RADIUS} r={35} fill="#2E2459" />
            </G>
          </Svg>
        </Animated.View>
      </View>

      <Text style={styles.rulesTitle}>Rules to spin the wheel</Text>
      <Text style={styles.rulesText}>Terms & Condition Apply</Text>
      <Text style={styles.rulesText}>
        Customers must place a minimum of 20 orders per month to qualify for
        this promotional incentive.
      </Text>
      <Text style={styles.rulesText}>Can only be used once.</Text>

      <Text style={styles.subText}>Get a chance to win a reward</Text>

      <TouchableOpacity
        style={styles.spinButton}
        onPress={spinWheel}
        disabled={spinning}
      >
        <Text style={styles.spinText}>
          {spinning ? "Spinning..." : "Spin wheel"}
        </Text>
      </TouchableOpacity>

      {/* NAVIGATION */}
      <TouchableOpacity onPress={() => router.push("/screens/Coupons")}>
        <Text style={styles.viewCoupons}>View Coupons</Text>
      </TouchableOpacity>

      <View style={styles.footerCard}>
        <Text style={styles.footerText}>
          We love having you as a customer! To celebrate your 10th order,
          we've activated the Wheel of Prizes just for you. Spin now to
          reveal your exclusive gift.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  wheelContainer: {
    marginVertical: 20,
  },
  pointerWrapper: {
    position: "absolute",
    top: 130,
    zIndex: 10,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 22,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#2E2459",
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
  },
  rulesText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 20,
    marginTop: 5,
  },
  subText: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: "600",
  },
  spinButton: {
    backgroundColor: "#F9D74C",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 20,
    elevation: 4,
  },
  spinText: {
    fontSize: 16,
    fontWeight: "700",
  },
  viewCoupons: {
    marginTop: 15,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  footerCard: {
    marginTop: 30,
    backgroundColor: "#FDB94E",
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    padding: 30,
  },
  footerText: {
    textAlign: "center",
    fontWeight: "600",
  },
});
