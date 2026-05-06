// services/appDataApi.ts

const BASE = "https://ovena-backend-production.up.railway.app";

async function authGet(endpoint: string, token: string) {
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`[API] Fetching ${endpoint} with token: ${token}`);
  if (!res.ok) throw new Error(`${endpoint} failed: ${res.status}`);
  return res.json();
}

// ── Types: Dashboard ──────────────────────────────────────────────────────────

export interface DashboardProfile {
  id: number;
  first_name: string;
  last_name: string;
  rating: number;
  total_deliveries: number;
  is_online: boolean;
  is_available: boolean;
}

export interface DashboardWallet {
  current_balance: number;
  available_balance: number;
  pending_balance: number;
}

export interface DashboardData {
  detail: string;
  data: {
    profile: DashboardProfile;
    wallet: DashboardWallet;
    active_order: any | null;
    unread_notifications: number;
    open_tickets: number;
  };
}

// ── Types: Performance ────────────────────────────────────────────────────────

export interface EarningsBucket {
  bucket: string; // ISO date string
  total: number;
}

export interface PerformanceData {
  detail: string;
  data: {
    completed_deliveries: number;
    acceptance_rate: number;
    completion_rate: number;
    cancellation_rate: number;
    avg_delivery_duration_seconds: number;
    online_hours: number;
    active_hours: number;
    earnings_trend: EarningsBucket[];
  };
}

// ── Types: Earnings History ───────────────────────────────────────────────────

export interface EarningsHistoryEntry {
  id: number;
  entry_type: "credit" | "debit";
  amount: string;        // decimal string e.g. "11119.49"
  status: string;        // e.g. "posted"
  source_type: string;   // e.g. "payments_sale_credit"
  source_id: string;
  metadata: {
    sale_id: string;
    order_number: number;
    payment_ledger_entry_id: string;
  };
  created_at: string;    // ISO datetime string
}

export interface EarningsHistoryData {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    detail: string;
    data: EarningsHistoryEntry[];
  };
}

// ── Types: Earnings Summary ───────────────────────────────────────────────────

export interface EarningsSummaryData {
  detail: string;
  data: {
    total_earned: string;
    total_withdrawn: string;
    available_balance: string;
    pending_balance: string;
    period_start: string;
    period_end: string;
  };
}

// ── Types: Withdrawals ────────────────────────────────────────────────────────

export interface WithdrawalEntry {
  id: number;
  amount: string;
  status: string;
  created_at: string;
  [key: string]: any;
}

export interface WithdrawalsData {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    detail: string;
    data: WithdrawalEntry[];
  };
}

// ── Types: Withdrawal Eligibility ─────────────────────────────────────────────

export interface WithdrawalEligibilityData {
  detail: string;
  data: {
    eligible: boolean;
    minimum_amount: string;
    max_amount: string;
    available_balance: string;
    checks: {
      bank_verified: boolean;
      sufficient_balance: boolean;
      minimum_amount: boolean;
      no_blocking_ticket: boolean;
      cooldown_ok: boolean;
      daily_count_ok: boolean;
      daily_amount_ok: boolean;
    };
  };
}

// ── Aggregate type ────────────────────────────────────────────────────────────

export interface AllAppData {
  dashboard:   DashboardData;
  performance: PerformanceData;
  earningsHistory:   EarningsHistoryData;
  earningsSummary:   EarningsSummaryData;
  withdrawals:       WithdrawalsData;
  withdrawalEligibility: WithdrawalEligibilityData;
}

// ── Fetch everything in parallel ──────────────────────────────────────────────

export async function fetchAllAppData(token: string): Promise<AllAppData> {
  const [
    dashboard,
    performance,
    earningsHistory,
    earningsSummary,
    withdrawals,
    withdrawalEligibility,
  ] = await Promise.all([
    authGet("/api/driver/dashboard/",                  token),
    authGet("/api/driver/analysis/performance/",       token),
    authGet("/api/driver/earnings/history/",           token),
    authGet("/api/driver/earnings/summary/",           token),
    authGet("/api/driver/withdrawals/",                token),
    authGet("/api/driver/withdrawals/eligibility/",    token),
  ]);

  console.log("✅ App data fetched successfully");
  return {
    dashboard,
    performance,
    earningsHistory,
    earningsSummary,
    withdrawals,
    withdrawalEligibility,
  };
}