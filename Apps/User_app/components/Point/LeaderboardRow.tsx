import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { IconSymbol } from "../ui/icon-symbol";
import { useTheme } from "@/constants/theme";

interface LeaderboardRowProps {
  rank: number;
  name: string;
  points: number;
  avatar?: string | null;
  isCurrentUser?: boolean;
  onPress?: () => void;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  rank,
  name,
  points,
  avatar,
  isCurrentUser = false,
  onPress,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const renderRank = () => {
    switch (rank) {
      case 1:
        return <IconSymbol name="TrophyIcon" size={22} color={theme.warning} />;

      case 2:
        return <IconSymbol name="MedalIcon" size={22} color="#9CA3AF" />;

      case 3:
        return <IconSymbol name="Awardicon" size={22} color="#B45309" />;

      default:
        return <Text style={styles.rankText}>{rank}</Text>;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isCurrentUser
            ? theme.primary + "15"
            : theme.surface,
          borderColor: isCurrentUser ? theme.primary : theme.border,
        },
      ]}
    >
      {/* Rank */}
      <View style={styles.rankContainer}>{renderRank()}</View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <IconSymbol
              name="UserOutlineIcon"
              size={20}
              color={theme.textSecondary}
            />
          </View>
        )}
      </View>

      {/* User */}
      <View style={styles.userInfo}>
        <Text numberOfLines={1} style={styles.name}>
          {isCurrentUser ? "You" : name}
        </Text>

        {isCurrentUser && (
          <Text style={styles.youLabel}>Current Position</Text>
        )}
      </View>

      {/* Points */}
      <View style={styles.pointsContainer}>
        <Text style={styles.points}>{points.toLocaleString()}</Text>

        <Text style={styles.pointsLabel}>pts</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LeaderboardRow;

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 16,
      marginBottom: 12,
      padding: 14,
      borderRadius: 18,
      borderWidth: 1,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },

    rankContainer: {
      width: 36,
      alignItems: "center",
      justifyContent: "center",
    },

    rankText: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    avatarContainer: {
      marginHorizontal: 12,
    },

    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
    },

    avatarPlaceholder: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },

    userInfo: {
      flex: 1,
      justifyContent: "center",
    },

    name: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    youLabel: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "600",
      color: theme.primary,
    },

    pointsContainer: {
      alignItems: "flex-end",
    },

    points: {
      fontSize: 18,
      fontWeight: "800",
      color: theme.textPrimary,
    },

    pointsLabel: {
      marginTop: 2,
      fontSize: 12,
      fontWeight: "500",
      color: theme.textSecondary,
      opacity: 0.8,
    },
  });