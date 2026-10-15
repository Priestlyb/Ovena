// NotificationsListPage.tsx

import { Divider } from "@/components/atoms/Divider";
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { Header } from "@/components/molecules/Header";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { styles } from "@/constants/styles";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "@/hooks/useNotifications";
import {
  BusinessNotification,
  getCurrentNotificationToken,
  getNotificationsEnabled,
  getStoredNotificationToken,
  NotificationType,
  setNotificationsEnabled,
  setupNotifications,
  unregisterDevice
} from "@/services/notificationService";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Award,
  Bell,
  CheckCheck,
  ChevronRight,
  Copy,
  Info,
  Megaphone,
  Package,
  RefreshCw,
  Tag,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";

export default function NotificationsListPage() {
  const router = useRouter();

  // ----------------------
  // NOTIFICATION SETTINGS
  // ----------------------

  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(true);

  const [isNotificationSettingLoading, setIsNotificationSettingLoading] =
    useState(true);

  const [isNotificationSettingUpdating, setIsNotificationSettingUpdating] =
    useState(false);

  // ----------------------
  // FCM DEBUG TOKEN
  // ----------------------

  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isFcmTokenLoading, setIsFcmTokenLoading] = useState(true);
  const [isFcmTokenCopied, setIsFcmTokenCopied] = useState(false);

  // ----------------------
  // LOAD NOTIFICATION SETTING
  // ----------------------

  useEffect(() => {
    let mounted = true;

    const loadNotificationSetting = async () => {
      try {
        const savedPreference = await getNotificationsEnabled();

        if (!mounted) {
          return;
        }

        // If no preference has been saved yet,
        // keep notifications enabled.
        setPushNotificationsEnabled(savedPreference !== false);
      } catch (error) {
        console.error(
          "[Notifications] Failed to load notification setting:",
          error,
        );

        if (mounted) {
          setPushNotificationsEnabled(true);
        }
      } finally {
        if (mounted) {
          setIsNotificationSettingLoading(false);
        }
      }
    };

    loadNotificationSetting();

    return () => {
      mounted = false;
    };
  }, []);

  // ----------------------
  // LOAD FCM TOKEN
  // ----------------------

  useEffect(() => {
    let mounted = true;

    const loadFcmToken = async () => {
      try {
        /**
         * First try to get the current Firebase token.
         */
        const currentToken = await getCurrentNotificationToken();

        if (!mounted) {
          return;
        }

        /**
         * If Firebase returns a token, display it.
         */
        if (currentToken) {
          setFcmToken(currentToken);
          return;
        }

        /**
         * Fallback to the locally stored token.
         */
        const storedToken = await getStoredNotificationToken();

        if (mounted) {
          setFcmToken(storedToken);
        }
      } catch (error) {
        console.error("[Notifications] Failed to load FCM token:", error);

        if (mounted) {
          try {
            const storedToken = await getStoredNotificationToken();

            setFcmToken(storedToken);
          } catch {
            setFcmToken(null);
          }
        }
      } finally {
        if (mounted) {
          setIsFcmTokenLoading(false);
        }
      }
    };

    loadFcmToken();

    return () => {
      mounted = false;
    };
  }, []);

  // ----------------------
  // COPY FCM TOKEN
  // ----------------------

  const handleCopyFcmToken = async () => {
    if (!fcmToken) {
      return;
    }

    try {
      await Clipboard.setStringAsync(fcmToken);

      setIsFcmTokenCopied(true);

      setTimeout(() => {
        setIsFcmTokenCopied(false);
      }, 2000);
    } catch (error) {
      console.error("[Notifications] Failed to copy FCM token:", error);
    }
  };

  // ----------------------
  // NOTIFICATIONS
  // ----------------------

  const { data, isLoading, isError, isRefetching, refetch } = useNotifications(
    100,
    0,
  );

  // ----------------------
  // MUTATIONS
  // ----------------------

  const markAsReadMutation = useMarkNotificationAsRead();

  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  // ----------------------
  // NOTIFICATION DATA
  // ----------------------

  const notifications = useMemo(() => data?.results ?? [], [data]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications],
  );

  // ----------------------
  // PUSH NOTIFICATION TOGGLE
  // ----------------------

  const handlePushNotificationsChange = async (enabled: boolean) => {
    if (isNotificationSettingUpdating) {
      return;
    }

    const previousValue = pushNotificationsEnabled;

    // Update UI immediately.
    setPushNotificationsEnabled(enabled);
    setIsNotificationSettingUpdating(true);

    try {
      if (enabled) {
        /**
         * Save the preference first so the notification
         * service knows notifications are enabled.
         */
        await setNotificationsEnabled(true);

        /**
         * Request permission, retrieve the FCM token
         * and register the device with the backend.
         */
        const result = await setupNotifications();

        console.log("[Notifications] Setup result:", result);

        /**
         * Update the temporary FCM token display.
         */
        if (result.token) {
          setFcmToken(result.token);
        }

        if (!result.registered) {
          console.warn(
            "[Notifications] Push notifications could not be registered.",
          );
        }
      } else {
        /**
         * Get the currently stored FCM token before
         * disabling notifications.
         */
        const token = await getStoredNotificationToken();

        /**
         * Tell the backend to stop using this device token.
         */
        if (token) {
          await unregisterDevice(token);
        }

        /**
         * Persist the disabled preference.
         */
        await setNotificationsEnabled(false);
      }
    } catch (error) {
      console.error(
        "[Notifications] Failed to update push notification setting:",
        error,
      );

      // Restore the previous UI state if the operation fails.
      setPushNotificationsEnabled(previousValue);
    } finally {
      setIsNotificationSettingUpdating(false);
    }
  };

  // ----------------------
  // MARK AS READ
  // ----------------------

  const handleNotificationPress = (notification: BusinessNotification) => {
    if (notification.is_read) {
      return;
    }

    markAsReadMutation.mutate(notification.id);
  };

  // ----------------------
  // MARK ALL AS READ
  // ----------------------

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) {
      return;
    }

    markAllAsReadMutation.mutate();
  };

  // ----------------------
  // LOADING STATE
  // ----------------------

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Notifications"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={() => router.back()}
        />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <ActivityIndicator size="large" color="#111827" />

          <Spacer size="md" />

          <Text variant="body" color="secondary">
            Loading notifications...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ----------------------
  // ERROR STATE
  // ----------------------

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Notifications"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={() => router.back()}
        />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 30,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#F3F4F6",
            }}
          >
            <Bell size={28} color="#6B7280" />
          </View>

          <Spacer size="lg" />

          <Text variant="h4" weight="semibold" style={{ textAlign: "center" }}>
            Unable to load notifications
          </Text>

          <Spacer size="sm" />

          <Text
            variant="body"
            color="secondary"
            style={{ textAlign: "center" }}
          >
            We couldn't load your notifications. Please try again.
          </Text>

          <Spacer size="lg" />

          <Pressable
            onPress={() => refetch()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 18,
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor: "#111827",
            }}
          >
            <RefreshCw size={18} color="#FFFFFF" />

            <Text variant="body" weight="semibold" style={{ color: "#FFFFFF" }}>
              Try Again
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ----------------------
  // MAIN SCREEN
  // ----------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {/* Header */}
        <Header
          title="Notifications"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={() => router.back()}
        />

        <Spacer size="lg" />

        <View style={{ paddingHorizontal: 20 }}>
          {/* ============================================
              NOTIFICATION SETTINGS
          ============================================ */}

          <Text variant="h4" weight="semibold">
            Notification Settings
          </Text>

          <Spacer size="sm" />

          <Divider />

          <Spacer size="lg" />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                paddingRight: 20,
              }}
            >
              <Text variant="body" weight="semibold">
                Push Notifications
              </Text>

              <Spacer size="xs" />

              <Text variant="body" color="secondary">
                Receive alerts about orders, promotions and important updates.
              </Text>
            </View>

            {isNotificationSettingLoading ? (
              <ActivityIndicator size="small" color="#111827" />
            ) : (
              <ToggleSwitch
                value={pushNotificationsEnabled}
                onChange={handlePushNotificationsChange}
              />
            )}
          </View>

          <Spacer size="lg" />

          <Divider />

          <Spacer size="xxl" />

          {/* ============================================
              TEMPORARY FCM DEBUG SECTION
          ============================================ */}

          <View
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 12,
              padding: 16,
              backgroundColor: "#F9FAFB",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text variant="body" weight="semibold">
                  FCM Debug Token
                </Text>

                <Spacer size="xs" />

                <Text variant="caption" color="secondary">
                  Temporary testing section. Use this token to test Firebase
                  notifications.
                </Text>
              </View>

              <Pressable
                onPress={handleCopyFcmToken}
                disabled={!fcmToken || isFcmTokenLoading}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor:
                    !fcmToken || isFcmTokenLoading ? "#E5E7EB" : "#111827",
                  opacity: !fcmToken || isFcmTokenLoading ? 0.6 : 1,
                }}
              >
                <Copy
                  size={16}
                  color={!fcmToken || isFcmTokenLoading ? "#6B7280" : "#FFFFFF"}
                />

                <Text
                  variant="caption"
                  weight="semibold"
                  style={{
                    color:
                      !fcmToken || isFcmTokenLoading ? "#6B7280" : "#FFFFFF",
                  }}
                >
                  {isFcmTokenCopied ? "Copied" : "Copy"}
                </Text>
              </Pressable>
            </View>

            <Spacer size="md" />

            <View
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 8,
                backgroundColor: "#FFFFFF",
                padding: 12,
              }}
            >
              {isFcmTokenLoading ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <ActivityIndicator size="small" color="#6B7280" />

                  <Text variant="caption" color="secondary">
                    Loading FCM token...
                  </Text>
                </View>
              ) : fcmToken ? (
                <Text
                  variant="caption"
                  style={{
                    fontFamily: "monospace",
                    lineHeight: 18,
                  }}
                >
                  {fcmToken}
                </Text>
              ) : (
                <Text variant="caption" color="secondary">
                  No FCM token available yet.
                </Text>
              )}
            </View>
          </View>

          <Spacer size="xxl" />

          {/* ============================================
              NOTIFICATION INBOX
          ============================================ */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text variant="body" color="secondary">
              {unreadCount > 0
                ? `${unreadCount} unread notification${
                    unreadCount === 1 ? "" : "s"
                  }`
                : "You're all caught up"}
            </Text>

            {unreadCount > 0 && (
              <Pressable
                onPress={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  opacity: markAllAsReadMutation.isPending ? 0.5 : 1,
                }}
              >
                {markAllAsReadMutation.isPending ? (
                  <ActivityIndicator size="small" color="#111827" />
                ) : (
                  <CheckCheck size={17} color="#111827" />
                )}

                <Text variant="body" weight="semibold">
                  Read all
                </Text>
              </Pressable>
            )}
          </View>

          <Spacer size="md" />

          <Divider />

          <Spacer size="md" />

          {/* ============================================
              NOTIFICATIONS
          ============================================ */}

          {notifications.length === 0 ? (
            <EmptyNotifications />
          ) : (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <NotificationItem
                  notification={notification}
                  onPress={() => handleNotificationPress(notification)}
                  isLoading={
                    markAsReadMutation.isPending &&
                    markAsReadMutation.variables === notification.id
                  }
                />

                {index < notifications.length - 1 && (
                  <>
                    <Spacer size="md" />

                    <Divider />

                    <Spacer size="md" />
                  </>
                )}
              </React.Fragment>
            ))
          )}
        </View>

        <Spacer size="xxl" />
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// NOTIFICATION ITEM
// ======================================================

type NotificationItemProps = {
  notification: BusinessNotification;
  onPress: () => void;
  isLoading: boolean;
};

function NotificationItem({
  notification,
  onPress,
  isLoading,
}: NotificationItemProps) {
  const icon = getNotificationIcon(
    notification.notification_type,
    notification.is_read,
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        opacity: isLoading ? 0.5 : 1,
      }}
    >
      {/* Notification Icon */}
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: notification.is_read ? "#F3F4F6" : "#E5E7EB",
        }}
      >
        {isLoading ? <ActivityIndicator size="small" color="#111827" /> : icon}
      </View>

      <Spacer size="sm" />

      {/* Notification Content */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <Text
            variant="body"
            weight={notification.is_read ? "regular" : "semibold"}
            style={{ flex: 1 }}
          >
            {notification.title}
          </Text>

          {/* Unread Dot */}
          {!notification.is_read && (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#111827",
                marginTop: 6,
                marginLeft: 8,
              }}
            />
          )}
        </View>

        <Spacer size="xs" />

        <Text variant="body" color="secondary" numberOfLines={3}>
          {notification.body}
        </Text>

        <Spacer size="xs" />

        <Text variant="caption" color="secondary">
          {formatNotificationDate(notification.created_at)}
        </Text>
      </View>

      <Spacer size="xs" />

      <ChevronRight
        size={18}
        color={notification.is_read ? "#D1D5DB" : "#6B7280"}
      />
    </Pressable>
  );
}

// ======================================================
// EMPTY STATE
// ======================================================

function EmptyNotifications() {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 70,
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F3F4F6",
        }}
      >
        <Bell size={30} color="#9CA3AF" />
      </View>

      <Spacer size="lg" />

      <Text variant="h4" weight="semibold" style={{ textAlign: "center" }}>
        No notifications
      </Text>

      <Spacer size="sm" />

      <Text
        variant="body"
        color="secondary"
        style={{
          textAlign: "center",
          maxWidth: 280,
        }}
      >
        You're all caught up. New notifications will appear here.
      </Text>
    </View>
  );
}

// ======================================================
// NOTIFICATION ICON
// ======================================================

function getNotificationIcon(type: NotificationType, isRead: boolean) {
  const color = isRead ? "#9CA3AF" : "#111827";

  switch (type) {
    case "order":
      return <Package size={22} color={color} />;

    case "promotion":
      return <Tag size={22} color={color} />;

    case "reward":
      return <Award size={22} color={color} />;

    case "system":
      return <Info size={22} color={color} />;

    case "generic":
      return <Bell size={22} color={color} />;

    default:
      return <Megaphone size={22} color={color} />;
  }
}

// ======================================================
// DATE FORMAT
// ======================================================

function formatNotificationDate(date: string) {
  const notificationDate = new Date(date);
  const now = new Date();

  const difference = now.getTime() - notificationDate.getTime();

  const seconds = Math.floor(difference / 1000);

  const minutes = Math.floor(seconds / 60);

  const hours = Math.floor(minutes / 60);

  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return notificationDate.toLocaleDateString();
}
