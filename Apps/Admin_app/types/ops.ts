/**
 * types/ops.ts
 *
 * Shapes for Operations tab: Promotions, Push Notifications, Banner
 * Manager. No backend endpoints exist for any of these yet — all actions
 * are console.log stubs. Confirm real shapes before wiring.
 */

export type PromotionType =
  | 'coupon'
  | 'referral_bonus'
  | 'first_order_discount'
  | 'free_delivery'
  | 'happy_hour'
  | 'restaurant_discount';

export const PROMOTION_TYPE_LABEL: Record<PromotionType, string> = {
  coupon: 'Coupon',
  referral_bonus: 'Referral Bonus',
  first_order_discount: 'First Order Discount',
  free_delivery: 'Free Delivery',
  happy_hour: 'Happy Hour',
  restaurant_discount: 'Restaurant Discount',
};

export const PROMOTION_TYPE_ICON: Record<PromotionType, string> = {
  coupon: 'pricetag-outline',
  referral_bonus: 'people-outline',
  first_order_discount: 'gift-outline',
  free_delivery: 'bicycle-outline',
  happy_hour: 'time-outline',
  restaurant_discount: 'restaurant-outline',
};

export interface PromotionDraft {
  type: PromotionType;
  title: string;
  description: string;
  discountValue: string; // free text — % or ₦, kept as string for form input
  startDate: string;
  endDate: string;
  pushToSelectedUsers: boolean;
}

export type NotificationAudience = 'everyone' | 'customers' | 'restaurants' | 'riders';

export const AUDIENCE_LABEL: Record<NotificationAudience, string> = {
  everyone: 'Everyone',
  customers: 'Customers',
  restaurants: 'Restaurants',
  riders: 'Riders',
};

export interface NotificationTemplate {
  id: string;
  label: string;
  title: string;
  body: string;
}

export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  { id: 'flash_sale', label: 'Flash Sale', title: '⚡ Flash Sale is live!', body: 'Get up to 30% off for the next 2 hours only.' },
  { id: 'rain_discount', label: 'Rain Discount', title: '🌧️ Rain Discount unlocked', body: "It's raining — enjoy discounted delivery fees today." },
  { id: 'restaurant_promo', label: 'Restaurant Promo', title: '🍽️ New promo from your favorite spot', body: 'Check out this week\'s featured restaurant deal.' },
  { id: 'system_update', label: 'System Update', title: '🔧 We\'ve made some updates', body: 'The app has been updated with performance improvements.' },
];

export type BannerStatus = 'active' | 'disabled' | 'scheduled';

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  status: BannerStatus;
  scheduledStart: string | null;
  scheduledEnd: string | null;
  createdAt: string;
}