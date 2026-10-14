/**
 * types/notifications.ts
 *
 * Client-side representation of admin/branch/driver notifications
 * arriving over the shared admin WS (AdminOrdersWebSocketContext).
 *
 * ⚠️ None of the three source message types carry a confirmed id or event
 * timestamp of their own — admin_notification has a confirmed `event`
 * field (see ADMIN_NOTIFICATION_LABEL below, sourced from the WS doc's
 * table) but everything else about its payload, and the ENTIRE shape of
 * branch_notification/driver_notification, is unconfirmed. `id` and
 * `timestamp` below are both generated client-side at receipt time, not
 * read from the payload.
 */

export type NotificationSource = 'admin' | 'branch' | 'driver';

export interface AppNotification {
  id: string; // client-generated, receipt order — not a server id
  source: NotificationSource;
  title: string;
  message: string;
  raw: any; // original payload, kept for debugging / future shape confirmation
  timestamp: string; // ISO — client receipt time, NOT a confirmed event time from the payload
  read: boolean;
}

// Human labels for admin_notification's `event` field, straight from the
// WS doc's "Meaning" column. Anything not in this map falls back to the
// raw event string — new event types the backend adds later will still
// show up, just unlabeled until added here.
export const ADMIN_NOTIFICATION_LABEL: Record<string, string> = {
  order_created: 'New order placed',
  order_cancelled: 'Order cancelled',
  driver_matching_exhausted: 'No drivers found — needs manual assignment',
  driver_acceptance_timeout: 'Driver acceptance timed out — retrying',
  driver_pickup_delayed: 'Driver pickup running late',
  payment_timeout_sweep: 'Payment timeout sweep ran',
  driver_assigned: 'Driver manually assigned',
  status_override: 'Order status manually overridden',
};