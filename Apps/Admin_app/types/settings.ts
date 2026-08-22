/**
 * types/settings.ts
 *
 * Shapes for the System Settings tab. No backend endpoint exists yet —
 * everything here is UI-only with a console.log save stub. Confirm real
 * field names/units (e.g. is delivery radius km or mi? is service fee a
 * flat amount or percent?) before wiring a real endpoint.
 */

export type FeeType = 'percent' | 'fixed';

export interface FeeSetting {
  type: FeeType;
  value: number; // percent (0-100) or ₦ amount, depending on `type`
}

export interface DayHours {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  isOpen: boolean;
  openTime: string;  // "HH:MM", 24h
  closeTime: string; // "HH:MM", 24h
}

export interface SystemSettings {
  serviceFee: FeeSetting;
  deliveryFee: FeeSetting;
  restaurantCommissionPercent: number;
  referralPercent: number;
  minimumOrder: number; // ₦
  deliveryRadiusKm: number;
  operatingHours: DayHours[];
  holidayMode: {
    enabled: boolean;
    message: string;
    startDate: string; // "YYYY-MM-DD"
    endDate: string;   // "YYYY-MM-DD"
  };
  maintenanceMode: {
    enabled: boolean;
    message: string;
  };
}