/**
 * data/couponData.ts
 * Shared coupon data and types used across CouponManager, CreateCoupon, and Spinwheel.
 */

export type DiscountType = 'percentage' | 'fixed';
export type CouponStatus = 'active' | 'inactive' | 'expired';

export interface Coupon {
  id:           string;
  code:         string;
  description:  string;
  discountType: DiscountType;
  discountValue: number;
  minSpend?:    number;
  totalUses:    number;
  usedCount:    number;
  limitPerUser: number;
  startDate:    string;
  endDate:      string;
  status:       CouponStatus;
  daysLeft?:    number;
}

export const INITIAL_COUPONS: Coupon[] = [
  {
    id:           'c1',
    code:         'SUMMER50',
    description:  'Applied to entire cart',
    discountType: 'percentage',
    discountValue: 50,
    totalUses:    500,
    usedCount:    156,
    limitPerUser: 1,
    startDate:    '2024-06-01',
    endDate:      '2024-08-31',
    status:       'active',
    daysLeft:     2,
  },
  {
    id:           'c2',
    code:         'LAUNCH20',
    description:  'Minimum spend: $100',
    discountType: 'fixed',
    discountValue: 20,
    minSpend:     100,
    totalUses:    500,
    usedCount:    488,
    limitPerUser: 1,
    startDate:    '2024-05-01',
    endDate:      '2024-09-30',
    status:       'active',
    daysLeft:     14,
  },
  {
    id:           'c3',
    code:         'WINTER15',
    description:  'Seasonal winter special',
    discountType: 'percentage',
    discountValue: 15,
    totalUses:    200,
    usedCount:    198,
    limitPerUser: 2,
    startDate:    '2023-11-01',
    endDate:      '2023-12-31',
    status:       'inactive',
  },
  {
    id:           'c4',
    code:         'LAVA25',
    description:  'Flash sale — premium users',
    discountType: 'percentage',
    discountValue: 25,
    totalUses:    300,
    usedCount:    44,
    limitPerUser: 1,
    startDate:    '2024-07-01',
    endDate:      '2024-12-31',
    status:       'active',
    daysLeft:     60,
  },
  {
    id:           'c5',
    code:         'FREESHIP',
    description:  'Free shipping on all orders',
    discountType: 'fixed',
    discountValue: 0,
    totalUses:    1000,
    usedCount:    312,
    limitPerUser: 3,
    startDate:    '2024-01-01',
    endDate:      '2024-12-31',
    status:       'active',
    daysLeft:     90,
  },
];

// Segment colours for spinwheel — 6 alternating slots
export const WHEEL_SEGMENT_COLORS = [
  '#f56e0f',  // Liquid Lava
  '#38bdf8',  // sky blue
  '#a78bfa',  // purple
  '#fbbf24',  // amber
  '#4ade80',  // green
  '#f472b6',  // pink
];