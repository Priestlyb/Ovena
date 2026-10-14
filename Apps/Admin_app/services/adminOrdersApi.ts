/**
 * services/adminOrdersApi.ts
 *
 * GET /api/admin/orders/ — paginated order list. Confirmed shape (real
 * captured response, not a Swagger stub):
 *   { count, next, previous, results: AdminOrderSummary[] }
 *
 * Also covers the per-order action endpoints documented alongside it:
 *   GET  /api/admin/orders/<id>/                   — full detail (used to
 *        refresh Order Detail after an action, since the list endpoint
 *        alone doesn't reflect a just-made change)
 *   POST /api/admin/orders/<id>/force-status/       — { status, reason }
 *   POST /api/admin/orders/<id>/assign-driver/      — { driver_id }
 *
 * ⚠️ order_number is 0 on every captured list entry — see failure_points'
 * same anomaly. `id` is the real identifier everywhere.
 *
 * ⚠️ No confirmed server-side status filter (?status=) is USED by this
 * file even though the docs mention one exists — callers filter
 * client-side. See app/orders/active.tsx and app/ops/orders/index.tsx.
 *
 * ⚠️ UNCONFIRMED: the exact response shape of GET /api/admin/orders/<id>/
 * beyond the fields AdminOrderSummary already has — docs say "full order
 * detail + event timeline" but no real sample has been captured. Treated
 * defensively (AdminOrderDetail is AdminOrderSummary + an open index
 * signature) and logged in full on every fetch so the real shape — and
 * whatever the embedded event timeline looks like — shows up in Metro the
 * first time this actually runs.
 */

const BASE_URL = 'https://ovena-backend-production.up.railway.app';
const LOG_TAG = '[adminOrdersApi]';
const PAGE_SIZE = 100;

export class AdminOrdersApiError extends Error {
  status: number;
  endpoint: string;
  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.status = status;
    this.endpoint = endpoint;
    this.name = 'AdminOrdersApiError';
  }
}

export interface AdminOrderSummary {
  id: number;
  order_number: number; // ⚠️ observed as 0 on every entry — see header note
  status: string; // see types/dashboard.ts OrderApiStatus for known values
  orderer_name: string | null;
  branch_name: string;
  driver_name: string | null; // only populated once a driver is assigned
  subtotal: string; // numeric string, e.g. "5000.00"
  grand_total: string; // numeric string, e.g. "6210.00"
  payment_retry_count: number;
  created_at: string; // ISO
  last_modified_at: string; // ISO
}

export interface AdminOrdersPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminOrderSummary[];
}

// ⚠️ UNCONFIRMED beyond AdminOrderSummary's fields — see header note.
export interface AdminOrderDetail extends AdminOrderSummary {
  [key: string]: any;
}

// ── Shared raw-text-first request helper (GET + POST) ──────────────────────
async function requestJSON<T>(
  method: 'GET' | 'POST',
  endpoint: string,
  accessToken: string,
  body?: Record<string, unknown>,
): Promise<T> {
  console.log(`${LOG_TAG} 🌐 ${method} →`, endpoint, body ? JSON.stringify(body) : '');

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const rawText = await res.text();

  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error(`${LOG_TAG} ❌ Non-JSON response [${method} ${endpoint}]:`, rawText.slice(0, 300));
    throw new AdminOrdersApiError(
      `Server returned a non-JSON response (HTTP ${res.status}) for ${endpoint}.`,
      res.status,
      endpoint,
    );
  }

  if (!res.ok) {
    console.error(`${LOG_TAG} ❌ Backend error [${method} ${endpoint}]:`, JSON.stringify(data, null, 2));
    const message = data?.message ?? data?.detail ?? `Request failed (${res.status}) for ${endpoint}`;
    throw new AdminOrdersApiError(message, res.status, endpoint);
  }

  return data as T;
}

export async function fetchAdminOrders(
  accessToken: string,
  { limit = PAGE_SIZE, offset = 0 }: { limit?: number; offset?: number } = {},
): Promise<AdminOrdersPage> {
  const endpoint = `/api/admin/orders/?limit=${limit}&offset=${offset}`;
  const data = await requestJSON<AdminOrdersPage>('GET', endpoint, accessToken);
  console.log(`${LOG_TAG} ✅ ${data.results?.length ?? 0} of ${data.count ?? '?'} total orders`);
  return data;
}

export async function fetchAdminOrderDetail(
  accessToken: string,
  orderId: number,
): Promise<AdminOrderDetail> {
  const endpoint = `/api/admin/orders/${orderId}/`;
  const data = await requestJSON<AdminOrderDetail>('GET', endpoint, accessToken);
  console.log(`${LOG_TAG} ✅ order #${orderId} detail:`, JSON.stringify(data, null, 2));
  return data;
}

export async function forceOrderStatus(
  accessToken: string,
  orderId: number,
  status: string,
  reason: string,
): Promise<any> {
  const endpoint = `/api/admin/orders/${orderId}/force-status/`;
  const data = await requestJSON<any>('POST', endpoint, accessToken, { status, reason });
  console.log(`${LOG_TAG} ✅ force-status response [order #${orderId}]:`, JSON.stringify(data, null, 2));
  return data;
}

export async function assignDriverToOrder(
  accessToken: string,
  orderId: number,
  driverId: number,
): Promise<any> {
  const endpoint = `/api/admin/orders/${orderId}/assign-driver/`;
  const data = await requestJSON<any>('POST', endpoint, accessToken, { driver_id: driverId });
  console.log(`${LOG_TAG} ✅ assign-driver response [order #${orderId}]:`, JSON.stringify(data, null, 2));
  return data;
}

export { PAGE_SIZE as ADMIN_ORDERS_PAGE_SIZE };