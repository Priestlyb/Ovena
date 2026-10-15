import React, { useEffect, useState } from "react";
import {
  View,
  Text,
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
import { createStyles } from "@/constants/styles/spinWheelStyles";
import { useTheme } from "@/constants/theme";

import { useSpinWheel } from "@/hooks/spinTheWheel/useSpinWheel";
import { useWheelInfo } from "@/hooks/spinTheWheel/useWheelInfo";

const SIZE = 280;
const RADIUS = SIZE / 2;

const wheelTheme = [
  { bg: "#2E2459", text: "#FFFFFF" },
  { bg: "#F9D74C", text: "#000000" },
  { bg: "#F26722", text: "#FFFFFF" },
  { bg: "#FDB94E", text: "#000000" },
  { bg: "#FFD34E", text: "#000000" },
  { bg: "#F44336", text: "#FFFFFF" },
  { bg: "#8BC34A", text: "#000000" },
  { bg: "#1E88A8", text: "#FFFFFF" },
  { bg: "#FF5252", text: "#FFFFFF" },
];

interface WheelReward {
  id: number;
  label: string;
  color: string;
  textColor: string;
  coupon: any;
}

export default function SpinWheelScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const rotation = useSharedValue(0);
  const scale = useSharedValue(0);

  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  /* =========================
     API HOOKS
  ========================= */

  const { spinWheel: spinWheelAPI, loading, error } = useSpinWheel();

  const {
    getWheelInfo,
    data: wheelData,
    error: wheelError,
    loading: wheelLoading,
  } = useWheelInfo();

  const rewards: WheelReward[] = (wheelData?.coupons || []).map(
    (coupon: any, index: number) => ({
      id: coupon.id,
      label: coupon.code || `${coupon.discount_value}% OFF`,
      color: wheelTheme[index % wheelTheme.length].bg,
      textColor: wheelTheme[index % wheelTheme.length].text,
      coupon,
    }),
  );

  const angleStep = rewards.length > 0 ? (2 * Math.PI) / rewards.length : 0;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}rad`,
      },
    ],
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
    ],
    opacity: scale.value,
  }));

  useEffect(() => {
    (async () => {
      await getWheelInfo({
        unused: true,
      });

      console.log("[WHEEL INFO ERROR]:", wheelError);
    })();
  }, []);

  const splitText = (text: string) => {
    if (text.length < 12) {
      return [text];
    }

    const words = text.split(" ");

    return [words.slice(0, 2).join(" "), words.slice(2).join(" ")];
  };

  const showResult = (index: number) => {
    const coupon = rewards[index]?.coupon;

    setWinner(
      coupon?.description ||
        coupon?.code ||
        `${coupon?.discount_value}% OFF` ||
        "Reward",
    );

    setSpinning(false);

    scale.value = withTiming(1, {
      duration: 500,
    });
  };

  const spinWheel = async () => {
    if (spinning || loading) {
      console.log("[SPIN BLOCKED]");
      return;
    }

    if (!wheelData?.coupons?.length) {
      Alert.alert("Error", "Wheel rewards not loaded");
      return;
    }

    setSpinning(true);

    try {
      const result = await spinWheelAPI();

      if (!result) {
        setSpinning(false);

        Alert.alert("Error", error || "No active wheel or request failed");

        return;
      }

      const couponId = result?.coupon?.id;

      const index = rewards.findIndex((reward) => reward.id === couponId);

      if (index === -1) {
        console.log("[SPIN MAPPING FAILED]");
        console.log("[AVAILABLE REWARDS]:", rewards);

        setSpinning(false);

        Alert.alert(
          "Error",
          "Backend returned a coupon not found on the wheel",
        );

        return;
      }

      const targetAngle = index * angleStep + angleStep / 2;

      const finalRotation =
        rotation.value + Math.PI * 8 + (2 * Math.PI - targetAngle);

      rotation.value = withTiming(
        finalRotation,
        {
          duration: 4000,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished) {
            runOnJS(showResult)(index);
          }
        },
      );
    } catch (err: any) {
      console.log("[SPIN UNEXPECTED ERROR]:", err);

      setSpinning(false);

      Alert.alert(
        "Error",
        err?.response?.data?.detail || "Unexpected error occurred",
      );
    }
  };

  const createSlice = (index: number) => {
    const reward = rewards[index];

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

    const lines = splitText(reward.label);

    return (
      <G key={reward.id}>
        <Path
          d={`M${RADIUS} ${RADIUS} L${x1} ${y1} A${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2} Z`}
          fill={reward.color}
          stroke={theme.border}
          strokeWidth={3}
        />

        {lines.map((line, i) => (
          <SvgText
            key={i}
            x={textX}
            y={textY + i * 12}
            fill={reward.textColor}
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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/profile")}
          style={styles.backBtn}
        >
          <IconSymbol
            name="ArrowLeftIcon"
            size={22}
            color={theme.textPrimary}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          Lucky Spin
        </Text>

        <View style={{ width: 44 }} />
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
              {rewards.length > 0 && rewards.map((_, i) => createSlice(i))}

              <Circle
                cx={RADIUS}
                cy={RADIUS}
                r={35}
                fill={theme.textPrimary}
                stroke={theme.background}
                strokeWidth={5}
              />
            </G>
          </Svg>
        </Animated.View>
      </View>

      {/* RULES */}

      <Text
        style={[
          styles.rulesTitle,
          {
            color: theme.textPrimary,
          },
        ]}
      >
        Rules to spin the wheel
      </Text>

      <Text
        style={[
          styles.rulesText,
          {
            color: theme.textSecondary,
          },
        ]}
      >
        Terms & Conditions Apply
      </Text>

      <Text
        style={[
          styles.rulesText,
          {
            color: theme.textSecondary,
          },
        ]}
      >
        Customers must place a minimum of 20 orders per month to qualify for
        this promotional incentive. Can only be used once.
      </Text>

      <Text
        style={[
          styles.rulesText,
          {
            color: theme.textSecondary,
          },
        ]}
      >
        Get a chance to win a reward.
      </Text>

      {/* SPIN BUTTON */}

      <TouchableOpacity
        style={[
          styles.spinButton,
          (spinning || loading || wheelLoading || rewards.length === 0) && {
            opacity: 0.6,
          },
        ]}
        onPress={spinWheel}
        disabled={spinning || loading || wheelLoading || rewards.length === 0}
      >
        <Text style={styles.spinText}>
          {spinning || loading ? "Spinning..." : "Spin Wheel"}
        </Text>
      </TouchableOpacity>

      {/* VIEW COUPONS */}

      <TouchableOpacity
        onPress={() => router.push("/(auth)/screens/CouponsList")}
      >
        <Text
          style={[
            styles.viewCouponsText,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          View Coupons
        </Text>
      </TouchableOpacity>

      {/* NOTE */}

      <View style={styles.couponNote}>
        <Text style={styles.couponNoteText}>
          We love having you as a customer! To celebrate your 20th order, we've
          activated the Wheel of Prizes just for you. Spin now to reveal your
          exclusive gift.
        </Text>
      </View>

      {/* RESULT MODAL */}

      <Modal visible={!!winner} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, modalStyle]}>
            <Text style={styles.modalTitle}>🎉 You Won!</Text>

            <Text style={styles.modalReward}>{winner}</Text>

            <TouchableOpacity
              style={styles.claimBtn}
              activeOpacity={0.85}
              onPress={() => {
                setWinner(null);
                scale.value = 0;
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                Claim Reward
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
}
