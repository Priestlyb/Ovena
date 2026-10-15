import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notificationService";

/* ======================================================
   QUERY KEYS
====================================================== */

export const notificationKeys = {
  all: ["notifications"] as const,

  list: (limit: number, offset: number) =>
    ["notifications", "list", limit, offset] as const,

  unreadCount: ["notifications", "unread-count"] as const,
};

/* ======================================================
   GET NOTIFICATIONS
====================================================== */

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

/* ======================================================
   GET UNREAD NOTIFICATION COUNT
====================================================== */

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount,

    queryFn: getUnreadNotificationCount,

    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,
  });
}

/* ======================================================
   MARK ONE NOTIFICATION AS READ
====================================================== */

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

/* ======================================================
   MARK ALL NOTIFICATIONS AS READ
====================================================== */

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
