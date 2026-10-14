/**
 * context/AdminOrdersWebSocketContext.tsx
 *
 * Wraps useAdminOrdersWebSocket so every screen shares ONE connection to
 * /ws/admin/orders/ instead of each screen opening its own. Mount this
 * once at the app root — see app/_layout.tsx.
 *
 * ── Notifications (new) ──────────────────────────────────────────────
 * admin_notification / branch_notification / driver_notification all get
 * turned into AppNotification objects (types/notifications.ts) here —
 * this is the only place that can do it, since the hook can only be
 * called once (one socket, one set of callbacks).
 *   - `notifications`: full session history, newest first, capped at
 *     MAX_NOTIFICATIONS so this can't grow unbounded over a long session.
 *   - `toast` / `dismissToast`: ONE toast at a time. A new notification
 *     either becomes the toast immediately (nothing showing) or gets
 *     queued (toastQueueRef) and shown right after the current one is
 *     dismissed — manually (X button) or by NotificationToast's own
 *     auto-dismiss timer, which calls dismissToast() the same way.
 *   - `unreadCount` / `markAllNotificationsRead`: for the Notifications
 *     screen's badge/"mark all read".
 * ⚠️ Session-only — this state lives in React state, not persisted. A
 * cold restart starts both the toast queue and history empty.
 *
 * ── Isolating one message type in the console ──────────────────────────
 * LOG_FILTERS below toggles each per-type log here (tagged
 * [AdminOrdersWSContext]). The hook's own firehose log (tagged
 * [AdminOrdersWS], unfiltered) has its own separate toggle,
 * LOG_RAW_MESSAGES, in hooks/useAdminOrdersWebSocket.ts.
 */

import React, {
  createContext, useContext, useState, useCallback, useRef, ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  useAdminOrdersWebSocket,
  DashboardSnapshot,
  FailurePoints,
  OrderEvents,
  AdminNotification,
  WsConnectionStatus,
} from '@/hooks/useAdminOrdersWebSocket';
import { AppNotification, NotificationSource, ADMIN_NOTIFICATION_LABEL } from '@/types/notifications';

const LOG_FILTERS = {
  dashboard: true,
  failurePoints: true,
  orderEvents: true,
  assignDriverResult: true,
  forceStatusResult: true,
  orderUpdate: true,
  branchNotification: true,
  driverNotification: true,
  adminNotification: true,
  connectionStatus: true,
} as const;

const MAX_NOTIFICATIONS = 200;

interface AdminOrdersWebSocketContextValue {
  status: WsConnectionStatus;
  dashboard: DashboardSnapshot | null;
  failurePoints: FailurePoints | null;

  orderEvents: OrderEvents | null;
  orderEventsLoading: boolean;
  orderEventsOrderId: number | null;

  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  toast: AppNotification | null;
  dismissToast: () => void;
  markAllNotificationsRead: () => void;

  requestDashboard: () => void;
  requestFailurePoints: () => void;
  requestOrderEvents: (orderId: number) => void;
  assignDriver: (orderId: number, driverId: number) => void;
  forceStatus: (orderId: number, status: string, reason: string) => void;
}

const AdminOrdersWebSocketContext = createContext<AdminOrdersWebSocketContextValue | null>(null);

const LOG_TAG = '[AdminOrdersWSContext]';

// ── Notification builders ───────────────────────────────────────────────
let notificationCounter = 0;
function nextId(): string {
  notificationCounter += 1;
  return `ntf-${Date.now()}-${notificationCounter}`;
}

function buildAdminAppNotification(data: AdminNotification): AppNotification {
  const title = ADMIN_NOTIFICATION_LABEL[data.event] ?? data.event;
  const extra = Object.entries(data)
    .filter(([k]) => k !== 'event')
    .map(([k, v]) => `${k}: ${v}`)
    .join(' · ');
  return {
    id: nextId(),
    source: 'admin',
    title,
    message: extra || 'No additional details.',
    raw: data,
    timestamp: new Date().toISOString(),
    read: false,
  };
}

// ⚠️ branch_notification / driver_notification have no confirmed shape —
// shown generically (raw JSON) until a real sample lets this be built
// properly like buildAdminAppNotification above.
function buildGenericAppNotification(source: NotificationSource, data: any): AppNotification {
  const title = source === 'branch' ? 'Branch update' : 'Driver update';
  let message: string;
  try {
    message = typeof data === 'object' ? JSON.stringify(data) : String(data);
  } catch {
    message = 'Unable to display notification content.';
  }
  return {
    id: nextId(),
    source,
    title,
    message,
    raw: data,
    timestamp: new Date().toISOString(),
    read: false,
  };
}

export const AdminOrdersWebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { tokens } = useAuth();

  const [status, setStatus]               = useState<WsConnectionStatus>('disconnected');
  const [dashboard, setDashboard]         = useState<DashboardSnapshot | null>(null);
  const [failurePoints, setFailurePoints] = useState<FailurePoints | null>(null);

  const [orderEvents, setOrderEvents]             = useState<OrderEvents | null>(null);
  const [orderEventsLoading, setOrderEventsLoading] = useState(false);
  const [orderEventsOrderId, setOrderEventsOrderId] = useState<number | null>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toast, setToast] = useState<AppNotification | null>(null);
  const toastQueueRef = useRef<AppNotification[]>([]);

  const unreadCount = notifications.reduce((n, item) => n + (item.read ? 0 : 1), 0);

  const pushNotification = useCallback((notification: AppNotification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, MAX_NOTIFICATIONS));
    setToast((current) => {
      if (current) {
        toastQueueRef.current.push(notification);
        return current;
      }
      return notification;
    });
  }, []);

  const dismissToast = useCallback(() => {
    const next = toastQueueRef.current.shift();
    setToast(next ?? null);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => (n.read ? n : { ...n, read: true })));
  }, []);

  const {
    requestDashboard,
    requestFailurePoints,
    requestOrderEvents: sendRequestOrderEvents,
    assignDriver,
    forceStatus,
  } = useAdminOrdersWebSocket({
    token: tokens?.accessToken ?? null,

    onDashboard: (data) => {
      if (LOG_FILTERS.dashboard) {
        console.log(`${LOG_TAG} 📊 dashboard:`, JSON.stringify(data, null, 2));
      }
      setDashboard(data);
    },
    onFailurePoints: (data) => {
      if (LOG_FILTERS.failurePoints) {
        console.log(`${LOG_TAG} 🚨 failure_points:`, JSON.stringify(data, null, 2));
      }
      setFailurePoints(data);
    },
    onOrderEvents: (data) => {
      if (LOG_FILTERS.orderEvents) {
        console.log(`${LOG_TAG} 🧾 order_events:`, JSON.stringify(data, null, 2));
      }
      setOrderEvents(data);
      setOrderEventsLoading(false);
    },
    onOrderUpdate: (data) => {
      if (LOG_FILTERS.orderUpdate) {
        console.log(`${LOG_TAG} 🔄 order.update (⚠️ UNCONFIRMED SHAPE — logging only):`, JSON.stringify(data, null, 2));
      }
    },
    onAssignDriverResult: (data) => {
      if (LOG_FILTERS.assignDriverResult) {
        console.log(`${LOG_TAG} 🚚 assign_driver_result:`, JSON.stringify(data, null, 2));
      }
    },
    onForceStatusResult: (data) => {
      if (LOG_FILTERS.forceStatusResult) {
        console.log(`${LOG_TAG} ⛔ force_status_result:`, JSON.stringify(data, null, 2));
      }
    },
    onBranchNotification: (data) => {
      if (LOG_FILTERS.branchNotification) {
        console.log(`${LOG_TAG} 🏢 branch_notification:`, JSON.stringify(data, null, 2));
      }
      pushNotification(buildGenericAppNotification('branch', data));
    },
    onDriverNotification: (data) => {
      if (LOG_FILTERS.driverNotification) {
        console.log(`${LOG_TAG} 🛵 driver_notification:`, JSON.stringify(data, null, 2));
      }
      pushNotification(buildGenericAppNotification('driver', data));
    },
    onAdminNotification: (data) => {
      if (LOG_FILTERS.adminNotification) {
        console.log(`${LOG_TAG} 📢 admin_notification [event: ${data?.event}]:`, JSON.stringify(data, null, 2));
      }
      pushNotification(buildAdminAppNotification(data));
    },

    onStatus: (s) => {
      if (LOG_FILTERS.connectionStatus) {
        console.log(`${LOG_TAG} 🔌 connection status:`, s);
      }
      setStatus(s);
      if (s === 'connected') {
        requestFailurePoints();
      }
    },
  });

  // ⚠️ KNOWN GAP: order_events responses carry no order_id to match
  // against — see requestOrderEvents below for details.
  const requestOrderEvents = useCallback((orderId: number) => {
    setOrderEventsOrderId(orderId);
    setOrderEvents(null);
    setOrderEventsLoading(true);
    sendRequestOrderEvents(orderId);
  }, [sendRequestOrderEvents]);

  const value: AdminOrdersWebSocketContextValue = {
    status,
    dashboard,
    failurePoints,
    orderEvents,
    orderEventsLoading,
    orderEventsOrderId,
    notifications,
    unreadCount,
    toast,
    dismissToast,
    markAllNotificationsRead,
    requestDashboard,
    requestFailurePoints,
    requestOrderEvents,
    assignDriver,
    forceStatus,
  };

  return (
    <AdminOrdersWebSocketContext.Provider value={value}>
      {children}
    </AdminOrdersWebSocketContext.Provider>
  );
};

export function useAdminOrdersWS(): AdminOrdersWebSocketContextValue {
  const ctx = useContext(AdminOrdersWebSocketContext);
  if (!ctx) {
    throw new Error('useAdminOrdersWS() must be called inside an AdminOrdersWebSocketProvider');
  }
  return ctx;
}