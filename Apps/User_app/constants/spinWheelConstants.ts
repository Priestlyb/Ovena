// constants/spinWheelConstants.ts

export const SIZE = 280;
export const RADIUS = SIZE / 2;

export const rewards = [
  { label: "₦500 Coupon" },
  { label: "₦1000 Coupon" },
  { label: "Free Delivery" },
  { label: "₦2000 Coupon" },
  { label: "Try Again" },
  { label: "₦5000 Coupon" },
];

export const wheelColors = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#843B62",
  "#FF9671",
];

export const angleStep = (2 * Math.PI) / rewards.length;