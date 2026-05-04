import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import Svg, { G, Path, Circle, Text as SvgText } from "react-native-svg";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/context/AuthContext";

const SIZE = 280;
const RADIUS = SIZE / 2;

const rewards = [
  { label: "₦250 Coupon", color: "#2E2459" },
  { label: "₦1000 Coupon", color: "#F9D74C" },
  { label: "₦500 off next order", color: "#F26722" },
  { label: "Free delivery", color: "#FDB94E" },
  { label: "Free meal (₦5k)", color: "#FFD34E" },
  { label: "Free service", color: "#F44336" },
  { label: "₦1500 Coupon", color: "#8BC34A" },
  { label: "₦2000 Coupon", color: "#1E88A8" },
  { label: "Mask", color: "#FF5252" },
];

const angleStep = (2 * Math.PI) / rewards.length;

export default function SpinWheelScreen() {
  const { accessToken } = useAuth();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0);

  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  /* ================= ANIMATION ================= */

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}rad` }],
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  /* ================= API CALL ================= */

  const spinFromAPI = async () => {
    try {
      const res = await fetch(
        "https://ovena-backend-production.up.railway.app/api/coupon-wheel/spin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!res.ok) {
        const text = await res.text();
        console.log("Spin API error:", text);
        throw new Error("Spin request failed");
      }

      const data = await res.json();
      console.log("Spin result:", data);

      return data;
    } catch (error) {
      console.log("Spin API error:", error);
      return null;
    }
  };

  /* ================= HELPERS ================= */

  const splitText = (text: string) => {
    if (text.length < 12) return [text];
    const words = text.split(" ");
    return [words.slice(0, 2).join(" "), words.slice(2).join(" ")];
  };

  /* ================= SPIN ================= */

  const spinWheel = async () => {
    if (!accessToken) {
      Alert.alert("Login Required", "Please login to spin the wheel.");
      return;
    }

    if (spinning) return;

    setSpinning(true);

    const result = await spinFromAPI();

    if (!result) {
      setSpinning(false);
      return;
    }

    let index = -1;

    if (result.index !== undefined) {
      index = result.index;
    } else if (result.reward) {
      index = rewards.findIndex((r) => r.label === result.reward);
    }

    if (index === -1) {
      setSpinning(false);
      Alert.alert("Error", "Invalid reward returned.");
      return;
    }

    const targetAngle = index * angleStep;

    const finalRotation =
      rotation.value + Math.PI * 6 + (2 * Math.PI - targetAngle);

    rotation.value = withTiming(
      finalRotation,
      { duration: 4000, easing: Easing.out(Easing.cubic) },
      () => runOnJS(showResult)(index),
    );
  };

  const showResult = (index: number) => {
    const reward = rewards[index].label;

    setWinner(reward);
    setSpinning(false);

    scale.value = withTiming(1, { duration: 500 });
  };

  /* ================= SLICE ================= */

  const createSlice = (index: number) => {
    const startAngle = index * angleStep;
    const endAngle = startAngle + angleStep;

    const x1 = RADIUS + RADIUS * Math.cos(startAngle);
    const y1 = RADIUS + RADIUS * Math.sin(startAngle);
    const x2 = RADIUS + RADIUS * Math.cos(endAngle);
    const y2 = RADIUS + RADIUS * Math.sin(endAngle);

    const midAngle = startAngle + angleStep / 2;
    const textX = RADIUS + RADIUS * 0.65 * Math.cos(midAngle);
    const textY = RADIUS + RADIUS * 0.65 * Math.sin(midAngle);
    const rotationDeg = (midAngle * 180) / Math.PI;

    const lines = splitText(rewards[index].label);

    return (
      <G key={index}>
        <Path
          d={`M${RADIUS} ${RADIUS} L${x1} ${y1} A${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2} Z`}
          fill={rewards[index].color}
        />

        {lines.map((line, i) => (
          <SvgText
            key={i}
            x={textX}
            y={textY + i * 12}
            fill="#000"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            transform={`rotate(${rotationDeg}, ${textX}, ${textY})`}
          >
            {line}
          </SvgText>
        ))}
      </G>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/profile")}
          style={styles.backBtn}
        >
          <IconSymbol name="ArrowLeftIcon" size={22} color={"#000"} />
        </TouchableOpacity>

        <Text style={styles.title}>Lucky Spin</Text>
        <View style={{ width: 34 }} />
      </View>

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

      {/* SPIN BUTTON */}
      <TouchableOpacity
        style={styles.spinButton}
        onPress={spinWheel}
        disabled={spinning}
      >
        <Text style={styles.spinText}>
          {spinning ? "Spinning..." : "Spin wheel"}
        </Text>
      </TouchableOpacity>

      {/* RESULT MODAL */}
      <Modal visible={!!winner} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, modalStyle]}>
            <Text style={styles.modalTitle}>🎉 You Won!</Text>
            <Text style={styles.modalReward}>{winner}</Text>

            <TouchableOpacity
              style={styles.claimBtn}
              onPress={() => {
                setWinner(null);
                scale.value = 0;
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Claim Reward</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* RULES */}
      <Text style={styles.rulesTitle}>Rules to spin the wheel</Text>
      <Text style={styles.rulesText}>Terms & Condition Apply</Text>
      <Text style={styles.rulesText}>
        Customers must place a minimum of 20 orders per month to qualify for
        this promotional incentive.
      </Text>
      <Text style={styles.rulesText}>Can only be used once.</Text>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 55,
    backgroundColor: "#fff",
    paddingBottom: 50,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backBtn: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
  spinButton: {
    backgroundColor: "#F9D74C",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 20,
  },
  spinText: {
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  modalReward: {
    fontSize: 18,
    marginVertical: 15,
    fontWeight: "600",
  },
  claimBtn: {
    backgroundColor: "#F9D74C",
    padding: 12,
    borderRadius: 20,
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
});
