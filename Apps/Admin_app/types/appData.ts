/**
 * types/appData.ts
 * Mirrors the real response shapes from the admin dashboard endpoints.
 */

export interface DashboardStats {
  users: { total: number; active: number; inactive: number };
  employees: { drivers: number; businesses: number };
  withdrawals: {
    pending_or_processing_count: number;
    pending_or_processing_amount_kobo: number;
    pending_or_processing_amount_ngn: number;
  };
  drivers: {
    pending_onboarding_submissions: number;
    pending_documents: number;
  };
  referrals: { eligible_users_for_payout: number };
}

export type CouponType = 'delivery' | 'itemdiscount' | string; // only these two seen so far
export type CouponScope = 'global' | 'business' | string;
export type CouponDiscountType = 'percent' | 'fixed' | string; // only "percent" confirmed live

export interface Coupon {
  id: number;
  code: string;
  description: string;
  coupon_type: CouponType;
  scope: CouponScope;
  discount_type: CouponDiscountType;
  discount_value: string;
  max_uses: number;
  uses_count: number;
  valid_from: string;
  valid_until: string;
  buy_amount: number;
  get_amount: number;
  buy_item: string | number | null; // null in every sample seen so far
  get_item: string | number | null; // null in every sample seen so far
  is_reward: boolean;
  exhausted: boolean;
  time_left_seconds: number;
}

/**
 * POST /api/admin/coupons/create/ and PUT /api/admin/coupons/update/{id}/
 * payload — trimmed to fields confirmed to exist on a real Coupon object.
 * category/item/business/is_active from the earlier swagger stub do not
 * appear anywhere on a real coupon and have been removed.
 */
export interface CreateCouponPayload {
  code: string;
  description: string;
  coupon_type: CouponType;
  scope: CouponScope;
  discount_type: CouponDiscountType;
  discount_value: string;
  max_uses: number;
  valid_from: string;
  valid_until: string;
  item?: number;       // required when coupon_type === 'itemdiscount'
  buy_amount?: number;
  get_amount?: number;
  buy_item?: number | null;
  get_item?: number | null;
  is_reward?: boolean;
}

export type UpdateCouponPayload = CreateCouponPayload;

export interface BusinessAdminUser {
  id: number;
  email: string;
  phone_number: string | null;
}

/**
 * Business — GET /api/admin/employees/businesses/
 * Confirmed against live response (not a swagger stub).
 */
export interface Business {
  id: number;
  business_name: string;
  business_type: string;
  country: string;
  business_address: string;
  email: string;
  phone_number: string;
  onboarding_complete: boolean;
  created_at: string;
  branches_count: number;
  admin_user: {
    id: number;
    email: string;
    phone_number: string;
  } | null;
}

export interface AdminAppUser {
  id: number;
  email: string | null;
  phone_number: string | null;
  is_active: boolean;
  is_staff: boolean;
  roles: string[];
}

export type SupportTicketStatus = 'open' | 'in_progress' | 'closed';
export type SupportTicketPriority = 'low' | 'medium' | 'high';

export interface SupportTicket {
  id: string; // ULID, e.g. "01KXG4YNFEBSA11YETVRZ72ZA8"
  category: string; // free-text on the backend — not a fixed enum
  subject: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  is_blocking: boolean;
  created_at: string;
  closed_at: string | null;
}

// ⚠️ UNVERIFIED — modeled from a Swagger/OpenAPI example stub, not a real
// response (tell-tales: example.org URLs, "string" placeholders, int32/int64
// max-value placeholders for retry_count/max_retries/amount). Re-check this
// shape against a real authenticated call before relying on it in the UI.
export interface WithdrawalUser {
  id: number;
  email: string;
  phone_number: string;
}

export type WithdrawalStatus =
  | 'pending_batch'
  | 'processing'
  | 'completed'
  | 'failed'
  | string; // widened — only "pending_batch" was seen in the (stub) sample

export interface Withdrawal {
  id: string; // UUID
  user: WithdrawalUser;
  amount: number; // ⚠️ sample value exceeds safe JS integer range — verify real values fit
  amount_ngn: string;
  status: WithdrawalStatus;
  strategy: string;
  idempotency_key: string;
  batch_date: string; // date-only, e.g. "2026-07-18"
  retry_count: number;
  max_retries: number;
  paystack_transfer_code: string | null;
  paystack_transfer_ref: string | null;
  paystack_recipient_code: string | null;
  ledger_role: string;
  failure_reason: string | null;
  requested_at: string;
  processed_at: string | null;
  completed_at: string | null;
}

export interface DriverUser {
  id: number;
  email: string;
  phone_number: string;
  is_active: boolean;
  is_approved: boolean;
}

export type OnboardingStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | string;

/**
 * Driver — GET /api/admin/employees/drivers/
 * Confirmed against live response (not a swagger stub) — see appDataApi.ts.
 */
export interface Driver {
  id: number;
  user: {
    id: number;
    email: string;
    phone_number: string;
    is_active: boolean;
    is_approved: boolean;
  };
  first_name: string;
  last_name: string;
  gender: string;
  is_online: boolean;
  is_available: boolean;
  last_location_update: string | null;
  vehicle_make: string;
  vehicle_type: string | null;
  vehicle_number: string | null;
  total_deliveries: number;
  avg_rating: number;
  created_at: string;
  latest_onboarding_status: string;
  latest_onboarding_submitted_at: string | null;
  pending_documents_count: number;
  pending_onboarding_submissions_count: number;
}

export interface Feature {
  id: number;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type PlanInterval = 'monthly' | 'yearly' | string;
export type PlanAudience = 'business' | 'driver' | 'customer' | string;

export interface Plan {
  id: number;
  name: string;
  amount: number; // appears to be in kobo, e.g. 500000 = ₦5,000.00 — verify against DashboardStats.withdrawals kobo convention
  interval: PlanInterval;
  audience: PlanAudience;
  description: string;
}

// ⚠️ UNVERIFIED — modeled from a Swagger/OpenAPI example stub, not a real
// response (tell-tales: example.org URLs, "string" id placeholder, int32-max
// placeholders for units_paid/conversion_rate, and a suspicious negative
// amount value). Re-check this shape against a real authenticated call.
export interface ReferralPayout {
  id: string;
  user: number; // looks like a bare user id, not an embedded object — unlike Withdrawal.user
  units_paid: number;
  conversion_rate: number;
  referrals_used: number;
  amount: string; // wire sends this as a string, per sample — sign/format unconfirmed
  created_at: string;
}

export interface AllAppData {
   stats: DashboardStats;
   coupons: Coupon[];
   businesses: PaginatedResponse<Business>;
   users: PaginatedResponse<AdminAppUser>;
   supportTickets: PaginatedResponse<SupportTicket>;
   withdrawals: PaginatedResponse<Withdrawal>;
   drivers: PaginatedResponse<Driver>;
   features: PaginatedResponse<Feature>;
   plans: PaginatedResponse<Plan>;
   referralPayouts: PaginatedResponse<ReferralPayout>;
 }


 export type TicketStatus   = 'open' | 'in_progress' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';
export type OwnerRole      = 'customer' | 'driver' | 'business_admin' | 'business_staff';
export type MessageSenderType = OwnerRole | 'support';

export interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  is_blocking: boolean;
  created_at: string;
  closed_at: string | null;
  owner_role: OwnerRole;
  owner_id: string;
  owner_email: string | null;
}

export interface MessageAttachment {
  id: string;
  file: string;               // R2 URL
  original_filename: string;
  content_type: string;       // e.g. "image/jpeg"
  file_size: number;          // bytes
  created_at: string;
}

export interface TicketMessage {
  id: string;
  sender_type: MessageSenderType; // confirmed: "support" is a real literal value, not "admin"
  sender_id: number;
  message: string;
  attachments: MessageAttachment[];
  created_at: string;
}

// Real wrapper shape: pagination fields sit at the top level, but the
// actual list is nested at results.data (results.detail is just a label).
export interface TicketMessagesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    detail: string;
    data: TicketMessage[];
  };
}

export interface SendTicketMessagePayload {
  id?: string;           // ⚠️ UNVERIFIED purpose — likely a client-generated
                          // idempotency key (see note below). Optional until confirmed required.
  message: string;
  attachments: string[]; // attachment IDs, NOT raw files/URLs — see upload note below
}



/**
 * GET /api/admin/coupons/wheel/all/ — list item shape.
 * Confirmed real (non-stub) response. No `name` field exists on a wheel —
 * the earlier "Spinwheel Name" UI field has always been a local-only label,
 * never persisted to the backend.
 */
export interface SpinWheel {
  id: number;
  max_entries_amount: number;
  is_active: boolean;
}

/**
 * GET /api/admin/coupons/wheel/{id}/ — detail shape.
 * ⚠️ Sample provided still has swagger-stub tells (int32-max placeholders,
 * a negative discount_value, "string" placeholders) inside the nested
 * coupons array, so treat the individual Coupon fields inside `coupons`
 * with the same caution as elsewhere — but the STRUCTURE (full nested
 * Coupon objects under `coupons`, not `coupon_ids`) is what matters here
 * and is taken at face value.
 */
export interface SpinWheelDetail extends SpinWheel {
  coupons: Coupon[];
}

/**
 * POST /api/admin/coupons/wheel/create/ payload.
 * max_entries_amount's exact semantics are still unconfirmed (only known
 * to be a required integer). coupon_ids are Coupon.id values.
 */
export interface CreateSpinWheelPayload {
  max_entries_amount: number;
  is_active: boolean;
  coupon_ids: number[];
}