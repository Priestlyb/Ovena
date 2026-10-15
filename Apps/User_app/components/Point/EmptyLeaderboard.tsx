import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../ui/icon-symbol";

const COLORS = {
  primary: "#FF6B00",
  secondary: "#0E0E10",
  background: "#FFFFFF",
  surface: "#F7F7F7",
  textPrimary: "#111111",
  textSecondary: "#6B6B6B",
  icon: "#1C1C1E",
  border: "#E5E5EA",
  success: "#2ECC71",
  warning: "#F1C40F",
  error: "#E74C3C",
  transparent: "transparent",
};

interface EmptyLeaderboardProps {
  onEarnPoints?: () => void;
}

const EmptyLeaderboard: React.FC<EmptyLeaderboardProps> = ({
  onEarnPoints,
}) => {
  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <IconSymbol name="TrophyIcon" size={42} color={COLORS.primary} />

        <View style={styles.giftBadge}>
          <IconSymbol name="GiftIcon" size={16} color="#FFF" />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>No Leaderboard Yet</Text>

      {/* Description */}
      <Text style={styles.description}>
        Start earning reward points from your orders and you'll appear on the
        leaderboard. Keep ordering to climb the rankings and unlock exciting
        rewards.
      </Text>

      {/* CTA */}
      {onEarnPoints && (
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.button}
          onPress={onEarnPoints}
        >
          <Text style={styles.buttonText}>Start Earning Points</Text>

          <IconSymbol name="ArrowRightIcon" size={18} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyLeaderboard;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 70,
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFF4EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },

  giftBadge: {
    position: "absolute",
    bottom: 10,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
    marginRight: 8,
  },
});
