import { useState } from "react";
import { Alert } from "react-native";
import {
  useSharedValue,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";

import { rewards, angleStep } from "@/constants/spinWheelConstants";
import { useAuth } from "@/context/AuthContext";

export const useSpinWheel = () => {
  const { accessToken, authStatus } = useAuth();

  const [winner, setWinner] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const rotation = useSharedValue(0);
  const scale = useSharedValue(0);

  const spinWheel = async () => {
    if (spinning) return;

    if (authStatus !== "authenticated") {
      Alert.alert("Login Required", "Only logged in users can spin the wheel.");
      return;
    }

    try {
      setSpinning(true);

      const res = await fetch(
        "https://ovena-backend-production.up.railway.app/api/coupon-wheel/spin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();

      console.log("Spin result:", data);

      const rewardLabel = data.reward;

      const index = rewards.findIndex((r) => r.label === rewardLabel);

      if (index === -1) {
        throw new Error("Invalid reward returned from API");
      }

      animateToIndex(index);
    } catch (err) {
      console.log("Spin error:", err);
      setSpinning(false);
      Alert.alert("Error", "Failed to spin the wheel.");
    }
  };

  const animateToIndex = (index: number) => {
    const sliceCenter = index * angleStep + angleStep / 2;

    const targetRotation =
      rotation.value + Math.PI * 8 + (2 * Math.PI - sliceCenter);

    rotation.value = withTiming(
      targetRotation,
      {
        duration: 4200,
        easing: Easing.out(Easing.cubic),
      },
      () => runOnJS(showResult)(index)
    );
  };

  const showResult = (index: number) => {
    const reward = rewards[index].label;

    setWinner(reward);
    setSpinning(false);

    scale.value = withTiming(1, { duration: 500 });
  };

  return {
    rotation,
    scale,
    spinning,
    winner,
    spinWheel,
  };
};