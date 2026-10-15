// services/notificationService.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid, Platform } from "react-native";

import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission,
} from "@react-native-firebase/messaging";

import axiosInstance from "@/services/apiClient";

/* ======================================================
   TYPES
====================================================== */

export type NotificationType =
  "generic" | "order" | "promotion" | "reward" | "system" | string;

export type NotificationPayload = Record<string, unknown>;

export type Notification = {
  id: number;
  notification_type: NotificationType;
  title: string;
  body: string;
  payload_json: NotificationPayload;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
};

export type NotificationListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
};

export type UnreadNotificationCountResponse = Notification;

export type NotificationSetupResult = {
  token: string | null;
  registered: boolean;
};

export type UnregisterDeviceResult = {
  success: boolean;
};

/* ======================================================
   STORAGE KEYS
====================================================== */

const NOTIFICATIONS_ENABLED_KEY = "notifications_enabled";
const NOTIFICATION_TOKEN_KEY = "notification_fcm_token";

/* ======================================================
   HELPERS
====================================================== */

/**
 * Returns the supported mobile platform.
 */
function getNotificationPlatform(): "android" | "ios" | null {
  if (Platform.OS === "android" || Platform.OS === "ios") {
    return Platform.OS;
  }

  return null;
}

/**
 * Requests the Android notification permission on
 * Android 13+ (API 33+).
 *
 * Android 12 and below do not require the runtime
 * POST_NOTIFICATIONS permission.
 */
async function requestAndroidNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return true;
  }

  /**
   * Android 13 introduced POST_NOTIFICATIONS as a
   * runtime permission.
   */
  if (Platform.Version < 33) {
    return true;
  }

  try {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    const granted = permission === PermissionsAndroid.RESULTS.GRANTED;

    if (!granted) {
      console.log(
        "[Notifications] Android notification permission was not granted:",
        permission,
      );
    }

    return granted;
  } catch (error) {
    console.error(
      "[Notifications] Failed to request Android notification permission:",
      error,
    );

    return false;
  }
}

/* ======================================================
   NOTIFICATION PREFERENCE
====================================================== */

/**
 * Returns whether the user has explicitly enabled
 * push notifications.
 *
 * null means the user has never made a choice yet.
 */
export async function getNotificationsEnabled(): Promise<boolean | null> {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);

    if (value === null) {
      return null;
    }

    return value === "true";
  } catch (error) {
    console.error(
      "[Notifications] Failed to read notification preference:",
      error,
    );

    return null;
  }
}

/**
 * Persists the user's notification preference.
 */
export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(
      NOTIFICATIONS_ENABLED_KEY,
      enabled ? "true" : "false",
    );

    console.log(`[Notifications] Notification preference set to: ${enabled}`);
  } catch (error) {
    console.error(
      "[Notifications] Failed to save notification preference:",
      error,
    );

    throw error;
  }
}

/* ======================================================
   FCM TOKEN STORAGE
====================================================== */

/**
 * Saves the current FCM token locally.
 */
export async function saveNotificationToken(token: string): Promise<void> {
  try {
    if (!token.trim()) {
      return;
    }

    await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, token);
  } catch (error) {
    console.error("[Notifications] Failed to save FCM token:", error);
  }
}

/**
 * Returns the locally stored FCM token.
 */
export async function getStoredNotificationToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(NOTIFICATION_TOKEN_KEY);
  } catch (error) {
    console.error("[Notifications] Failed to read stored FCM token:", error);

    return null;
  }
}

/**
 * Removes the locally stored FCM token.
 */
export async function clearStoredNotificationToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(NOTIFICATION_TOKEN_KEY);
  } catch (error) {
    console.error("[Notifications] Failed to clear stored FCM token:", error);
  }
}

/* ======================================================
   PUSH NOTIFICATION PERMISSION
====================================================== */

/**
 * Requests notification permission and retrieves
 * the current FCM device token.
 *
 * Android:
 * - Android 13+ requests POST_NOTIFICATIONS explicitly.
 * - Android 12 and below do not require the runtime
 *   notification permission.
 *
 * iOS:
 * - Uses React Native Firebase notification permission.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    const platform = getNotificationPlatform();

    if (!platform) {
      console.log(
        "[Notifications] Unsupported notification platform:",
        Platform.OS,
      );

      return null;
    }

    /**
     * Android 13+ requires an explicit runtime notification
     * permission request.
     */
    if (Platform.OS === "android") {
      const permissionGranted = await requestAndroidNotificationPermission();

      if (!permissionGranted) {
        return null;
      }
    }

    /**
     * iOS still requires Firebase notification permission.
     *
     * On Android this is intentionally skipped because
     * POST_NOTIFICATIONS is handled with PermissionsAndroid.
     */
    if (Platform.OS === "ios") {
      const messagingInstance = getMessaging();

      const authStatus = await requestPermission(messagingInstance);

      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log(
          "[Notifications] iOS notification permission was not granted.",
        );

        return null;
      }
    }

    /**
     * Permission has been granted.
     *
     * Now retrieve the Firebase Cloud Messaging token.
     */
    const messagingInstance = getMessaging();

    const token = await getToken(messagingInstance);

    if (!token) {
      console.log("[Notifications] FCM token was not returned.");

      return null;
    }

    await saveNotificationToken(token);

    console.log("[Notifications] FCM token retrieved successfully.");

    return token;
  } catch (error) {
    console.error(
      "[Notifications] Notification permission/token error:",
      error,
    );

    return null;
  }
}

/**
 * Retrieves the current FCM token without requesting
 * notification permission again.
 */
export async function getCurrentNotificationToken(): Promise<string | null> {
  try {
    const platform = getNotificationPlatform();

    if (!platform) {
      return null;
    }

    const messagingInstance = getMessaging();

    const token = await getToken(messagingInstance);

    if (!token) {
      return null;
    }

    await saveNotificationToken(token);

    return token;
  } catch (error) {
    console.error(
      "[Notifications] Failed to retrieve current FCM token:",
      error,
    );

    return getStoredNotificationToken();
  }
}

/* ======================================================
   REGISTER DEVICE
====================================================== */

/**
 * Registers the current FCM device token with the backend.
 *
 * Requires an authenticated customer.
 */
export async function registerDeviceForNotifications(
  token: string,
): Promise<boolean> {
  try {
    if (!token.trim()) {
      console.log("[Notifications] Cannot register an empty FCM token.");

      return false;
    }

    const platform = getNotificationPlatform();

    if (!platform) {
      console.log(
        "[Notifications] Unsupported notification platform:",
        Platform.OS,
      );

      return false;
    }

    const response = await axiosInstance.post(
      "/customer/notifications/register-device/",
      {
        token,
        platform,
      },
    );

    await saveNotificationToken(token);

    console.log(
      "[Notifications] Device registered successfully:",
      response.data,
    );

    return true;
  } catch (error: any) {
    console.error(
      "[Notifications] Device registration error:",
      error?.response?.status ?? error?.message ?? error,
    );

    if (error?.response?.data) {
      console.error(
        "[Notifications] Device registration response:",
        error.response.data,
      );
    }

    return false;
  }
}

/* ======================================================
   UNREGISTER DEVICE
====================================================== */

/**
 * Removes the current FCM device token from the backend.
 */
export async function unregisterDevice(
  token: string,
): Promise<UnregisterDeviceResult> {
  try {
    if (!token.trim()) {
      console.log("[Notifications] Cannot unregister an empty FCM token.");

      return {
        success: false,
      };
    }

    const platform = getNotificationPlatform();

    if (!platform) {
      console.log(
        "[Notifications] Unsupported notification platform:",
        Platform.OS,
      );

      return {
        success: false,
      };
    }

    const response = await axiosInstance.post(
      "/customer/notifications/unregister-device/",
      {
        token,
        platform,
      },
    );

    console.log(
      "[Notifications] Device unregistered successfully:",
      response.data,
    );

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(
      "[Notifications] Device unregistration error:",
      error?.response?.status ?? error?.message ?? error,
    );

    if (error?.response?.data) {
      console.error(
        "[Notifications] Device unregistration response:",
        error.response.data,
      );
    }

    return {
      success: false,
    };
  }
}

/* ======================================================
   SETUP NOTIFICATIONS
====================================================== */

/**
 * Complete notification setup flow:
 *
 * 1. Check the user's saved preference.
 * 2. Request notification permission.
 * 3. Retrieve FCM token.
 * 4. Register token with backend.
 *
 * If notifications were explicitly disabled,
 * setup will not register the device again.
 */
export async function setupNotifications(): Promise<NotificationSetupResult> {
  try {
    const preference = await getNotificationsEnabled();

    /**
     * If the user explicitly disabled notifications,
     * never automatically register the device again.
     */
    if (preference === false) {
      console.log("[Notifications] Notifications are disabled by the user.");

      return {
        token: await getStoredNotificationToken(),
        registered: false,
      };
    }

    const token = await requestNotificationPermission();

    if (!token) {
      return {
        token: null,
        registered: false,
      };
    }

    const registered = await registerDeviceForNotifications(token);

    /**
     * Do not silently change the user's preference here.
     *
     * The UI that explicitly enables notifications should
     * call setNotificationsEnabled(true).
     */
    return {
      token,
      registered,
    };
  } catch (error) {
    console.error("[Notifications] Notification setup error:", error);

    return {
      token: null,
      registered: false,
    };
  }
}

/* ======================================================
   GET NOTIFICATIONS
====================================================== */

export async function getNotifications(params?: {
  limit?: number;
  offset?: number;
}): Promise<NotificationListResponse> {
  const response = await axiosInstance.get<{
    detail: string;
    data: NotificationListResponse;
  }>("/customer/notifications/", {
    params: {
      limit: params?.limit ?? 100,
      offset: params?.offset ?? 0,
    },
  });

  return response.data.data;
}

/* ======================================================
   GET UNREAD NOTIFICATION COUNT
====================================================== */

export async function getUnreadNotificationCount(): Promise<UnreadNotificationCountResponse> {
  const response = await axiosInstance.get<UnreadNotificationCountResponse>(
    "/customer/notifications/unread_count/",
  );

  return response.data;
}

/* ======================================================
   MARK ONE NOTIFICATION AS READ
====================================================== */

export async function markNotificationAsRead(
  notificationId: number,
): Promise<Notification> {
  const response = await axiosInstance.post<Notification>(
    `/customer/notifications/${notificationId}/mark_read/`,
  );

  return response.data;
}

/* ======================================================
   MARK ALL NOTIFICATIONS AS READ
====================================================== */

export async function markAllNotificationsAsRead(): Promise<Notification> {
  const response = await axiosInstance.post<Notification>(
    "/customer/notifications/read_all/",
  );

  return response.data;
}
