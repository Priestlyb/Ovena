// hooks/useNotifications.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    getNotifications,
    getUnreadNotificationCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "@/services/notificationService";

// ----------------------
// QUERY KEYS
// ----------------------

export const notificationKeys = {
  all: ["business-notifications"] as const,

  list: (limit: number, offset: number) =>
    ["business-notifications", "list", limit, offset] as const,

  unreadCount: ["business-notifications", "unread-count"] as const,
};

// ----------------------
// GET NOTIFICATIONS
// ----------------------

export function useNotifications(limit = 100, offset = 0) {
  return useQuery({
    queryKey: notificationKeys.list(limit, offset),

    queryFn: () =>
      getNotifications({
        limit,
        offset,
      }),

    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,
  });
}

// ----------------------
// GET UNREAD NOTIFICATION
// ----------------------

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount,

    queryFn: getUnreadNotificationCount,

    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,
  });
}

// ----------------------
// MARK ONE AS READ
// ----------------------

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(notificationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}

// ----------------------
// MARK ALL AS READ
// ----------------------

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}
