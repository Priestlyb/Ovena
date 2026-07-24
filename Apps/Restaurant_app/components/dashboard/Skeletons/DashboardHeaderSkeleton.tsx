// components/dashboard/skeletons/DashboardHeaderSkeleton.tsx

import React from "react";
import { StyleSheet, View } from "react-native";

const Skeleton = ({
  width,
  height,
  radius = 6,
}: {
  width: number | string;
  height: number;
  radius?: number;
}) => (
  <View
    style={[
      skeletonStyles.block,
      {
        width,
        height,
        borderRadius: radius,
      },
    ]}
  />
);

export const DashboardHeaderSkeleton = () => {
  return (
    <View style={styles.header}>
      <View>
        {/* Dashboard */}
        <Skeleton width={170} height={30} radius={8} />

        <View style={{ height: 8 }} />

        {/* Welcome back, User! */}
        <Skeleton width={180} height={14} />
      </View>
    </View>
  );
};

const skeletonStyles = StyleSheet.create({
  block: {
    backgroundColor: "#ECECEC",
  },
});

/**
 * Mirrors the real DashboardScreen styles
 */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 25,
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 16,
  },
});
