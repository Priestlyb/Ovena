/**
 * services/actionsApi.ts
 *
 * Houses support-ticket ACTIONS — requests that require caller-supplied
 * inputs (pagination params, message bodies) — as opposed to appDataApi.ts,
 * which only does the passive, parameterless 10-endpoint bootstrap fetch.
 *
 * Mirrors the driver app's AppDataApiError/DriverActionsApiError split:
 * same convention, applied here as AppDataApiError (passive) vs.
 * SupportActionsApiError (active) so a failure's origin is identifiable
 * from its error class alone, not just its message.
 *
 * Endpoints covered:
 *   GET  /api/admin/support/tickets/                 (paginated, limit+offset)
 *   GET  /api/admin/support/tickets/{id}/messages/    (paginated, limit+offset)
 *   POST /api/admin/support/tickets/{id}/messages/    (send message + attachments)
 *
 * Same raw-text-first parsing + emoji-tagged console logging convention as
 * appDataApi.ts and authApi.ts, so Metro logs read consistently across files.
 */

import {
  SupportTicket,
  PaginatedResponse,
  TicketMessage,
  TicketMessagesResponse,
  SendTicketMessagePayload,
  Coupon,
  CreateCouponPayload,
  UpdateCouponPayload,
  CreateSpinWheelPayload,
  SpinWheel,
  SpinWheelDetail,
} from '../types/appData';

import {
  TicketStatus,
  TicketPriority,
  OwnerRole,
} from '../types/appData';

const BASE_URL = 'https://ovena-backend-production.up.railway.app';
const LOG_TAG  = '[supportActionsApi]';

class SupportActionsApiError extends Error {
  status:   number;
  endpoint: string;
  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.status = status;
    this.endpoint = endpoint;
    this.name = 'SupportActionsApiError';
  }
}

// ── Shared raw-text-first GET helper (local to this file — actions have
// their own error type, so this intentionally doesn't import appDataApi's
// internal getJSON) ──────────────────────────────────────────────────────
async function getJSON<T>(endpoint: string, accessToken: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const rawText = await res.text();

  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error(`${LOG_TAG} ❌ Non-JSON response body [${endpoint}]:`, rawText.slice(0, 300));
    throw new SupportActionsApiError(
      `Server returned a non-JSON response (HTTP ${res.status}) for ${endpoint}.`,
      res.status,
      endpoint,
    );
  }

  if (!res.ok) {
    console.error(`${LOG_TAG} ❌ Backend error response [${endpoint}]:`, JSON.stringify(data, null, 2));
    const message = data?.message ?? data?.detail ?? `Request failed (${res.status}) for ${endpoint}`;
    throw new SupportActionsApiError(message, res.status, endpoint);
  }

  return data as T;
}

// ── GET /api/admin/support/tickets/?limit=&offset= ─────────────────────────

export interface FetchSupportTicketsParams {
  /** Results per page. Maps to the backend's `limit` query param. */
  limit?: number;
  /** Index to start from. Maps to the backend's `offset` query param. */
  offset?: number;
}

export async function fetchSupportTickets(
  accessToken: string,
  { limit = 20, offset = 0 }: FetchSupportTicketsParams = {},
): Promise<PaginatedResponse<SupportTicket>> {
  const endpoint = `/api/admin/support/tickets/?limit=${limit}&offset=${offset}`;
  console.log(`${LOG_TAG} 🌐 GET →`, endpoint);
  const data = await getJSON<PaginatedResponse<SupportTicket>>(endpoint, accessToken);
  console.log(`${LOG_TAG} 🎫 tickets (${data.count} total, ${data.results.length} on this page)`);
  return data;
}

// ── GET /api/admin/support/tickets/{id}/messages/ ──────────────────────────

export interface FetchTicketMessagesParams {
  limit?: number;
  offset?: number;
}

export async function fetchTicketMessages(
  ticketId: string,
  accessToken: string,
  { limit, offset }: FetchTicketMessagesParams = {},
): Promise<TicketMessage[]> {
  const query = new URLSearchParams();
  if (limit  !== undefined) query.set('limit', String(limit));
  if (offset !== undefined) query.set('offset', String(offset));
  const qs = query.toString();

  const endpoint = `/api/admin/support/tickets/${ticketId}/messages/${qs ? `?${qs}` : ''}`;
  console.log(`${LOG_TAG} 🌐 GET →`, endpoint);

  const data = await getJSON<TicketMessagesResponse>(endpoint, accessToken);
  const messages = data?.results?.data ?? [];

  console.log(`${LOG_TAG} 💬 messages for ticket ${ticketId} (${data.count} total, ${messages.length} in payload):`, messages);

  return messages;
}

// ── POST /api/admin/support/tickets/{id}/messages/ ─────────────────────────

/**
 * Confirmed request shape: { id: string, message: string, attachments: string[] }
 *
 * ⚠️ Two things not yet confirmed against a live response:
 *  1. What `id` is for — sent here as a client-generated key, most likely
 *     functioning as an idempotency key. If the backend validates/uses it
 *     differently, the error log below will surface the real complaint.
 *  2. `attachments` are almost certainly attachment IDs from a SEPARATE
 *     upload endpoint (not raw files/URLs) — no upload endpoint has been
 *     provided yet, so callers here only pass IDs already obtained elsewhere.
 */
function generateClientMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function sendTicketMessage(
  ticketId: string,
  payload: { message: string; attachments?: string[] },
  accessToken: string,
): Promise<TicketMessage> {
  const endpoint = `/api/admin/support/tickets/${ticketId}/messages/`;

  const body: SendTicketMessagePayload = {
    id: generateClientMessageId(),
    message: payload.message,
    attachments: payload.attachments ?? [],
  };

  console.log(`${LOG_TAG} 🌐 POST →`, endpoint, `[client id ${body.id}]`);

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const rawText = await res.text();
  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error(`${LOG_TAG} ❌ Non-JSON response body [POST ${endpoint}]:`, rawText.slice(0, 300));
    throw new SupportActionsApiError(
      `Server returned a non-JSON response (HTTP ${res.status}) for ${endpoint}.`,
      res.status,
      endpoint,
    );
  }

  if (!res.ok) {
    console.error(`${LOG_TAG} ❌ Failed to send message [${endpoint}] — check if 'id' or 'attachments' failed validation:`, JSON.stringify(data, null, 2));
    const message = data?.message ?? data?.detail ?? `Failed to send message (${res.status})`;
    throw new SupportActionsApiError(message, res.status, endpoint);
  }

  const saved: TicketMessage = data?.data ?? data;
  console.log(`${LOG_TAG} ✅ Message sent [ticket ${ticketId}] — ⚠️ response shape unverified:`, saved);
  return saved;
}

export { SupportActionsApiError };

class CouponsActionsApiError extends Error {
  status:   number;
  endpoint: string;
  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.status = status;
    this.endpoint = endpoint;
    this.name = 'CouponsActionsApiError';
  }
}

function buildCouponBody(payload: CreateCouponPayload): Record<string, unknown> {
  const body: Record<string, unknown> = {
    code:           payload.code,
    description:    payload.description,
    coupon_type:    payload.coupon_type,
    scope:          payload.scope,
    discount_type:  payload.discount_type,
    discount_value: payload.discount_value,
    max_uses:       payload.max_uses,
    valid_from:     payload.valid_from,
    valid_until:    payload.valid_until,
    is_reward:      payload.is_reward ?? false,
  };

  (['item', 'buy_amount', 'get_amount', 'buy_item', 'get_item'] as const).forEach((key) => {
    const value = payload[key];
    if (value !== undefined && value !== null && (value as any) !== '') {
      body[key] = value;
    }
  });

  return body;
}

async function postOrPutJSON(
  method: 'POST' | 'PUT',
  endpoint: string,
  body: Record<string, unknown>,
  accessToken: string,
): Promise<any> {
  console.log(`${LOG_TAG} 🌐 ${method} →`, endpoint, JSON.stringify(body, null, 2));

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const rawText = await res.text();
  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error(`${LOG_TAG} ❌ Non-JSON response body [${method} ${endpoint}]:`, rawText.slice(0, 300));
    throw new CouponsActionsApiError(
      `Server returned a non-JSON response (HTTP ${res.status}) for ${endpoint}.`,
      res.status,
      endpoint,
    );
  }

  if (!res.ok) {
    console.error(`${LOG_TAG} ❌ Failed [${method} ${endpoint}]:`, JSON.stringify(data, null, 2));
    const message = data?.message ?? data?.detail ?? `Request failed (${res.status}) for ${endpoint}`;
    throw new CouponsActionsApiError(message, res.status, endpoint);
  }

  return data;
}

export async function createCoupon(
  payload: CreateCouponPayload,
  accessToken: string,
): Promise<Coupon> {
  const data = await postOrPutJSON('POST', '/api/admin/coupons/create/', buildCouponBody(payload), accessToken);
  console.log(`${LOG_TAG} ✅ Coupon created:`, data);
  return data as Coupon;
}

export async function updateCoupon(
  id: number | string,
  payload: UpdateCouponPayload,
  accessToken: string,
): Promise<Coupon> {
  const data = await postOrPutJSON('PUT', `/api/admin/coupons/update/${id}/`, buildCouponBody(payload), accessToken);
  console.log(`${LOG_TAG} ✅ Coupon updated [id ${id}]:`, data);
  return data as Coupon;
}

export { CouponsActionsApiError };






// ... existing SupportActionsApiError, getJSON, fetchSupportTickets,
// fetchTicketMessages, sendTicketMessage, CouponsActionsApiError,
// buildCouponBody, postOrPutJSON, createCoupon, updateCoupon unchanged ...

// ── GET /api/admin/coupons/wheel/all/ ───────────────────────────────────────
export async function fetchAllSpinWheels(
  accessToken: string,
): Promise<PaginatedResponse<SpinWheel>> {
  const endpoint = '/api/admin/coupons/wheel/all/';
  console.log(`${LOG_TAG} 🌐 GET →`, endpoint);
  const data = await getJSON<PaginatedResponse<SpinWheel>>(endpoint, accessToken);
  console.log(`${LOG_TAG} 🎡 wheels (${data.count} total, ${data.results.length} on this page):`, data);
  return data;
}

// ── GET /api/admin/coupons/wheel/{id}/ ──────────────────────────────────────
export async function fetchSpinWheelDetail(
  id: number | string,
  accessToken: string,
): Promise<SpinWheelDetail> {
  const endpoint = `/api/admin/coupons/wheel/${id}/`;
  console.log(`${LOG_TAG} 🌐 GET →`, endpoint);
  const data = await getJSON<SpinWheelDetail>(endpoint, accessToken);
  console.log(`${LOG_TAG} 🎡 wheel detail [id ${id}] (${data.coupons?.length ?? 0} coupons):`, data);
  return data;
}

// ── POST /api/admin/coupons/wheel/create/ ───────────────────────────────────
export async function createSpinWheel(
  payload: CreateSpinWheelPayload,
  accessToken: string,
): Promise<SpinWheel> {
  const body: Record<string, unknown> = {
    max_entries_amount: payload.max_entries_amount,
    is_active: payload.is_active,
    coupon_ids: payload.coupon_ids,
  };

  const data = await postOrPutJSON('POST', '/api/admin/coupons/wheel/create/', body, accessToken);
  console.log(`${LOG_TAG} ✅ Spinwheel created:`, data);
  return data as SpinWheel;
}

// ── POST /api/admin/support/tickets/{id}/close/ ────────────────────────────
// ── POST /api/admin/support/tickets/{id}/reopen/ ───────────────────────────

/**
 * Confirmed request shape (both endpoints — same body schema, only
 * status/closed_at differ in intent):
 *   { id, category, subject, description, status, priority, is_blocking, closed_at, owner_role }
 *
 * ⚠️ UNVERIFIED — sending the full resource to what's conceptually a
 * status-toggle action is unusual, and two fields are unconfirmed:
 *
 *  1. `description` — not present anywhere on SupportTicket from the list
 *     endpoint (only category/subject exist there, no description). Sent
 *     as '' below since there's no real source for a value. If the
 *     backend rejects an empty description, the error log below will
 *     show it immediately.
 *  2. `closed_at` on REOPEN — the sample payload for reopen still shows a
 *     populated closed_at, which may just be a copy of the close example
 *     rather than real reopen semantics. Sent as `null` here (a reopened
 *     ticket logically shouldn't carry a close timestamp) — flip to a
 *     real timestamp if the backend rejects null.
 */
export interface TicketActionPayload {
  id: string;
  category: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  is_blocking: boolean;
  closed_at: string | null;
  owner_role: OwnerRole;
}

function buildTicketActionBody(
  ticket: SupportTicket,
  status: TicketStatus,
  closedAt: string | null,
): TicketActionPayload {
  return {
    id: ticket.id,
    category: ticket.category,
    subject: ticket.subject,
    description: '', // ⚠️ see header note — not available from the list endpoint
    status,
    priority: ticket.priority,
    is_blocking: ticket.is_blocking,
    closed_at: closedAt,
    owner_role: ticket.owner_role,
  };
}

export async function closeTicket(
  ticket: SupportTicket,
  accessToken: string,
): Promise<SupportTicket> {
  const endpoint = `/api/admin/support/tickets/${ticket.id}/close/`;
  const body = buildTicketActionBody(ticket, 'closed', new Date().toISOString());
  const data = await postOrPutJSON('POST', endpoint, body as unknown as Record<string, unknown>, accessToken);
  console.log(`${LOG_TAG} ✅ Ticket closed [id ${ticket.id}]:`, data);
  return (data?.data ?? data) as SupportTicket;
}

export async function reopenTicket(
  ticket: SupportTicket,
  accessToken: string,
): Promise<SupportTicket> {
  const endpoint = `/api/admin/support/tickets/${ticket.id}/reopen/`;
  const body = buildTicketActionBody(ticket, 'open', null);
  const data = await postOrPutJSON('POST', endpoint, body as unknown as Record<string, unknown>, accessToken);
  console.log(`${LOG_TAG} ✅ Ticket reopened [id ${ticket.id}]:`, data);
  return (data?.data ?? data) as SupportTicket;
}


// ── POST /api/admin/change-password/ ────────────────────────────────────────
export interface ChangePasswordPayload {
  password:     string; // current password
  new_password: string;
}

export async function changeAdminPassword(
  payload: ChangePasswordPayload,
  accessToken: string,
): Promise<void> {
  const endpoint = '/api/admin/change-password/';
  await postOrPutJSON('POST', endpoint, payload as unknown as Record<string, unknown>, accessToken);
  console.log(`${LOG_TAG} ✅ Password changed`);
}

// ── POST /api/admin/logout/ ─────────────────────────────────────────────────
export async function adminLogoutRequest(accessToken: string): Promise<void> {
  const endpoint = '/api/admin/logout/';
  try {
    await postOrPutJSON('POST', endpoint, {}, accessToken);
    console.log(`${LOG_TAG} ✅ Server-side logout confirmed`);
  } catch (err) {
    // Don't let a failed network call trap the admin in a signed-in state —
    // local cleanup proceeds regardless.
    console.warn(`${LOG_TAG} ⚠️ Server logout failed, proceeding with local cleanup anyway:`, err);
  }
}