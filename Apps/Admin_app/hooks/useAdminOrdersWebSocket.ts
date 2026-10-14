// hooks/useAdminOrdersWebSocket.ts
//
// Admin equivalent of the driver app's useDriverWebSocket.ts, scoped to the
// single /ws/admin/orders/ channel described in the WS dashboard doc.
//
// ── Isolating one message type in the console ───────────────────────────
// LOG_RAW_MESSAGES below gates the ONE log in this file (tagged
// [AdminOrdersWS]) that fires for every incoming message unconditionally,
// before any type-based routing happens. Per-type logs with their own
// toggles live in context/AdminOrdersWebSocketContext.tsx's LOG_FILTERS.
const LOG_RAW_MESSAGES = false;
//
// Differences from useDriverWebSocket.ts:
//  - One channel, not two (no separate location socket) — admin has
//    nothing analogous to a driver's live GPS stream.
//  - The server pushes a "dashboard" snapshot immediately on connect,
//    rather than waiting for a pull-style "my_orders" message.
//  - `assign_driver` / `force_status` exist here as WS senders because the
//    doc lists them, but the REST equivalents
//    (POST /api/admin/orders/<id>/assign-driver/ and /force-status/) are
//    the ones actually wired for use — see the note above assignDriver()
//    below before calling the WS versions from a screen.
//
// ⚠️ UNCONFIRMED: the ping/pong heartbeat below is carried over from
// useDriverWebSocket.ts (same backend, same team convention) but the admin
// WS doc doesn't document a heartbeat message type for this channel. Left
// active on the assumption it behaves the same — if the admin socket
// doesn't reply to `{"type":"ping"}`, the pong-timeout will force-close an
// otherwise healthy connection every ~35s. First thing to check if
// reconnects happen on a timer regardless of network state.

import { useCallback, useEffect, useRef } from "react";

const WS_BASE = "wss://ovena-backend-production.up.railway.app";
const HEARTBEAT_INTERVAL = 25_000;
const HEARTBEAT_TIMEOUT = 10_000;
const RECONNECT_BASE = 1_000;
const RECONNECT_MAX = 30_000;
const RECONNECT_JITTER = 0.2;
const MAX_RETRIES = 5;

export type WsConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";

// ── Payload shapes (per the WS dashboard doc) ───────────────────────────────

export interface DashboardSnapshot {
  active_by_status: Record<string, number>;
  stuck_orders_count: number;
  payment_failure_count: number;
  cancelled_today_count: number;
  generated_at: string; // ISO
}

// ── failure_points — confirmed shape (captured from a live response) ───────
export interface FailurePointsStuckPayment {
  id: number;
  order_number: number;
  status: "payment_pending" | "awaiting_payment_method" | string;
  payment_retry_count: number;
  last_payment_attempt: string | null; // ISO
  next_retry_at: string | null; // ISO
  created_at: string; // ISO
}

export interface FailurePointsStalledOrder {
  id: number;
  order_number: number;
  status: "pending" | "preparing" | "ready" | string;
  last_modified_at: string; // ISO
  branch__name: string;
}

export interface FailurePointsCancellation {
  order_id: number;
  order__order_number: number;
  timestamp: string; // ISO
  metadata: {
    reason: "payment_timeout" | "branch_cancelled" | "branch_timeout" | string;
  };
  actor_type: "system" | "branch" | string;
}

export interface FailurePoints {
  stuck_payments: FailurePointsStuckPayment[];
  stalled_active_orders: FailurePointsStalledOrder[];
  recent_cancellations: FailurePointsCancellation[];
}

// ── order_events — confirmed shape (captured twice now, consistent) ────────
// A PLAIN ARRAY, not a paginated {count, next, previous, results} wrapper
// — an earlier single sample looked like a paginated wrapper, but a second
// capture confirmed it's actually just OrderEvent[]. No pagination info,
// no order_id on the envelope or on individual events — the `id` on each
// event is that specific status-change record's own id (per-event id, NOT
// the order id), so it's only useful as a React key, never for matching an
// event back to an order. See AdminOrdersWebSocketContext.tsx for how the
// order id is tracked instead (by request, not by payload).
//
// Only `event_type: "created"` observed so far, used for every captured
// transition (not just the literal creation of the order) — old_status/
// new_status is what actually describes the transition. `metadata` varies
// — only `items_count`/`payment_url` observed, rendered generically.
export interface OrderEvent {
  id: number;
  event_type: "created" | string;
  actor_type: "customer" | "system" | "branch" | "admin" | string;
  actor_id: number | null;
  old_status: string | null;
  new_status: string;
  metadata: Record<string, any>;
  timestamp: string; // ISO
}

export type OrderEvents = OrderEvent[];

export interface AdminNotification {
  event:
    | "order_created"
    | "order_cancelled"
    | "driver_matching_exhausted"
    | "driver_acceptance_timeout"
    | "driver_pickup_delayed"
    | "payment_timeout_sweep"
    | "driver_assigned"
    | "status_override"
    | string; // fallback for event types added server-side later
  [key: string]: any;
}

interface UseAdminOrdersWebSocketOptions {
  token: string | null;
  onDashboard?: (data: DashboardSnapshot) => void;
  onFailurePoints?: (data: FailurePoints) => void;
  onOrderEvents?: (data: OrderEvents) => void;
  onAssignDriverResult?: (data: any) => void;
  onForceStatusResult?: (data: any) => void;
  onOrderUpdate?: (data: any) => void;
  onBranchNotification?: (data: any) => void;
  onDriverNotification?: (data: any) => void;
  onAdminNotification?: (data: AdminNotification) => void;
  onStatus?: (status: WsConnectionStatus) => void;
}

// ── Token validation (mirrors useDriverWebSocket's splash-screen check) ────
function isTokenValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(
      decodeURIComponent(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      ),
    );
    if (!payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function useAdminOrdersWebSocket({
  token,
  onDashboard,
  onFailurePoints,
  onOrderEvents,
  onAssignDriverResult,
  onForceStatusResult,
  onOrderUpdate,
  onBranchNotification,
  onDriverNotification,
  onAdminNotification,
  onStatus,
}: UseAdminOrdersWebSocketOptions) {
  const socketRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pongTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intentionalRef = useRef(false);

  const cb = useRef({
    onDashboard,
    onFailurePoints,
    onOrderEvents,
    onAssignDriverResult,
    onForceStatusResult,
    onOrderUpdate,
    onBranchNotification,
    onDriverNotification,
    onAdminNotification,
    onStatus,
  });
  cb.current = {
    onDashboard,
    onFailurePoints,
    onOrderEvents,
    onAssignDriverResult,
    onForceStatusResult,
    onOrderUpdate,
    onBranchNotification,
    onDriverNotification,
    onAdminNotification,
    onStatus,
  };

  const setStatus = useCallback((status: WsConnectionStatus) => {
    cb.current.onStatus?.(status);
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    if (pongTimerRef.current) {
      clearTimeout(pongTimerRef.current);
      pongTimerRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    stopHeartbeat();
    heartbeatRef.current = setInterval(() => {
      const ws = socketRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      try {
        ws.send(JSON.stringify({ type: "ping" }));
      } catch {
        /* ignore */
      }
      pongTimerRef.current = setTimeout(() => {
        console.warn("[AdminOrdersWS] pong timeout — closing");
        ws.close(4001, "pong timeout");
      }, HEARTBEAT_TIMEOUT);
    }, HEARTBEAT_INTERVAL);
  }, [stopHeartbeat]);

  const handleMessage = useCallback((raw: any) => {
    const type = raw?.type ?? "";

    if (type === "ping") {
      try {
        socketRef.current?.send(JSON.stringify({ type: "pong" }));
      } catch {
        /* ignore */
      }
      return;
    }
    if (type === "pong") {
      if (pongTimerRef.current) {
        clearTimeout(pongTimerRef.current);
        pongTimerRef.current = null;
      }
      return;
    }

    switch (type) {
      case "dashboard":
        cb.current.onDashboard?.(raw.data);
        break;
      case "failure_points":
        cb.current.onFailurePoints?.(raw.data);
        break;
      case "order_events":
        cb.current.onOrderEvents?.(raw.data);
        break;
      case "assign_driver_result":
        cb.current.onAssignDriverResult?.(raw.data);
        break;
      case "force_status_result":
        cb.current.onForceStatusResult?.(raw.data);
        break;
      case "order.update":
        cb.current.onOrderUpdate?.(raw.data ?? raw);
        break;
      case "branch_notification":
        cb.current.onBranchNotification?.(raw.data ?? raw);
        break;
      case "driver_notification":
        cb.current.onDriverNotification?.(raw.data ?? raw);
        break;
      case "admin_notification":
        cb.current.onAdminNotification?.(raw.data ?? raw);
        break;
      default:
        console.warn("[AdminOrdersWS] ❓ Unmatched message type:", type, raw);
    }
  }, []);

  const connect = useCallback(
    (url: string) => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }

      if (
        socketRef.current &&
        socketRef.current.readyState < WebSocket.CLOSING
      ) {
        intentionalRef.current = true;
        socketRef.current.close(1000, "reconnecting");
      }

      intentionalRef.current = false;
      setStatus("connecting");

      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        retryCountRef.current = 0;
        setStatus("connected");
        startHeartbeat();
        console.log(`[AdminOrdersWS] Connected: ${url}`);
      };

      ws.onmessage = (e) => {
        let parsed: any = null;
        try {
          parsed = JSON.parse(e.data);
        } catch {
          console.warn("[AdminOrdersWS] Non-JSON message:", e.data);
          return;
        }
        if (LOG_RAW_MESSAGES) {
          console.log(
            "[AdminOrdersWS] 📦 Message:",
            JSON.stringify(parsed, null, 2),
          );
        }
        handleMessage(parsed);
      };

      ws.onerror = () => {
        setStatus("error");
      };

      ws.onclose = (e) => {
        stopHeartbeat();
        console.log(
          `[AdminOrdersWS] Closed — code ${e.code} reason: ${e.reason || "none"}`,
        );

        if (intentionalRef.current) {
          retryCountRef.current = 0;
          setStatus("disconnected");
          return;
        }

        if (retryCountRef.current >= MAX_RETRIES) {
          setStatus("error");
          console.warn(`[AdminOrdersWS] max retries (${MAX_RETRIES}) reached`);
          return;
        }

        const delay = Math.min(
          RECONNECT_BASE * Math.pow(2, retryCountRef.current),
          RECONNECT_MAX,
        );
        const jitter = delay * RECONNECT_JITTER * (Math.random() * 2 - 1);
        const wait = Math.round(delay + jitter);
        retryCountRef.current++;
        setStatus("reconnecting");
        retryTimerRef.current = setTimeout(() => connect(url), wait);
      };
    },
    [handleMessage, setStatus, startHeartbeat, stopHeartbeat],
  );

  const disconnect = useCallback(() => {
    stopHeartbeat();
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    retryCountRef.current = 0;
    if (socketRef.current && socketRef.current.readyState < WebSocket.CLOSING) {
      intentionalRef.current = true;
      socketRef.current.close(1000, "user disconnect");
    }
    setStatus("disconnected");
  }, [stopHeartbeat, setStatus]);

  useEffect(() => {
    if (!token || !isTokenValid(token)) {
      disconnect();
      return;
    }
    const url = `${WS_BASE}/ws/admin/orders/?token=${encodeURIComponent(token)}`;
    connect(url);
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ── Outgoing message senders ──────────────────────────────────────────────

  const send = useCallback((payload: Record<string, unknown>) => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn(
        "[AdminOrdersWS] ⚠️ send() called while not connected:",
        payload,
      );
      return;
    }
    try {
      ws.send(JSON.stringify(payload));
    } catch (err) {
      console.warn("[AdminOrdersWS] send() failed:", err);
    }
  }, []);

  const requestDashboard = useCallback(() => {
    send({ type: "request_dashboard" });
  }, [send]);

  const requestFailurePoints = useCallback(() => {
    send({ type: "request_failure_points" });
  }, [send]);

  const requestOrderEvents = useCallback(
    (orderId: number) => {
      send({ type: "request_order_events", order_id: orderId });
    },
    [send],
  );

  // ⚠️ Prefer the REST equivalents for these two in real screens:
  //   POST /api/admin/orders/<order_id>/assign-driver/  { driver_id }
  //   POST /api/admin/orders/<order_id>/force-status/   { status, reason }
  const assignDriver = useCallback(
    (orderId: number, driverId: number) => {
      send({ type: "assign_driver", order_id: orderId, driver_id: driverId });
    },
    [send],
  );

  const forceStatus = useCallback(
    (orderId: number, status: string, reason: string) => {
      send({ type: "force_status", order_id: orderId, status, reason });
    },
    [send],
  );

  return {
    requestDashboard,
    requestFailurePoints,
    requestOrderEvents,
    assignDriver,
    forceStatus,
    disconnect,
  };
}