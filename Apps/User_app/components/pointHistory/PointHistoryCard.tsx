// components/pointHistory/PointHistoryCard.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme, ThemeColors } from "@/constants/theme";

export interface PointHistoryCardProps {
  eventType: string;
  points: number;
  balanceAfter: number;
  createdAt: string;
  notes?: string;
}

const PointHistoryCard: React.FC<PointHistoryCardProps> = ({
  eventType,
  points,
  balanceAfter,
  createdAt,
  notes,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const isPositive = points >= 0;

  const getTitle = () => {
    switch (eventType) {
      case "referral_success":
        return "Referral Reward";

      case "order_completed":
        return "Order Reward";

      case "signup_bonus":
        return "Welcome Bonus";

      case "purchase_reward":
        return "Purchase Reward";

      case "coupon_redeemed":
        return "Coupon Redemption";

      case "manual_adjustment":
        return "Points Adjustment";

      default:
        return eventType
          .replace(/_/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }
  };

  const getSubtitle = () => {
    if (notes?.trim()) {
      return notes;
    }

    switch (eventType) {
      case "referral_success":
        return "You earned points from a successful referral.";

      case "order_completed":
        return "Points earned from your completed order.";

      case "signup_bonus":
        return "Welcome reward.";

      case "purchase_reward":
        return "Reward earned from your purchase.";

      case "coupon_redeemed":
        return "Points redeemed successfully.";

      case "manual_adjustment":
        return "Your balance was adjusted.";

      default:
        return "Reward activity";
    }
  };

  const getIcon = () => {
    switch (eventType) {
      case "referral_success":
        return "UserIcon";

      case "order_completed":
        return "ShoppingbasketIcon";

      case "signup_bonus":
        return "GiftIcon";

      case "purchase_reward":
        return "StarIcon";

      case "coupon_redeemed":
        return "TicketIcon";

      default:
        return "StarIcon";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <IconSymbol name={getIcon()} size={20} color={theme.primary} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{getTitle()}</Text>

          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        <Text
          style={[
            styles.points,
            {
              color: isPositive ? theme.success : theme.error,
            },
          ]}
        >
          {isPositive ? "+" : ""}
          {points.toLocaleString()}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.bottomLabel}>Balance</Text>

          <Text style={styles.bottomValue}>
            {balanceAfter.toLocaleString()} pts
          </Text>
        </View>

        <Text style={styles.date}>{formatDate(createdAt)}</Text>
      </View>
    </View>
  );
};

export default PointHistoryCard;

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 14,
    },

    topRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },

    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "#FFF3E8",
      justifyContent: "center",
      alignItems: "center",
    },

    content: {
      flex: 1,
      marginHorizontal: 14,
      paddingRight: 10,
    },

    title: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    subtitle: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 18,
      color: theme.textSecondary,
    },

    points: {
      fontSize: 22,
      fontWeight: "800",
      textAlign: "right",
      minWidth: 70,
    },

    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 16,
    },

    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },

    bottomLabel: {
      fontSize: 12,
      color: theme.textSecondary,
    },

    bottomValue: {
      marginTop: 4,
      fontSize: 15,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    date: {
      flexShrink: 1,
      textAlign: "right",
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 18,
      marginLeft: 16,
    },
  });
