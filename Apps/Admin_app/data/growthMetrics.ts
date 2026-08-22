/**
 * data/growthMetrics.ts
 *
 * Mock data for Stats screen growth sections: Referral Leaderboard,
 * Campaign Performance, Promo Effectiveness, Restaurant Ad Performance.
 *
 * Coupon Usage is NOT here — it's sourced live from useAppData().coupons
 * (GET /api/admin/coupons/all/?reward=all), which already has real
 * uses_count/max_uses/code/exhausted data. See stats.tsx.
 *
 * ⚠️ UNVERIFIED — no backend endpoints exist for referrals-leaderboard,
 * campaigns, promo-effectiveness, or restaurant-ad-performance yet.
 * Delete this file's mock arrays once real endpoints are wired.
 */

export interface TopReferrer {
  id: string;
  name: string;
  referralCount: number;
  rewardEarned: string; // pre-formatted, e.g. "₦12,000"
  trend: string;
}

export const TOP_REFERRERS: TopReferrer[] = [
  { id: 'CUS-101', name: 'Tunde O.', referralCount: 14, rewardEarned: '₦42,000', trend: '+3' },
  { id: 'CUS-208', name: 'Amaka N.', referralCount: 11, rewardEarned: '₦33,000', trend: '+1' },
  { id: 'CUS-115', name: 'Bola A.', referralCount: 9, rewardEarned: '₦27,000', trend: '+2' },
];

export type CampaignStatus = 'active' | 'ended' | 'scheduled';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  reach: number;
  conversions: number;
  revenue: string; // pre-formatted
  conversionRate: string; // pre-formatted %
}

export const CAMPAIGNS: Campaign[] = [
  { id: 'CMP-001', name: 'Weekend Flash Sale', status: 'active', reach: 18400, conversions: 1120, revenue: '₦2.4M', conversionRate: '6.1%' },
  { id: 'CMP-002', name: 'Rain Discount Push', status: 'ended', reach: 9200, conversions: 640, revenue: '₦980K', conversionRate: '7.0%' },
  { id: 'CMP-003', name: 'New Restaurant Launch', status: 'scheduled', reach: 0, conversions: 0, revenue: '₦0', conversionRate: '—' },
];

export interface PromoMetric {
  id: string;
  label: string;
  value: string;
  icon: string; // Ionicons name
  accent?: 'success' | 'error' | 'lava';
  delta?: string;
  deltaPositive?: boolean;
}

export const PROMO_EFFECTIVENESS: PromoMetric[] = [
  { id: 'redemption-rate', label: 'Redemption Rate', value: '34%', icon: 'checkmark-done-outline', accent: 'success', delta: '+4%', deltaPositive: true },
  { id: 'revenue-lift', label: 'Revenue Lift', value: '+18%', icon: 'trending-up-outline', accent: 'lava', delta: '+2%', deltaPositive: true },
  { id: 'avg-discount', label: 'Avg Discount Given', value: '₦620', icon: 'pricetag-outline' },
  { id: 'repeat-usage', label: 'Repeat Promo Usage', value: '22%', icon: 'repeat-outline', accent: 'success' },
];

export interface RestaurantAdPerformance {
  id: string;
  restaurantName: string;
  impressions: number;
  clicks: number;
  ctr: string; // pre-formatted %
  ordersGenerated: number;
}

export const RESTAURANT_AD_PERFORMANCE: RestaurantAdPerformance[] = [
  { id: 'RST-001', restaurantName: "McDonald's", impressions: 42000, clicks: 1860, ctr: '4.4%', ordersGenerated: 312 },
  { id: 'RST-002', restaurantName: 'Pasta Palace', impressions: 18400, clicks: 720, ctr: '3.9%', ordersGenerated: 98 },
  { id: 'RST-003', restaurantName: 'Suya Spot', impressions: 12100, clicks: 610, ctr: '5.0%', ordersGenerated: 87 },
];