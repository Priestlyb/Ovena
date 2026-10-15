import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import { useTheme } from "@/constants/theme";

import {
  clearStoredNotificationToken,
  getCurrentNotificationToken,
  getNotificationsEnabled,
  getStoredNotificationToken,
  registerDeviceForNotifications,
  requestNotificationPermission,
  setNotificationsEnabled,
  unregisterDevice,
} from "@/services/notificationService";

export default function NotificationSettings() {
  const theme = useTheme();

  const [token, setToken] = useState("");
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<
    "enable" | "disable" | null
  >(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const styles = createStyles(theme);

  const loadNotificationState = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const enabled = await getNotificationsEnabled();

      /**
       * The user has explicitly disabled notifications.
       */
      if (enabled === false) {
        const storedToken = await getStoredNotificationToken();

        if (storedToken) {
          setToken(storedToken);
        }

        setRegistered(false);
        return;
      }

      /**
       * Notifications are enabled.
       *
       * Verify the current FCM token and make sure the backend
       * still has this device registered.
       */
      if (enabled === true) {
        const currentToken = await getCurrentNotificationToken();

        if (!currentToken) {
          setRegistered(false);
          setError(
            "Notifications are enabled, but this device token could not be retrieved.",
          );
          return;
        }

        setToken(currentToken);

        const registeredSuccessfully =
          await registerDeviceForNotifications(currentToken);

        if (!registeredSuccessfully) {
          setRegistered(false);
          setError(
            "Notifications are enabled, but this device could not be registered with the notification server.",
          );
          return;
        }

        setRegistered(true);
        return;
      }

      /**
       * The user has never explicitly enabled notifications.
       */
      setRegistered(false);
    } catch (error) {
      console.error(
        "[Notifications] Failed to load notification state:",
        error,
      );

      setRegistered(false);
      setError("Unable to load your notification settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotificationState();
  }, [loadNotificationState]);

  const handleEnableNotifications = async () => {
    try {
      setLoadingAction("enable");
      setError("");

      const notificationToken = await requestNotificationPermission();

      if (!notificationToken) {
        setRegistered(false);
        setError("Notification permission was not granted.");
        return;
      }

      setToken(notificationToken);

      const registeredSuccessfully =
        await registerDeviceForNotifications(notificationToken);

      if (!registeredSuccessfully) {
        setRegistered(false);

        setError(
          "Notification permission was granted, but this device could not be registered with the notification server.",
        );

        return;
      }

      /**
       * Only mark notifications as enabled after both:
       *
       * 1. Android notification permission was granted.
       * 2. Backend device registration succeeded.
       */
      await setNotificationsEnabled(true);

      setRegistered(true);
      setError("");
    } catch (error) {
      console.error("[Notifications] Enable error:", error);

      setRegistered(false);
      setError("Something went wrong while enabling notifications.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDisableNotifications = async () => {
    try {
      setLoadingAction("disable");
      setError("");

      let notificationToken = token;

      if (!notificationToken) {
        notificationToken = (await getStoredNotificationToken()) ?? "";
      }

      /**
       * There is no backend token to unregister.
       * We can safely disable the local preference.
       */
      if (!notificationToken) {
        await setNotificationsEnabled(false);

        setRegistered(false);
        setToken("");

        return;
      }

      const result = await unregisterDevice(notificationToken);

      if (result.success === true) {
        await setNotificationsEnabled(false);
        await clearStoredNotificationToken();

        setRegistered(false);
        setToken("");

        return;
      }

      setError("Unable to disable notifications. Please try again.");
    } catch (error) {
      console.error("[Notifications] Disable error:", error);

      setError("Something went wrong while disabling notifications.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    if (loadingAction) {
      return;
    }

    setError("");
    setCopied(false);

    if (value) {
      await handleEnableNotifications();
    } else {
      await handleDisableNotifications();
    }
  };

  const handleCopyToken = async () => {
    if (!token) {
      return;
    }

    try {
      await Clipboard.setStringAsync(token);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("[Notifications] Failed to copy token:", error);
      setError("Unable to copy the FCM token.");
    }
  };

  const getTokenPreview = (value: string) => {
    if (!value) {
      return "";
    }

    if (value.length <= 42) {
      return value;
    }

    return `${value.slice(0, 20)}...${value.slice(-18)}`;
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View
          style={[
            styles.headerIcon,
            {
              backgroundColor: `${theme.primary}15`,
            },
          ]}
        >
          <Text
            style={[
              styles.headerIconText,
              {
                color: theme.primary,
              },
            ]}
          >
            🔔
          </Text>
        </View>

        <View style={styles.headerTextContainer}>
          <Text
            style={[
              styles.title,
              {
                color: theme.textPrimary,
              },
            ]}
          >
            Notifications
          </Text>

          <Text
            style={[
              styles.description,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            Stay up to date with your orders, deliveries, and important updates
            from Ovena.
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.settingRow}>
          <View
            style={[
              styles.settingIcon,
              {
                backgroundColor: registered
                  ? `${theme.success}15`
                  : `${theme.textSecondary}12`,
              },
            ]}
          >
            <Text
              style={[
                styles.settingIconText,
                {
                  color: registered ? theme.success : theme.textSecondary,
                },
              ]}
            >
              🔔
            </Text>
          </View>

          <View style={styles.settingContent}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.settingTitle,
                  {
                    color: theme.textPrimary,
                  },
                ]}
              >
                Push Notifications
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: registered
                      ? `${theme.success}15`
                      : `${theme.textSecondary}12`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: registered
                        ? theme.success
                        : theme.textSecondary,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,
                    {
                      color: registered ? theme.success : theme.textSecondary,
                    },
                  ]}
                >
                  {registered ? "On" : "Off"}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.settingDescription,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              {registered
                ? "You will receive order updates and important notifications from Ovena."
                : "Turn this on to receive order updates and important notifications from Ovena."}
            </Text>
          </View>

          <Switch
            value={registered}
            onValueChange={handleToggleNotifications}
            disabled={loading || loadingAction !== null}
            trackColor={{
              false: theme.border,
              true: theme.success,
            }}
            thumbColor={theme.surface}
            ios_backgroundColor={theme.border}
          />
        </View>
      </View>

      {(loading || loadingAction !== null) && (
        <View
          style={[
            styles.loadingCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <ActivityIndicator size="small" color={theme.primary} />

          <Text
            style={[
              styles.loadingText,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            {loading
              ? "Loading notification settings..."
              : loadingAction === "disable"
                ? "Disabling notifications..."
                : "Enabling notifications..."}
          </Text>
        </View>
      )}

      {!loading && (
        <View style={styles.tokenSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.textPrimary,
                  },
                ]}
              >
                Test FCM Token
              </Text>

              <Text
                style={[
                  styles.sectionDescription,
                  {
                    color: theme.textSecondary,
                  },
                ]}
              >
                Use this token when testing push notifications from your
                notification server.
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.tokenCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.tokenLabel,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              DEVICE FCM TOKEN
            </Text>

            <View
              style={[
                styles.tokenBox,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              {token ? (
                <Text
                  style={[
                    styles.tokenText,
                    {
                      color: theme.textPrimary,
                    },
                  ]}
                  numberOfLines={2}
                  ellipsizeMode="middle"
                >
                  {getTokenPreview(token)}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.emptyTokenText,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  {registered
                    ? "FCM token is being retrieved..."
                    : "Enable notifications to generate an FCM token."}
                </Text>
              )}
            </View>

            <Pressable
              onPress={handleCopyToken}
              disabled={!token || loadingAction !== null}
              style={({ pressed }) => [
                styles.copyButton,
                {
                  backgroundColor: token ? theme.primary : theme.border,
                  opacity: pressed && token ? 0.8 : !token ? 0.6 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.copyButtonText,
                  {
                    color: token ? theme.surface : theme.textSecondary,
                  },
                ]}
              >
                {copied ? "Copied" : "Copy FCM Token"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {!loading && loadingAction === null && registered && !error && (
        <View
          style={[
            styles.messageCard,
            {
              backgroundColor: `${theme.success}12`,
              borderColor: `${theme.success}40`,
            },
          ]}
        >
          <View
            style={[
              styles.messageIcon,
              {
                backgroundColor: `${theme.success}18`,
              },
            ]}
          >
            <Text
              style={[
                styles.messageIconText,
                {
                  color: theme.success,
                },
              ]}
            >
              ✓
            </Text>
          </View>

          <View style={styles.messageContent}>
            <Text
              style={[
                styles.messageTitle,
                {
                  color: theme.textPrimary,
                },
              ]}
            >
              Notifications are enabled
            </Text>

            <Text
              style={[
                styles.messageText,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              This device is registered and ready to receive push notifications
              from Ovena.
            </Text>
          </View>
        </View>
      )}

      {error ? (
        <View
          style={[
            styles.messageCard,
            {
              backgroundColor: `${theme.error}12`,
              borderColor: `${theme.error}40`,
            },
          ]}
        >
          <View
            style={[
              styles.messageIcon,
              {
                backgroundColor: `${theme.error}18`,
              },
            ]}
          >
            <Text
              style={[
                styles.messageIconText,
                {
                  color: theme.error,
                },
              ]}
            >
              !
            </Text>
          </View>

          <View style={styles.messageContent}>
            <Text
              style={[
                styles.messageTitle,
                {
                  color: theme.textPrimary,
                },
              ]}
            >
              Something went wrong
            </Text>

            <Text
              style={[
                styles.messageText,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              {error}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.footer}>
        <Text
          style={[
            styles.footerText,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          You can change your notification preference at any time. Turning
          notifications off will unregister this device from Ovena's push
          notification service.
        </Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 55,
      paddingBottom: 40,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 28,
    },
    headerIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    headerIconText: {
      fontSize: 25,
    },
    headerTextContainer: {
      flex: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      letterSpacing: -0.5,
      marginBottom: 6,
    },
    description: {
      fontSize: 14,
      lineHeight: 21,
    },
    sectionCard: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 18,
      marginBottom: 20,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    settingIcon: {
      width: 44,
      height: 44,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    settingIconText: {
      fontSize: 19,
    },
    settingContent: {
      flex: 1,
      marginRight: 12,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 5,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: "700",
    },
    settingDescription: {
      fontSize: 13,
      lineHeight: 19,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 20,
      gap: 5,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusText: {
      fontSize: 11,
      fontWeight: "700",
    },
    loadingCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 14,
      padding: 14,
      marginBottom: 24,
      gap: 10,
    },
    loadingText: {
      fontSize: 13,
    },
    tokenSection: {
      marginBottom: 24,
    },
    sectionHeader: {
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 5,
    },
    sectionDescription: {
      fontSize: 13,
      lineHeight: 19,
    },
    tokenCard: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 16,
    },
    tokenLabel: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 1,
      marginBottom: 8,
    },
    tokenBox: {
      minHeight: 62,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 13,
      paddingVertical: 12,
      justifyContent: "center",
      marginBottom: 12,
    },
    tokenText: {
      fontSize: 12,
      lineHeight: 18,
      fontFamily: "monospace",
    },
    emptyTokenText: {
      fontSize: 13,
      lineHeight: 19,
    },
    copyButton: {
      minHeight: 46,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
    },
    copyButtonText: {
      fontSize: 14,
      fontWeight: "700",
    },
    messageCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      borderWidth: 1,
      borderRadius: 16,
      padding: 15,
      marginBottom: 20,
    },
    messageIcon: {
      width: 30,
      height: 30,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    messageIconText: {
      fontSize: 15,
      fontWeight: "800",
    },
    messageContent: {
      flex: 1,
    },
    messageTitle: {
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 4,
    },
    messageText: {
      fontSize: 13,
      lineHeight: 19,
    },
    footer: {
      paddingHorizontal: 4,
      paddingTop: 2,
    },
    footerText: {
      fontSize: 12,
      lineHeight: 18,
      textAlign: "center",
    },
  });
