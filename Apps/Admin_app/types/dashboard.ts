/**
 * types/dashboard.ts
 *
 * Shared shapes for the admin dashboard's order-tracking surfaces.
 *
 * OrderStatus now follows the confirmed flow:
 *   New Order → Restaurant Accepted → Preparing → Rider Assigned →
 *   Picked Up → On the Way → Delivered   (+ Cancelled as a terminal branch)
 *
 * ⚠️ UNVERIFIED: field names/shapes are placeholders. Confirm against the
 * live API before wiring real endpoints.
 */

export type OrderStatus =
  | 'new'
  | 'restaurant_accepted'
  | 'preparing'
  | 'rider_assigned'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'new',
  'restaurant_accepted',
  'preparing',
  'rider_assigned',
  'picked_up',
  'on_the_way',
  'delivered',
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'New Order',
  restaurant_accepted: 'Restaurant Accepted',
  preparing: 'Preparing',
  rider_assigned: 'Rider Assigned',
  picked_up: 'Picked Up',
  on_the_way: 'On the Way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export interface ActiveOrderSummary {
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  customerId: string;
  customerName: string;
  driverId: string | null;
  driverName: string | null;
  status: OrderStatus;
  etaMinutes: number | null;
  placedAt: string; // ISO timestamp
}

export interface OrderDetail extends ActiveOrderSummary {
  driverPhone: string | null;
  customerPhone: string;
  restaurantPhone: string;
  deliveryAddress: string;
  items: { name: string; quantity: number }[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  statusHistory: { status: OrderStatus; timestamp: string }[];
}