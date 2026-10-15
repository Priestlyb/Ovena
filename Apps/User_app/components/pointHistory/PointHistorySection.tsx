// components/pointHistory/PointHistorySection.tsx

import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme, ThemeColors } from "@/constants/theme";

import PointHistoryCard from "./PointHistoryCard";

export interface PointHistoryItem {
  id: string;
  event_type: string;
  points: number;
  balance_after: number;
  proof_type: string;
  proof_object_id: string;
  notes: string;
  created_at: string;
}

interface PointHistorySectionProps {
  title: string;
  items: PointHistoryItem[];
}

const PointHistorySection: React.FC<PointHistorySectionProps> = ({
  title,
  items,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  if (!items.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {title}
        </Text>

        <View style={styles.line} />
      </View>

      {/* Transactions */}
      {items.map((item) => (
        <PointHistoryCard
          key={item.id}
          eventType={item.event_type}
          points={item.points}
          balanceAfter={item.balance_after}
          createdAt={item.created_at}
          notes={item.notes}
        />
      ))}
    </View>
  );
};

export default PointHistorySection;


const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 24,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 14,
    },

    title: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    line: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
      marginLeft: 14,
    },
  });