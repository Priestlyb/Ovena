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