/**
 * types/appData.ts
 * Shape of the aggregated payload the home/stats/support screens consume.
 * Mirrors what a single "bootstrap" endpoint would realistically return for
 * an admin dashboard, so all screens can read from one cached object instead
 * of each firing their own network requests on every mount.
 */

export interface DashboardStats {
  activeOrders:        number;
  activeOrdersDelta:    string;
  pendingValidation:    number;
  pendingValidationDelta: string;
}

export interface LogisticsEntry {
  id:        string;
  type:      'rider' | 'store' | 'client';
  name:      string;
  subtitle:  string;
  eta?:      string;
  delay?:    string;
  stk?:      number;
  leftBorder?: 'lava' | 'error' | 'none';
}

export interface SupportSummary {
  unresolved:        number;
  unresolvedDelta:   string;
  avgResponse:       string;
  avgResponseDelta:  string;
}

export interface CouponSummary {
  totalActive:   number;
  totalActiveDelta: string;
  redemptions:   number;
}

export interface AllAppData {
  stats:      DashboardStats;
  logistics:  LogisticsEntry[];
  support:    SupportSummary;
  coupons:    CouponSummary;
  /** Epoch ms this payload was generated server-side */
  fetchedAt:  number;
}