/**
 * utils/entityMappers.ts
 *
 * Maps real Driver / Business API shapes (from AppDataContext) onto the
 * display-oriented RiderProfile / RestaurantProfile shapes used by the
 * profile viewer screens.
 *
 * ⚠️ UNVERIFIED / NOT YET AVAILABLE ON THE WIRE: earnings, walletBalance,
 * commissionOwed, and revenue have no backing endpoint yet — mapped to
 * `null` and rendered as "Not available yet" in the UI rather than
 * fabricated. Swap these mappers to read real values once those
 * endpoints exist; don't guess numbers in the meantime.
 */

import { Driver, Business } from '@/types/appData';
import { RiderAvailability } from '@/types/entities';

export interface RiderDisplay {
  riderId: string; // stringified numeric id, for route params
  name: string;
  pictureUrl: string | null;
  rating: number;
  totalDeliveries: number;
  earnings: number | null;
  walletBalance: number | null;
  availability: RiderAvailability;
  vehicle: { type: string; plateNumber: string; model: string };
  email: string;
  phone: string;
  isActive: boolean;
  isApproved: boolean;
  documentsVerified: boolean;
  pendingDocumentsCount: number;
  onboardingStatus: string;
}

export interface RestaurantDisplay {
  restaurantId: string;
  name: string;
  logoUrl: string | null;
  businessType: string;
  country: string;
  address: string;
  email: string;
  phone: string;
  onboardingComplete: boolean;
  branchesCount: number;
  revenue: number | null;
  commissionOwed: number | null;
  commissionPercent: number | null;
  adminUser: { email: string; phone: string } | null;
}

export function driverToRiderDisplay(driver: Driver): RiderDisplay {
  const availability: RiderAvailability = driver.is_online
    ? driver.is_available
      ? 'online'
      : 'busy'
    : 'offline';

  return {
    riderId: String(driver.id),
    name: `${driver.first_name} ${driver.last_name}`.trim(),
    pictureUrl: null, // ⚠️ no picture field on this endpoint
    rating: driver.avg_rating,
    totalDeliveries: driver.total_deliveries,
    earnings: null,      // ⚠️ UNVERIFIED — no earnings endpoint wired yet
    walletBalance: null, // ⚠️ UNVERIFIED — no wallet endpoint wired yet
    availability,
    vehicle: {
      type: driver.vehicle_type ?? 'Not set',
      plateNumber: driver.vehicle_number ?? 'Not set',
      model: driver.vehicle_make || 'Not set',
    },
    email: driver.user.email,
    phone: driver.user.phone_number,
    isActive: driver.user.is_active,
    isApproved: driver.user.is_approved,
    documentsVerified: driver.pending_documents_count === 0,
    pendingDocumentsCount: driver.pending_documents_count,
    onboardingStatus: driver.latest_onboarding_status,
  };
}

export function businessToRestaurantDisplay(business: Business): RestaurantDisplay {
  return {
    restaurantId: String(business.id),
    name: business.business_name,
    logoUrl: null, // ⚠️ no logo field on this endpoint
    businessType: business.business_type,
    country: business.country,
    address: business.business_address,
    email: business.email,
    phone: business.phone_number,
    onboardingComplete: business.onboarding_complete,
    branchesCount: business.branches_count,
    revenue: null,          // ⚠️ UNVERIFIED — no revenue endpoint wired yet
    commissionOwed: null,   // ⚠️ UNVERIFIED — no commission endpoint wired yet
    commissionPercent: null,
    adminUser: business.admin_user
      ? { email: business.admin_user.email, phone: business.admin_user.phone_number }
      : null,
  };
}