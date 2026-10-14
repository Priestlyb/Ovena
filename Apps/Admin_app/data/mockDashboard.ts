/**
 * data/mockDashboard.ts
 *
 * Mock data for dashboard + order screens. Delete once real endpoints
 * exist — shapes mirror types/dashboard.ts.
 */

import { ActiveOrderSummary, OrderDetail } from '@/types/dashboard';
import { MapMarkerData } from '@/components/home/LiveMapCard';

export const MOCK_ACTIVE_ORDERS: ActiveOrderSummary[] = [
  {
    orderId: 'ORD-4402',
    restaurantId: 'RST-001',
    restaurantName: "McDonald's",
    customerId: 'CUS-101',
    customerName: 'Tunde O.',
    driverId: 'RDR-4402',
    driverName: 'Rider #4402',
    status: 'on_the_way',
    etaMinutes: 8,
    placedAt: new Date().toISOString(),
  },
  {
    orderId: 'ORD-3391',
    restaurantId: 'RST-002',
    restaurantName: 'Pasta Palace',
    customerId: 'CUS-102',
    customerName: 'Chidera A.',
    driverId: null,
    driverName: null,
    status: 'rider_assigned',
    etaMinutes: 15,
    placedAt: new Date().toISOString(),
  },
  {
    orderId: 'ORD-3388',
    restaurantId: 'RST-003',
    restaurantName: 'Suya Spot',
    customerId: 'CUS-103',
    customerName: 'Sarah J.',
    driverId: 'RDR-2109',
    driverName: 'Rider #2109',
    status: 'preparing',
    etaMinutes: null,
    placedAt: new Date().toISOString(),
  },
];

export const MOCK_MAP_MARKERS: MapMarkerData[] = [
  { orderId: 'ORD-4402', x: 0.3, y: 0.4, status: 'enroute' },
  { orderId: 'ORD-3391', x: 0.65, y: 0.25, status: 'delayed' },
  { orderId: 'ORD-3388', x: 0.5, y: 0.7, status: 'preparing' },
];

export function getMockOrderDetail(orderId: string): OrderDetail {
  const base =
    MOCK_ACTIVE_ORDERS.find((o) => o.orderId === orderId) ?? MOCK_ACTIVE_ORDERS[0];

  return {
    ...base,
    driverPhone: base.driverName ? '+234 801 234 5678' : null,
    customerPhone: '+234 802 345 6789',
    restaurantPhone: '+234 803 456 7890',
    deliveryAddress: '14 Enugu Road, Nsukka',
    items: [
      { name: 'Jollof Rice Combo', quantity: 2 },
      { name: 'Chicken Wings', quantity: 1 },
    ],
    subtotal: 6500,
    deliveryFee: 800,
    serviceFee: 300,
    total: 7600,
    statusHistory: [
      { status: 'new', timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
      { status: 'restaurant_accepted', timestamp: new Date(Date.now() - 22 * 60000).toISOString() },
      { status: 'preparing', timestamp: new Date(Date.now() - 18 * 60000).toISOString() },
      { status: base.status, timestamp: new Date().toISOString() },
    ],
  };
}