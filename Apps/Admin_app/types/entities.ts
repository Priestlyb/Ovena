/**
 * types/entities.ts
 *
 * Shapes for Rider / Restaurant / Customer profile viewers, reached from
 * the new Users tab and (for riders) from Order Detail's "View driver
 * profile" link.
 *
 * ⚠️ UNVERIFIED: all fields are placeholders based on what the admin spec
 * asks to display/act on. Confirm against real endpoints before wiring —
 * trust the live response over this file, per usual.
 */

export type RiderAvailability = 'online' | 'offline' | 'busy';

export interface RiderProfile {
  riderId: string;
  name: string;
  pictureUrl: string | null;
  rating: number;
  totalDeliveries: number;
  earnings: number;
  walletBalance: number;
  availability: RiderAvailability;
  currentLocation: { lat: number; lng: number; label: string } | null;
  vehicle: { type: string; plateNumber: string; model: string };
  phone: string;
  documentsVerified: boolean;
  approved: boolean;
  suspended: boolean;
  blocked: boolean;
}

export type RestaurantStatus = 'active' | 'suspended' | 'pending_approval' | 'hidden';

export interface RestaurantProfile {
  restaurantId: string;
  name: string;
  logoUrl: string | null;
  status: RestaurantStatus;
  featured: boolean;
  menuItemCount: number;
  totalOrders: number;
  revenue: number;
  rating: number;
  commissionPercent: number;
  commissionOwed: number;
  phone: string;
  address: string;
}

export interface CustomerReferral {
  referredName: string;
  joinedAt: string;
  rewardEarned: number;
}

export interface CustomerProfile {
  customerId: string;
  name: string;
  pictureUrl: string | null;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalSpending: number;
  walletBalance: number;
  suspended: boolean;
  referrals: CustomerReferral[];
  recentOrders: { orderId: string; restaurantName: string; total: number; date: string }[];
}

export type StaffRole = 'business_admin' | 'business_staff' | 'ops_admin';

export interface StaffProfile {
  staffId: string;
  name: string;
  role: StaffRole;
  email: string;
  restaurantName: string | null; // null for platform-side ops staff
}