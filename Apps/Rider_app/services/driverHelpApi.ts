/**
 * services/driverHelpApi.ts
 *
 * Support ticket endpoints for the driver app's Help & Support screen.
 * Mirrors the raw-text-first parsing + emoji console logging convention
 * used in appDataApi.ts (GET, cache-busted) and driverActionsApi.ts
 * (POST, typed error class).
 *
 *   GET  /api/driver/help/tickets/                → list driver's tickets
 *   POST /api/driver/help/tickets/                → create a new ticket
 *   GET  /api/driver/help/tickets/{id}/messages/   → list messages for a ticket
 *   POST /api/driver/help/tickets/{id}/messages/   → send a message on a ticket
 */

import {
  SupportTicket,
  TicketMessage,
  CreateTicketPayload,
} from '../types/driverHelp';

const BASE_URL = 'https://ovena-backend-production.up.railway.app';
const LOG_TAG  = '[driverHelpApi]';

export class DriverHelpApiError extends Error {
  status:   number;
  endpoint: string;
  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.status = status;
    this.endpoint = endpoint;
    this.name = 'DriverHelpApiError';
  }
}

async function handleResponse<T>(res: Response, endpoint: string, method: string): Promise<T> {
  const rawText = await res.text();
  console.log(`${LOG_TAG} 📥 Raw response (${res.status}) [${method} ${endpoint}]:`, rawText.slice(0, 500));

  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error(`${LOG_TAG} ❌ Non-JSON response body [${method} ${endpoint}]:`, rawText.slice(0, 300));
    throw new DriverHelpApiError(
      `Server returned a non-JSON response (HTTP ${res.status}) for ${method} ${endpoint}.`,
      res.status,
      endpoint,
    );
  }

  if (!res.ok) {
    console.error(`${LOG_TAG} ❌ Backend error response [${method} ${endpoint}]:`, JSON.stringify(data, null, 2));
    const message = data?.message ?? data?.detail ?? `Request failed (${res.status}) for ${method} ${endpoint}`;
    throw new DriverHelpApiError(message, res.status, endpoint);
  }

  console.log(`${LOG_TAG} ✅ Response [${method} ${endpoint}]:`, JSON.stringify(data, null, 2));
  return data as T;
}

// ── GET helper — cache-busted, same convention as appDataApi.authGet ─────────
async function getJSON<T>(endpoint: string, token: string): Promise<T> {
  const bustedUrl =
    `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}_ts=${Date.now()}`;

  console.log(`${LOG_TAG} 🌐 GET →`, endpoint);

  const res = await fetch(bustedUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
    },
    cache: 'no-store',
  });

  return handleResponse<T>(res, endpoint, 'GET');
}

// ── POST helper ────────────────────────────────────────────────────────────
async function postJSON<T>(endpoint: string, body: object, token: string): Promise<T> {
  console.log(`${LOG_TAG} 🌐 POST →`, endpoint);
  console.log(`${LOG_TAG} 📤 Payload:`, JSON.stringify(body, null, 2));

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res, endpoint, 'POST');
}

// ── List tickets ───────────────────────────────────────────────────────────
export interface TicketsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SupportTicket[];
}

export async function fetchDriverTickets(token: string): Promise<TicketsListResponse> {
  return getJSON<TicketsListResponse>('/api/driver/help/tickets/', token);
}

// ── Create ticket ──────────────────────────────────────────────────────────
export interface CreateTicketResponse {
  detail?: string;
  data?: SupportTicket;
  [key: string]: any;
}

export async function createDriverTicket(
  payload: CreateTicketPayload,
  token: string,
): Promise<CreateTicketResponse> {
  return postJSON<CreateTicketResponse>('/api/driver/help/tickets/', payload, token);
}

// ── Ticket messages ────────────────────────────────────────────────────────
export interface TicketMessagesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    detail: string;
    data: TicketMessage[];
  };
}

export async function fetchTicketMessages(
  ticketId: string,
  token: string,
): Promise<TicketMessagesResponse> {
  return getJSON<TicketMessagesResponse>(`/api/driver/help/tickets/${ticketId}/messages/`, token);
}

export interface SendTicketMessagePayload {
  id: string; // ticket id — duplicated in URL and body, same convention as markNotificationRead
  message: string;
  attachments: string[];
}

export async function sendTicketMessage(
  ticketId: string,
  payload: SendTicketMessagePayload,
  token: string,
): Promise<TicketMessage> {
  return postJSON<TicketMessage>(`/api/driver/help/tickets/${ticketId}/messages/`, payload, token);
}