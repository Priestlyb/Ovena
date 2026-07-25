/**
 * services/driverActionsApi.ts
 *
 * Handles driver-initiated write actions against the backend — POST and
 * PUT requests that change state (as opposed to appDataApi.ts, which is
 * read-only GET). Uses the same raw-text-first parsing + console logging
 * convention as authApi.ts and appDataApi.ts, so every request/response
 * is visible in the Metro log while debugging.
 *
 * Currently implemented:
 *   - markNotificationRead(notification, token) → POST /api/driver/notifications/{id}/mark_read/
 *   - markAllNotificationsRead(token)            → POST /api/driver/notifications/read_all/
 *
 * putJSON is included and ready for the first PUT-based action endpoint —
 * nothing currently calls it.
 */

import {
  DriverNotification,
  MarkNotificationReadPayload,
  ReadAllNotificationsResponse,
} from '../types/driverActions';

const BASE_URL = 'https://ovena-backend-production.up.railway.app';
const LOG_TAG  = '[driverActionsApi]';

class DriverActionsApiError extends Error {
  status:   number;
  endpoint: string;
  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.status = status;
    this.endpoint = endpoint;
    this.name = 'DriverActionsApiError';
  }
}

// ── Shared response handling ──────────────────────────────────────────────────
async function handleResponse<T>(res: Response, endpoint: string, method: string): Promise<T> {
  const rawText = await res.text();
  console.log(`${LOG_TAG} 📥 Raw response (${res.status}) [${method} ${endpoint}]:`, rawText.slice(0, 500));

  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error(`${LOG_TAG} ❌ Non-JSON response body [${method} ${endpoint}]:`, rawText.slice(0, 300));
    throw new DriverActionsApiError(
      `Server returned a non-JSON response (HTTP ${res.status}) for ${method} ${endpoint}.`,
      res.status,
      endpoint,
    );
  }

  if (!res.ok) {
    console.error(`${LOG_TAG} ❌ Backend error response [${method} ${endpoint}]:`, JSON.stringify(data, null, 2));
    const message = data?.message ?? data?.detail ?? `Request failed (${res.status}) for ${method} ${endpoint}`;
    throw new DriverActionsApiError(message, res.status, endpoint);
  }

  console.log(`${LOG_TAG} ✅ Response [${method} ${endpoint}]:`, JSON.stringify(data, null, 2));
  return data as T;
}

// ── POST helper ────────────────────────────────────────────────────────────────
async function postJSON<T>(endpoint: string, body: object | undefined, token: string): Promise<T> {
  console.log(`${LOG_TAG} 🌐 POST →`, endpoint);
  if (body) console.log(`${LOG_TAG} 📤 Payload:`, JSON.stringify(body, null, 2));

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res, endpoint, 'POST');
}

// ── PUT helper — ready for the first PUT-based action, unused for now ─────────
async function putJSON<T>(endpoint: string, body: object, token: string): Promise<T> {
  console.log(`${LOG_TAG} 🌐 PUT →`, endpoint);
  console.log(`${LOG_TAG} 📤 Payload:`, JSON.stringify(body, null, 2));

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method:  'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res, endpoint, 'PUT');
}

// ── Notifications: mark one as read ─────────────────────────────────────────────
export async function markNotificationRead(
  notification: MarkNotificationReadPayload,
  token: string,
): Promise<DriverNotification> {
  if (notification?.id == null) {
    throw new DriverActionsApiError('markNotificationRead() called without a valid id', 400, '/api/driver/notifications/{id}/mark_read/');
  }

  const { id } = notification;

  return postJSON<DriverNotification>(
    `/api/driver/notifications/${id}/mark_read/`,
    notification, // full notification object as the body — id is duplicated in both the URL and the body
    token,
  );
}

// ── Notifications: mark all as read ─────────────────────────────────────────────
export async function markAllNotificationsRead(
  token: string,
): Promise<ReadAllNotificationsResponse> {
  const result = await postJSON<ReadAllNotificationsResponse>(
    '/api/driver/notifications/read_all/',
    undefined, // no body sent — see file header note on the ⚠️ unverified response shape
    token,
  );

  console.log(
    `${LOG_TAG} ℹ️ read_all response shape:`,
    Array.isArray(result) ? `array (${result.length} notifications)` : 'single object',
  );

  return result;
}

export { DriverActionsApiError };