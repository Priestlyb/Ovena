import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ThemeColors, useTheme } from "@/constants/theme";

const Skeleton = ({
  width,
  height,
  radius = 8,
  theme,
}: {
  width: ViewStyle["width"];
  height: number;
  radius?: number;
  theme: ThemeColors;
}) => (
  <View
    style={{
      width,
      height,
      borderRadius: radius,
      backgroundColor: theme.surface,
    }}
  />
);

const LeaderboardRowSkeleton = ({ theme }: { theme: ThemeColors }) => {
  const styles = createStyles(theme);

  return (
    <View style={styles.row}>
      <Skeleton width={24} height={24} radius={12} theme={theme} />

      <Skeleton width={52} height={52} radius={26} theme={theme} />

      <View style={{ flex: 1 }}>
        <Skeleton width="70%" height={14} theme={theme} />

        <View style={{ height: 8 }} />

        <Skeleton width="35%" height={12} theme={theme} />
      </View>

      <Skeleton width={60} height={18} theme={theme} />
    </View>
  );
};

const PodiumSkeleton = ({ theme }: { theme: ThemeColors }) => {
  const styles = createStyles(theme);

  return (
    <View style={styles.podiumContainer}>
      <View style={[styles.podiumColumn, { marginTop: 40 }]}>
        <Skeleton width={60} height={60} radius={30} theme={theme} />

        <View style={{ height: 10 }} />

        <Skeleton width={70} height={12} theme={theme} />

        <View style={{ height: 6 }} />

        <Skeleton width={50} height={12} theme={theme} />

        <View style={{ height: 12 }} />

        <Skeleton width={80} height={60} radius={16} theme={theme} />
      </View>

      <View style={styles.podiumColumn}>
        <Skeleton width={70} height={70} radius={35} theme={theme} />

        <View style={{ height: 10 }} />

        <Skeleton width={80} height={14} theme={theme} />

        <View style={{ height: 6 }} />

        <Skeleton width={60} height={12} theme={theme} />

        <View style={{ height: 12 }} />

        <Skeleton width={90} height={95} radius={18} theme={theme} />
      </View>

      <View style={[styles.podiumColumn, { marginTop: 40 }]}>
        <Skeleton width={60} height={60} radius={30} theme={theme} />

        <View style={{ height: 10 }} />

        <Skeleton width={70} height={12} theme={theme} />

        <View style={{ height: 6 }} />

        <Skeleton width={50} height={12} theme={theme} />

        <View style={{ height: 12 }} />

        <Skeleton width={80} height={50} radius={16} theme={theme} />
      </View>
    </View>
  );
};

const LeaderboardSkeleton = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Hero Card */}
      <View style={styles.hero}>
        <Skeleton width={120} height={18} theme={theme} />

        <View style={{ height: 24 }} />

        <Skeleton width={180} height={42} theme={theme} />

        <View style={{ height: 12 }} />

        <Skeleton width={120} height={16} theme={theme} />

        <View style={{ height: 30 }} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Skeleton width={80} height={40} theme={theme} />

          <Skeleton width={80} height={40} theme={theme} />
        </View>
      </View>

      {/* Podium */}
      <PodiumSkeleton theme={theme} />

      {/* Leaderboard Rows */}
      <View style={{ marginTop: 10 }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <LeaderboardRowSkeleton key={index} theme={theme} />
        ))}
      </View>
    </View>
  );
};

export default LeaderboardSkeleton;

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 60,
      backgroundColor: theme.background,
    },

    hero: {
      marginHorizontal: 16,
      marginTop: 20,
      padding: 22,
      borderRadius: 24,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },

    podiumContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingHorizontal: 20,
      marginTop: 30,
      marginBottom: 30,
    },

    podiumColumn: {
      flex: 1,
      alignItems: "center",
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 16,
      marginBottom: 12,
      padding: 14,
      borderRadius: 18,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 14,
    },
  });
