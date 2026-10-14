/**
 * types/dashboard.ts
 *
 * ⚠️ OrderApiStatus reflects only statuses actually observed from a live
 * GET /api/admin/orders/ response — more may exist server-side (string
 * fallback included).
 */

export type OrderApiStatus =
  | 'pending'
  | 'payment_pending'
  | 'awaiting_payment_method'
  | 'payment_initialization_failed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'
  | string;

// Per spec: ONLY these count as "active" for the Active Orders screen —
// everything else is filtered out there by design.
export const ACTIVE_ORDER_STATUSES: OrderApiStatus[] = [
  'pending',
  'payment_pending',
  'ready',
  'payment_initialization_failed',
  'preparing',
];

// Every status observed so far, for the Change Status picker on Order
// Detail — includes ones outside ACTIVE_ORDER_STATUSES (delivered,
// cancelled, awaiting_payment_method) since a manual force-status override
// isn't limited to the "active" subset.
export const ALL_ORDER_STATUSES: OrderApiStatus[] = [
  'pending',
  'payment_pending',
  'awaiting_payment_method',
  'payment_initialization_failed',
  'preparing',
  'ready',
  'delivered',
  'cancelled',
];

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  payment_pending: 'Payment Pending',
  awaiting_payment_method: 'Awaiting Payment',
  payment_initialization_failed: 'Payment Failed',
  preparing: 'Preparing',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};