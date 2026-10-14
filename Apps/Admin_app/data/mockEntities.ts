/**
 * data/mockEntities.ts
 *
 * Mock data for Rider / Restaurant / Customer profile viewers.
 * Delete once real endpoints exist.
 */

import { RiderProfile, RestaurantProfile, CustomerProfile, StaffProfile } from '@/types/entities';

export const MOCK_RIDERS: RiderProfile[] = [
  {
    riderId: 'RDR-4402',
    name: 'Emeka Obi',
    pictureUrl: null,
    rating: 4.8,
    totalDeliveries: 612,
    earnings: 482000,
    walletBalance: 18500,
    availability: 'busy',
    currentLocation: { lat: 6.8583, lng: 7.3958, label: 'Nsukka Central' },
    vehicle: { type: 'Motorcycle', plateNumber: 'ENU-234-XY', model: 'Bajaj Boxer' },
    phone: '+234 801 234 5678',
    documentsVerified: true,
    approved: true,
    suspended: false,
    blocked: false,
  },
  {
    riderId: 'RDR-2109',
    name: 'Grace Nwosu',
    pictureUrl: null,
    rating: 4.6,
    totalDeliveries: 340,
    earnings: 265000,
    walletBalance: 9200,
    availability: 'online',
    currentLocation: { lat: 6.8489, lng: 7.4014, label: 'Odenigbo Road' },
    vehicle: { type: 'Motorcycle', plateNumber: 'ENU-118-AB', model: 'Honda Ace' },
    phone: '+234 802 987 6543',
    documentsVerified: true,
    approved: true,
    suspended: false,
    blocked: false,
  },
];

export const MOCK_RESTAURANTS: RestaurantProfile[] = [
  {
    restaurantId: 'RST-001',
    name: "McDonald's",
    logoUrl: null,
    status: 'active',
    featured: true,
    menuItemCount: 42,
    totalOrders: 1840,
    revenue: 12400000,
    rating: 4.5,
    commissionPercent: 15,
    commissionOwed: 186000,
    phone: '+234 803 111 2222',
    address: 'Enugu Road, Nsukka',
  },
  {
    restaurantId: 'RST-002',
    name: 'Pasta Palace',
    logoUrl: null,
    status: 'active',
    featured: false,
    menuItemCount: 28,
    totalOrders: 620,
    revenue: 3100000,
    rating: 4.2,
    commissionPercent: 12,
    commissionOwed: 41000,
    phone: '+234 803 222 3333',
    address: 'University Road, Nsukka',
  },
];

export const MOCK_CUSTOMERS: CustomerProfile[] = [
  {
    customerId: 'CUS-101',
    name: 'Tunde O.',
    pictureUrl: null,
    phone: '+234 802 345 6789',
    email: 'tunde.o@example.com',
    address: '14 Enugu Road, Nsukka',
    totalOrders: 34,
    totalSpending: 218000,
    walletBalance: 4200,
    suspended: false,
    referrals: [
      { referredName: 'Ada K.', joinedAt: '2026-03-11', rewardEarned: 500 },
    ],
    recentOrders: [
      { orderId: 'ORD-4402', restaurantName: "McDonald's", total: 7600, date: '2026-08-06' },
    ],
  },
];

export const MOCK_STAFF: StaffProfile[] = [
  { staffId: 'STF-001', name: 'Chinelo Eze', role: 'business_admin', email: 'chinelo@pastapalace.ng', restaurantName: 'Pasta Palace' },
  { staffId: 'STF-002', name: 'Femi Adeyemi', role: 'ops_admin', email: 'femi@ovena.ng', restaurantName: null },
];

export function getMockRider(riderId: string): RiderProfile {
  return MOCK_RIDERS.find((r) => r.riderId === riderId) ?? MOCK_RIDERS[0];
}
export function getMockRestaurant(restaurantId: string): RestaurantProfile {
  return MOCK_RESTAURANTS.find((r) => r.restaurantId === restaurantId) ?? MOCK_RESTAURANTS[0];
}
export function getMockCustomer(customerId: string): CustomerProfile {
  return MOCK_CUSTOMERS.find((c) => c.customerId === customerId) ?? MOCK_CUSTOMERS[0];
}