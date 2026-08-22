/**
 * data/mockSettings.ts
 *
 * Mock/default values for System Settings. Delete once a real settings
 * endpoint exists — replace getMockSettings() with a real fetch and the
 * save handler in settings.tsx with a real PUT/PATCH call.
 */

import { SystemSettings, DayHours } from '@/types/settings';

const DEFAULT_DAY_HOURS: Omit<DayHours, 'day'> = {
  isOpen: true,
  openTime: '08:00',
  closeTime: '22:00',
};

const DAYS: DayHours['day'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function getMockSettings(): SystemSettings {
  return {
    serviceFee: { type: 'percent', value: 5 },
    deliveryFee: { type: 'fixed', value: 800 },
    restaurantCommissionPercent: 15,
    referralPercent: 2.5,
    minimumOrder: 1500,
    deliveryRadiusKm: 12,
    operatingHours: DAYS.map((day) => ({ day, ...DEFAULT_DAY_HOURS })),
    holidayMode: {
      enabled: false,
      message: "We're on a short break — back soon!",
      startDate: '',
      endDate: '',
    },
    maintenanceMode: {
      enabled: false,
      message: 'Ovena is undergoing scheduled maintenance. Please check back shortly.',
    },
  };
}