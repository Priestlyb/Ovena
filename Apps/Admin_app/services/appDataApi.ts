/**
 * services/appDataApi.ts
 *
 * Fetches the aggregated dashboard payload as 10 parallel requests
 * (no single "bootstrap" endpoint exists on the backend, so we compose
 * one client-side). Each request uses the same raw-text-first parsing +
 * console logging convention as authApi.ts, tagged with its own endpoint
 * so a failure in any one of the 10 is immediately identifiable in the
 * Metro log.
 *
 * PASSIVE ONLY: every request here is parameterless and fires on load —
 * no pagination inputs, no POST bodies. Anything requiring caller-supplied
 * inputs (paginated ticket lists, ticket messages, sending messages) lives
 * in services/supportActionsApi.ts instead, under its own
 * SupportActionsApiError so the two failure sources are never conflated.
 *
 * NOTE: Most console logs below are commented out now that most endpoints
 * have been confirmed to return correct data. Each commented log has a
 * note beside it describing what it prints — uncomment as needed to
 * re-verify a specific endpoint without guessing at shapes.
 *
 * ⚠️ /api/admin/withdrawals/ and /api/admin/referrals/payouts/ have NOT
 * been confirmed against real responses yet — both samples provided were
 * Swagger/OpenAPI example stubs. Their logs are left ACTIVE (not commented)
 * below until verified live.
 */

import {
  AllAppData,
  DashboardStats,
  Coupon,
  PaginatedResponse,
  Business,
  AdminAppUser,
  SupportTicket,
  Withdrawal,
  Driver,
  Feature,
  Plan,
  ReferralPayout,
} from '../types/appData';

const BASE_URL = 'https://ovena-backend-production.up.railway.app';
const LOG_TAG  = '[appDataApi]';

class AppDataApiError extends Error {
  status:   number;
  endpoint: string;
  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.status = status;
    this.endpoint = endpoint;
    this.name = 'AppDataApiError';
  }
}

async function getJSON<T>(endpoint: string, accessToken: string): Promise<T> {
  // console.log(`${LOG_TAG} 🌐 GET →`, endpoint);
  // Prints: the request URL path only, e.g. "/api/admin/dashboard/stats/"

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const rawText = await res.text();
  // console.log(`${LOG_TAG} 📥 Raw response (${res.status}) [${endpoint}]:`, rawText.slice(0, 500));
  // Prints: HTTP status code + first 500 chars of the raw response body
  // (unparsed string) — useful to check for HTML error pages / truncated JSON.

  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error(`${LOG_TAG} ❌ Non-JSON response body [${endpoint}]:`, rawText.slice(0, 300));
    // Kept active (not commented): only fires on a genuine parse failure,
    // e.g. Django returning an HTML 404/500 page instead of JSON.
    throw new AppDataApiError(
      `Server returned a non-JSON response (HTTP ${res.status}) for ${endpoint}.`,
      res.status,
      endpoint,
    );
  }

  if (!res.ok) {
    console.error(`${LOG_TAG} ❌ Backend error response [${endpoint}]:`, JSON.stringify(data, null, 2));
    // Kept active: only fires on a non-2xx status with a valid JSON error
    // body, e.g. { "detail": "..." } — useful to see the exact backend
    // error message/shape when a request is rejected.
    const message = data?.message ?? data?.detail ?? `Request failed (${res.status}) for ${endpoint}`;
    throw new AppDataApiError(message, res.status, endpoint);
  }

  // console.log(`${LOG_TAG} ✅ Response [${endpoint}]:`, JSON.stringify(data, null, 2));
  // Prints: the full parsed JSON body for this single endpoint. Shape
  // depends on `endpoint` — one of DashboardStats, Coupon[], or
  // PaginatedResponse<Business|AdminAppUser|SupportTicket|Withdrawal|Driver|Feature|Plan|ReferralPayout>.
  return data as T;
}

export async function fetchAllAppData(accessToken: string): Promise<AllAppData> {
  const [
    stats, coupons, businesses, users, supportTickets,
    withdrawals, drivers, features, plans, referralPayouts,
  ] = await Promise.all([
    getJSON<DashboardStats>('/api/admin/dashboard/stats/', accessToken),
    // ?reward=all — without this the backend defaults to one coupon type only
    // (reward coupons used in spin wheels vs. marketing coupons used in
    // promo campaigns are the same model, filtered by is_reward on the
    // backend). This screen needs to see both, so request all explicitly.
    getJSON<Coupon[]>('/api/admin/coupons/all/?reward=all', accessToken),
    getJSON<PaginatedResponse<Business>>('/api/admin/employees/businesses/', accessToken),
    getJSON<PaginatedResponse<AdminAppUser>>('/api/admin/users/', accessToken),
    getJSON<PaginatedResponse<SupportTicket>>('/api/admin/support/tickets/', accessToken),
    getJSON<PaginatedResponse<Withdrawal>>('/api/admin/withdrawals/', accessToken),
    getJSON<PaginatedResponse<Driver>>('/api/admin/employees/drivers/', accessToken),
    getJSON<PaginatedResponse<Feature>>('/api/admin/features/', accessToken),
    getJSON<PaginatedResponse<Plan>>('/api/admin/plan/', accessToken),
    getJSON<PaginatedResponse<ReferralPayout>>('/api/admin/referrals/payouts/', accessToken),
  ]);

  // ... rest unchanged

  // console.log(`${LOG_TAG} ✅ All 10 endpoints resolved`);
  // Prints: nothing but a marker string — confirms Promise.all settled successfully.

  // console.log(`${LOG_TAG} 📊 stats:`, stats);
  // Prints: { users: {total, active, inactive}, employees: {drivers, businesses},
  //   withdrawals: {...}, drivers: {...}, referrals: {eligible_users_for_payout} }

  // console.log(`${LOG_TAG} 🎟️ coupons (${coupons.length}):`, coupons);
  // Prints: array count + full Coupon[] array.

  // console.log(`${LOG_TAG} 🏢 businesses (${businesses.count} total, ${businesses.results.length} on this page):`, businesses);
  // Prints: paginated Business[] — id, business_name, business_type, country,
  // business_address, email, phone_number, onboarding_complete, created_at,
  // branches_count, admin_user (nullable).

  // console.log(`${LOG_TAG} 👥 users (${users.count} total, ${users.results.length} on this page):`, users);
  // Prints: paginated AdminAppUser[] — id, email (nullable), phone_number
  // (nullable), is_active, is_staff, roles (string[]).

  console.log(`${LOG_TAG} 🎫 supportTickets (${supportTickets.count} total, ${supportTickets.results.length} on this page):`, supportTickets);
  // Prints: paginated SupportTicket[] — id (ULID), category, subject, status,
  // priority, is_blocking, created_at, closed_at (nullable), owner_role,
  // owner_id, owner_email.

  console.log(`${LOG_TAG} 💸 withdrawals (${withdrawals.count} total, ${withdrawals.results.length} on this page) — ⚠️ UNVERIFIED SHAPE, log kept active:`, withdrawals);
  // Kept ACTIVE deliberately: this endpoint's type was inferred from a
  // Swagger example stub, not a confirmed real response. Comment this out
  // once you've confirmed the real shape matches.

  // console.log(`${LOG_TAG} 🛵 drivers (${drivers.count} total, ${drivers.results.length} on this page):`, drivers);
  // Prints: paginated Driver[] — id, user ({id, email, phone_number,
  // is_active, is_approved}), first_name, last_name, gender, is_online,
  // is_available, last_location_update, vehicle_make/type/number
  // (type+number nullable), total_deliveries, avg_rating, created_at,
  // latest_onboarding_status, latest_onboarding_submitted_at,
  // pending_documents_count, pending_onboarding_submissions_count.

  // console.log(`${LOG_TAG} 🚩 features (${features.count} total, ${features.results.length} on this page):`, features);
  // Prints: paginated Feature[] — id, code, description, created_at, updated_at.

  // console.log(`${LOG_TAG} 💳 plans (${plans.count} total, ${plans.results.length} on this page):`, plans);
  // Prints: paginated Plan[] — id, name, amount (likely kobo), interval
  // ("monthly"), audience ("business"), description.

  console.log(`${LOG_TAG} 🎁 referralPayouts (${referralPayouts.count} total, ${referralPayouts.results.length} on this page) — ⚠️ UNVERIFIED SHAPE, log kept active:`, referralPayouts);
  // Kept ACTIVE deliberately: this endpoint's type was inferred from a
  // Swagger example stub (example.org URLs, "string" id, int32-max
  // placeholders, a suspicious negative amount). Comment this out once
  // you've confirmed the real shape matches.

  return {
    stats, coupons, businesses, users, supportTickets,
    withdrawals, drivers, features, plans, referralPayouts,
  };
}

export { AppDataApiError };
export type { AllAppData };