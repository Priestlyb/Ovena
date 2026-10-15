// app/screens/pointHistory.tsx

import React, { useEffect, useMemo } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/theme";

import EmptyPointHistory from "@/components/pointHistory/EmptyPointHistory";
import PointHistorySection from "@/components/pointHistory/PointHistorySection";
import PointHistorySkeleton from "@/components/pointHistory/PointHistorySkeleton";

import {
  PointsHistoryItem,
  usePointsHistory,
} from "@/hooks/points/usePointsHistory";

export default function PointHistoryScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const {
    data: history = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = usePointsHistory();

  useEffect(() => {
    // console.log(history);
  }, [history]);

  const getSectionTitle = (dateString: string) => {
    const date = new Date(dateString);

    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (first: Date, second: Date) =>
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate();

    if (isSameDay(date, today)) return "Today";

    if (isSameDay(date, yesterday)) return "Yesterday";

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const groupedHistory = useMemo(() => {
    const grouped: Record<string, PointsHistoryItem[]> = {};

    history.forEach((item) => {
      const title = getSectionTitle(item.created_at);

      if (!grouped[title]) {
        grouped[title] = [];
      }

      grouped[title].push(item);
    });

    return Object.entries(grouped).map(([title, items]) => ({
      title,
      items,
    }));
  }, [history]);

  if (isLoading) {
    return <PointHistorySkeleton />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Failed to load point history.</Text>

        <TouchableOpacity onPress={() => refetch()}>
          <Text style={styles.retry}>Tap to Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!history.length) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <IconSymbol
              name="ArrowLeftIcon"
              size={22}
              color={theme.textPrimary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Point History</Text>

          <View style={{ width: 42 }} />
        </View>

        <EmptyPointHistory />
      </View>
    );
  }

  const renderHeader = () => (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol
            name="ArrowLeftIcon"
            size={22}
            color={theme.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Point History</Text>

        <View style={{ width: 42 }} />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Activities</Text>

        <Text style={styles.summaryValue}>{history.length}</Text>
      </View>
    </>
  );

  return (
    <FlatList
      data={groupedHistory}
      keyExtractor={(item) => item.title}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <PointHistorySection title={item.title} items={item.items} />
      )}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={[theme.primary]}
          tintColor={theme.primary}
        />
      }
    />
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 60,
    },

    content: {
      paddingBottom: 40,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
      paddingHorizontal: 24,
    },

    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      marginBottom: 24,
    },

    backButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      alignItems: "center",
      justifyContent: "center",
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    summaryCard: {
      marginHorizontal: 16,
      marginBottom: 28,
      borderRadius: 20,
      backgroundColor: theme.surface,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },

    summaryTitle: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: "500",
    },

    summaryValue: {
      marginTop: 8,
      fontSize: 34,
      fontWeight: "800",
      color: theme.primary,
    },

    error: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.error,
      textAlign: "center",
    },

    retry: {
      marginTop: 20,
      fontSize: 16,
      fontWeight: "700",
      color: theme.primary,
    },
  });
