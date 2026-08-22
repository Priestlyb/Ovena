/**
 * data/opsMetrics.ts
 *
 * Mock data for the Stats screen's new sections: Operational Health
 * (avg delivery time, cancelled orders, failed deliveries, customer
 * retention), Top Riders, Top Customers.
 *
 * ⚠️ UNVERIFIED — no backend endpoint exists for any of these yet.
 * Delete this file once real endpoints are wired; shapes here are
 * placeholders for what the UI needs to display.
 */

export interface OperationalMetric {
  id: string;
  label: string;
  value: string;
  icon: string; // Ionicons name
  accent?: 'success' | 'error' | 'lava';
  delta?: string;
  deltaPositive?: boolean;
}

export const OPERATIONAL_METRICS: OperationalMetric[] = [
  {
    id: 'avg-delivery-time',
    label: 'Avg Delivery Time',
    value: '28 min',
    icon: 'time-outline',
    delta: '-3 min',
    deltaPositive: true,
  },
  {
    id: 'cancelled-orders',
    label: 'Cancelled Orders',
    value: '34',
    icon: 'close-circle-outline',
    accent: 'error',
    delta: '+4%',
    deltaPositive: false,
  },
  {
    id: 'failed-deliveries',
    label: 'Failed Deliveries',
    value: '7',
    icon: 'alert-circle-outline',
    accent: 'error',
    delta: '-2%',
    deltaPositive: true,
  },
  {
    id: 'customer-retention',
    label: 'Customer Retention',
    value: '68%',
    icon: 'repeat-outline',
    accent: 'success',
    delta: '+5%',
    deltaPositive: true,
  },
];

export interface TopRider {
  id: string;
  name: string;
  imageUri: string | null;
  deliveries: number;
  rating: number;
  trend: string;
}

export const TOP_RIDERS: TopRider[] = [
  { id: 'RDR-4402', name: 'Emeka Obi', imageUri: null, deliveries: 612, rating: 4.8, trend: '+12%' },
  { id: 'RDR-2109', name: 'Grace Nwosu', imageUri: null, deliveries: 340, rating: 4.6, trend: '+8%' },
  { id: 'RDR-1187', name: 'Ibrahim Musa', imageUri: null, deliveries: 298, rating: 4.7, trend: '+5%' },
];

export interface TopCustomer {
  id: string;
  name: string;
  imageUri: string | null;
  orders: number;
  totalSpent: string; // pre-formatted, e.g. "₦218,000"
}

export const TOP_CUSTOMERS: TopCustomer[] = [
  { id: 'CUS-101', name: 'Tunde O.', imageUri: null, orders: 34, totalSpent: '₦218,000' },
  { id: 'CUS-102', name: 'Chidera A.', imageUri: null, orders: 29, totalSpent: '₦186,500' },
  { id: 'CUS-103', name: 'Sarah J.', imageUri: null, orders: 22, totalSpent: '₦142,000' },
];