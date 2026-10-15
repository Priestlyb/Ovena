// app/screens/pointsWithdrawalsHistory.tsx

import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useWithdrawalHistory } from "@/hooks/points/useWithdrawalHistory";

import { useTheme, ThemeColors } from "@/constants/theme";

export default function PointsWithdrawalsHistoryScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const {
    data: withdrawals = [],
    isLoading,
    isFetching,
    refetch,
    error,
  } = useWithdrawalHistory();

  const formatDate = (date: string | null) => {
    if (!date) return "Awaiting review";

    return new Date(date).toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return theme.success;

      case "pending":
        return theme.warning;

      case "rejected":
        return theme.error;

      default:
        return theme.textSecondary;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <IconSymbol name="TriangleAlerticon" size={48} color={theme.primary} />

        <Text style={styles.errorTitle}>Couldn't load withdrawal history</Text>

        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="ArrowLeftIcon" size={22} color={theme.icon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Withdrawal History</Text>

        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={withdrawals}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            flexGrow: withdrawals.length === 0 ? 1 : undefined,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <IconSymbol name="CoinsIcon" size={34} color={theme.primary} />
            </View>

            <Text style={styles.emptyTitle}>No Withdrawal Requests</Text>

            <Text style={styles.emptySubtitle}>
              When you request to withdraw your reward points, the request will
              appear here along with its current status.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const statusColor = getStatusColor(item.status);

          return (
            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.pointsRow}>
                  <View style={styles.pointsIcon}>
                    <IconSymbol
                      name="CoinsIcon"
                      size={22}
                      color={theme.primary}
                    />
                  </View>

                  <View>
                    <Text style={styles.points}>
                      {item.points_requested.toLocaleString()} Points
                    </Text>

                    <Text style={styles.label}>Withdrawal Request</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: statusColor + "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color: statusColor,
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.info}>
                <Text style={styles.infoLabel}>Requested</Text>

                <Text style={styles.infoValue}>
                  {formatDate(item.requested_at)}
                </Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.infoLabel}>Resolved</Text>

                <Text style={styles.infoValue}>
                  {formatDate(item.resolved_at)}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 60,
      backgroundColor: theme.background,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
      paddingHorizontal: 24,
    },

    content: {
      padding: 20,
      paddingBottom: 40,
    },

    header: {
      height: 72,
      backgroundColor: theme.background,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
    },

    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    headerTitle: {
      fontSize: 21,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    card: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 18,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,

      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 4,
      },

      elevation: 2,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    pointsRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      paddingRight: 12,
    },

    pointsIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },

    points: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    label: {
      marginTop: 4,
      fontSize: 13,
      color: theme.textSecondary,
    },

    badge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 50,
    },

    badgeText: {
      fontSize: 12,
      fontWeight: "700",
      textTransform: "capitalize",
    },

    info: {
      marginTop: 18,
    },

    infoLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 4,
    },

    infoValue: {
      fontSize: 15,
      color: theme.textPrimary,
      fontWeight: "500",
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 28,
    },

    emptyIcon: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: theme.warning + "40",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },

    emptyTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: 10,
    },

    emptySubtitle: {
      textAlign: "center",
      fontSize: 15,
      lineHeight: 22,
      color: theme.textSecondary,
    },

    errorTitle: {
      marginTop: 20,
      marginBottom: 24,
      fontSize: 18,
      fontWeight: "600",
      color: theme.textPrimary,
      textAlign: "center",
    },

    retryButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 26,
      paddingVertical: 14,
      borderRadius: 12,
    },

    retryText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },
  });
