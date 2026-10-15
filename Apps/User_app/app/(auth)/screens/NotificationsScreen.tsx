import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { useTheme, ThemeColors } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";

import { Notification, NotificationType } from "@/services/notificationService";

import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/useNotifications";

export default function NotificationsScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  /* ======================================================
     NOTIFICATIONS QUERY
  ====================================================== */

  const { data, isLoading, isError, error, isRefetching, refetch } =
    useNotifications(100, 0);

  /* ======================================================
     MUTATIONS
  ====================================================== */

  const markNotificationAsRead = useMarkNotificationAsRead();

  const markAllNotificationsAsRead = useMarkAllNotificationsAsRead();

  /* ======================================================
     DATA
  ====================================================== */

  const notifications = data?.results ?? [];

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications],
  );

  /* ======================================================
     MARK ONE AS READ
  ====================================================== */

  const handleNotificationPress = (notification: Notification) => {
    if (notification.is_read) {
      return;
    }

    markNotificationAsRead.mutate(notification.id);
  };

  /* ======================================================
     MARK ALL AS READ
  ====================================================== */

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) {
      return;
    }

    markAllNotificationsAsRead.mutate();
  };

  /* ======================================================
     REFRESH
  ====================================================== */

  const handleRefresh = () => {
    refetch();
  };

  /* ======================================================
     NOTIFICATION ICON
  ====================================================== */

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "order":
        return {
          name: "OrderIcon" as const,
          color: theme.primary,
        };

      case "promotion":
        return {
          name: "TagIcon" as const,
          color: theme.warning,
        };

      case "reward":
        return {
          name: "Awardicon" as const,
          color: theme.success,
        };

      case "system":
        return {
          name: "InfoCircleIcon" as const,
          color: theme.secondary,
        };

      case "generic":
      default:
        return {
          name: "BellIcon" as const,
          color: theme.primary,
        };
    }
  };

  /* ======================================================
     FORMAT DATE
  ====================================================== */

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const now = new Date();

    const difference = now.getTime() - date.getTime();

    const seconds = Math.floor(difference / 1000);

    const minutes = Math.floor(seconds / 60);

    const hours = Math.floor(minutes / 60);

    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    if (days < 7) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  /* ======================================================
     RENDER NOTIFICATION
  ====================================================== */

  const renderNotification = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.notification_type);

    return (
      <Pressable
        onPress={() => handleNotificationPress(item)}
        disabled={markNotificationAsRead.isPending}
        style={({ pressed }) => [
          styles.notificationCard,
          !item.is_read && styles.unreadCard,
          pressed && styles.pressed,
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: `${icon.color}15`,
            },
          ]}
        >
          <IconSymbol name={icon.name} size={21} color={icon.color} />
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.titleRow}>
            <Text
              numberOfLines={2}
              style={[
                styles.notificationTitle,
                !item.is_read && styles.unreadTitle,
              ]}
            >
              {item.title}
            </Text>

            {!item.is_read && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.notificationMessage}>{item.body}</Text>

          <Text style={styles.notificationTime}>
            {formatNotificationDate(item.created_at)}
          </Text>
        </View>
      </Pressable>
    );
  };

  /* ======================================================
     EMPTY STATE
  ====================================================== */

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <IconSymbol name="BellIcon" size={42} color={theme.primary} />
      </View>

      <Text style={styles.emptyTitle}>No notifications yet</Text>

      <Text style={styles.emptyMessage}>
        We'll let you know about your orders, rewards, offers, and other
        important updates here.
      </Text>
    </View>
  );

  /* ======================================================
     ERROR STATE
  ====================================================== */

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconContainer,
          {
            backgroundColor: `${theme.error}15`,
          },
        ]}
      >
        <IconSymbol name="InfoCircleIcon" size={42} color={theme.error} />
      </View>

      <Text style={styles.emptyTitle}>Couldn't load notifications</Text>

      <Text style={styles.emptyMessage}>
        Something went wrong while loading your notifications. Please try again.
      </Text>

      <Pressable onPress={() => refetch()} style={styles.retryButton}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </Pressable>

      {__DEV__ && error && (
        <Text style={styles.errorDebugText}>
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      )}
    </View>
  );

  /* ======================================================
     LOADING STATE
  ====================================================== */

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.headerButton}
          >
            <IconSymbol
              name="ArrowLeftIcon"
              size={22}
              color={theme.textPrimary}
            />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.primary} />

          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </View>
    );
  }

  /* ======================================================
     MAIN UI
  ====================================================== */

  return (
    <View style={styles.container}>
      {/* =========================
          HEADER
      ========================= */}

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.headerButton}
        >
          <IconSymbol
            name="ArrowLeftIcon"
            size={22}
            color={theme.textPrimary}
          />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Notifications</Text>

          {unreadCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </View>

        {unreadCount > 0 ? (
          <Pressable
            onPress={handleMarkAllAsRead}
            disabled={markAllNotificationsAsRead.isPending}
            hitSlop={8}
            style={styles.markAllButton}
          >
            {markAllNotificationsAsRead.isPending ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Text style={styles.markAllText}>Read all</Text>
            )}
          </Pressable>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {/* =========================
          ERROR
      ========================= */}

      {isError ? (
        renderErrorState()
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderNotification}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            notifications.length === 0 && styles.emptyListContent,
          ]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
        />
      )}
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

    /* =========================
       HEADER
    ========================= */

    header: {
      minHeight: 64,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
    },

    headerButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
    },

    headerTitleContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    countBadge: {
      minWidth: 22,
      height: 22,
      paddingHorizontal: 6,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },

    countText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#FFFFFF",
    },

    markAllButton: {
      minWidth: 58,
      minHeight: 32,
      alignItems: "flex-end",
      justifyContent: "center",
    },

    markAllText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.primary,
    },

    headerSpacer: {
      width: 58,
    },

    /* =========================
       LIST
    ========================= */

    listContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
    },

    separator: {
      height: 12,
    },

    notificationCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },

    unreadCard: {
      borderColor: `${theme.primary}35`,
      backgroundColor: theme.mode === "dark" ? "#241915" : "#FFF8F5",
    },

    pressed: {
      opacity: 0.7,
    },

    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    notificationContent: {
      flex: 1,
      minWidth: 0,
    },

    titleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 5,
    },

    notificationTitle: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: theme.textPrimary,
    },

    unreadTitle: {
      fontWeight: "700",
    },

    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.primary,
      marginLeft: 8,
      marginTop: 5,
    },

    notificationMessage: {
      fontSize: 13,
      lineHeight: 19,
      color: theme.textSecondary,
    },

    notificationTime: {
      marginTop: 8,
      fontSize: 11,
      color: theme.textSecondary,
    },

    /* =========================
       LOADING
    ========================= */

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },

    loadingText: {
      marginTop: 12,
      fontSize: 13,
      color: theme.textSecondary,
    },

    /* =========================
       EMPTY / ERROR
    ========================= */

    emptyListContent: {
      flexGrow: 1,
    },

    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },

    emptyIconContainer: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${theme.primary}15`,
      marginBottom: 20,
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
      textAlign: "center",
      marginBottom: 8,
    },

    emptyMessage: {
      fontSize: 13,
      lineHeight: 20,
      color: theme.textSecondary,
      textAlign: "center",
      maxWidth: 310,
    },

    retryButton: {
      marginTop: 20,
      minHeight: 44,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },

    retryButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#FFFFFF",
    },

    errorDebugText: {
      marginTop: 16,
      fontSize: 11,
      color: theme.error,
      textAlign: "center",
    },
  });
