/**
 * services/adminDriversApi.ts
 *
 * GET /api/admin/employees/drivers/ — paginated driver list. Confirmed
 * shape (real captured response). Used by the Assign Driver picker on
 * Order Detail, filtered client-side to is_available && is_online since
 * no server-side filter for that combination is confirmed — note that in
 * the captured sample every single driver had is_online: false, so an
 * empty "no available drivers" result is a realistic, expected state,
 * not necessarily a bug.
 */

const BASE_URL = 'https://ovena-backend-production.up.railway.app';
const LOG_TAG = '[adminDriversApi]';
const PAGE_SIZE = 100;

export class AdminDriversApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'AdminDriversApiError';
  }
}

export interface AdminDriverUser {
  id: number;
  email: string;
  phone_number: string;
  is_active: boolean;
  is_approved: boolean;
}

export interface AdminDriver {
  id: number;
  user: AdminDriverUser;
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
  created_at: string; // ISO
  latest_onboarding_status: string;
  latest_onboarding_submitted_at: string | null;
  pending_documents_count: number;
  pending_onboarding_submissions_count: number;
}

export interface AdminDriversPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminDriver[];
}

export async function fetchAdminDrivers(
  accessToken: string,
  { limit = PAGE_SIZE, offset = 0 }: { limit?: number; offset?: number } = {},
): Promise<AdminDriversPage> {
  const endpoint = `/api/admin/employees/drivers/?limit=${limit}&offset=${offset}`;
  console.log(`${LOG_TAG} 🌐 GET →`, endpoint);

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const rawText = await res.text();

  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error(`${LOG_TAG} ❌ Non-JSON response [${endpoint}]:`, rawText.slice(0, 300));
    throw new AdminDriversApiError(
      `Server returned a non-JSON response (HTTP ${res.status}) for ${endpoint}.`,
      res.status,
    );
  }

  if (!res.ok) {
    console.error(`${LOG_TAG} ❌ Backend error [${endpoint}]:`, JSON.stringify(data, null, 2));
    const message = data?.message ?? data?.detail ?? `Request failed (${res.status}) for ${endpoint}`;
    throw new AdminDriversApiError(message, res.status);
  }

  console.log(`${LOG_TAG} ✅ ${data.results?.length ?? 0} of ${data.count ?? '?'} total drivers`);
  return data as AdminDriversPage;
}

export { PAGE_SIZE as ADMIN_DRIVERS_PAGE_SIZE };