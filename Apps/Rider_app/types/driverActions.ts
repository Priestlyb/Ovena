/**
 * types/driverActions.ts
 * Shapes for driver-initiated actions against the backend (notifications,
 * and any future POST/PUT action endpoints added to driverActionsApi.ts).
 */

export type NotificationType = 'generic' | string; // widen — only "generic" seen so far, not confirmed exhaustive

export interface DriverNotification {
  id: number;
  notification_type: NotificationType;
  title: string;
  body: string;
  payload_json: string; // sent as a JSON-encoded string, not a nested object — parse separately if needed
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}



// Request body for POST /api/driver/notifications/{id}/mark_read/
// Note: `id` also travels in the URL path — the backend appears to want it
// duplicated in the body too. No `created_at` here (response-only field).
export interface MarkNotificationReadPayload {
  id: number;
  notification_type: NotificationType;
  title: string;
  body: string;
  payload_json: string;
  is_read: boolean;
  read_at: string; // ISO string — caller supplies this, e.g. new Date().toISOString()
}


// ⚠️ UNVERIFIED — the sample provided for /read_all/ was a single
// DriverNotification object, which looks like it may actually document the
// mark_read response schema rather than what read_all really returns.
// Widened to accept either shape until confirmed against a live call.
export type ReadAllNotificationsResponse = DriverNotification | DriverNotification[];