// components/pointHistory/PointHistorySkeleton.tsx

import React from "react";
import { StyleSheet, View } from "react-native";

import { useTheme, ThemeColors } from "@/constants/theme";

interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  radius?: number;
}

const Skeleton = ({ width, height, radius = 8 }: SkeletonProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: radius,
        },
      ]}
    />
  );
};

const TransactionSkeleton = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Skeleton width={48} height={48} radius={24} />

        <View style={styles.content}>
          <Skeleton width={"65%"} height={16} />

          <View style={{ height: 8 }} />

          <Skeleton width={"90%"} height={12} />
        </View>

        <Skeleton width={55} height={22} />
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View>
          <Skeleton width={60} height={12} />

          <View style={{ height: 6 }} />

          <Skeleton width={90} height={16} />
        </View>

        <Skeleton width={95} height={12} />
      </View>
    </View>
  );
};

export default function PointHistorySkeleton() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Skeleton width={42} height={42} radius={21} />

        <Skeleton width={170} height={28} />

        <View style={{ width: 42 }} />
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Skeleton width={100} height={14} />

        <View style={{ height: 14 }} />

        <Skeleton width={80} height={34} />
      </View>

      {/* Section 1 */}
      <View style={styles.sectionHeader}>
        <Skeleton width={80} height={18} />

        <View style={styles.line} />
      </View>

      <TransactionSkeleton />
      <TransactionSkeleton />

      {/* Section 2 */}
      <View style={styles.sectionHeader}>
        <Skeleton width={120} height={18} />

        <View style={styles.line} />
      </View>

      <TransactionSkeleton />
      <TransactionSkeleton />
      <TransactionSkeleton />
    </View>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 60,
    },

    skeleton: {
      backgroundColor: theme.surface,
      opacity: 0.8,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      marginBottom: 24,
    },

    summaryCard: {
      marginHorizontal: 20,
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 20,
      marginBottom: 30,
      borderWidth: 1,
      borderColor: theme.border,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 16,
    },

    line: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
      marginLeft: 14,
    },

    card: {
      marginHorizontal: 16,
      marginBottom: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      padding: 16,
    },

    topRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    content: {
      flex: 1,
      marginHorizontal: 14,
    },

    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 16,
    },

    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
