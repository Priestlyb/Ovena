import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "../ui/icon-symbol";
import { useTheme } from "@/constants/theme";

interface HeroCardProps {
  points: number;
  rank: number;
  totalUsers?: number;
  onWithdraw: () => void;
  withdrawing?: boolean;
}

const HeroCard: React.FC<HeroCardProps> = ({
  points,
  rank,
  totalUsers,
  onWithdraw,
  withdrawing = false,
}) => {
  const theme = useTheme();

  const canWithdraw = points > 0 && !withdrawing;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.primary,
          shadowColor: theme.textPrimary,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <IconSymbol name="StarIcon" size={20} color="#FFFFFF" />

          <Text style={styles.title}>Reward Points</Text>
        </View>

        <IconSymbol name="Awardicon" size={24} color="#FFFFFF" />
      </View>

      {/* Points */}
      <View style={styles.pointRow}>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{points.toLocaleString()}</Text>

          <Text style={styles.subtitle}>Available Points</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.withdrawBtn,
            {
              backgroundColor: theme.warning,
            },
            !canWithdraw && styles.withdrawBtnDisabled,
          ]}
          onPress={onWithdraw}
          disabled={!canWithdraw}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.withdrawText,
              {
                color: theme.textPrimary,
              },
            ]}
          >
            Withdraw
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <IconSymbol name="TrophyIcon" size={18} color="#FFFFFF" />

          <Text style={styles.statValue}>#{rank}</Text>

          <Text style={styles.statLabel}>Your Rank</Text>
        </View>

        {typeof totalUsers === "number" && (
          <>
            <View style={styles.verticalDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {totalUsers.toLocaleString()}
              </Text>

              <Text style={styles.statLabel}>Participants</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default HeroCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 24,
    padding: 22,

    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    marginLeft: 8,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  pointRow: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pointsContainer: {
    flex: 1,
    marginRight: 16,
  },

  points: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 6,
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
  },

  withdrawBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  withdrawBtnDisabled: {
    opacity: 0.5,
  },

  withdrawText: {
    fontSize: 16,
    fontWeight: "700",
  },

  divider: {
    marginVertical: 22,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  stats: {
    flexDirection: "row",
    alignItems: "center",
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    marginTop: 8,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  statLabel: {
    marginTop: 4,
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "500",
  },

  verticalDivider: {
    width: 1,
    height: 55,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
});
