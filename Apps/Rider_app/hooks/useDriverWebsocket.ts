// hooks/useDriverWebSocket.ts
//
// Manages the two driver WebSocket channels described in the Ovena harness:
//
//   Orders   ws://<host>/ws/driver/orders/?token=<accessToken>
//            ← receives incoming order objects pushed by the backend
//
//   Location ws://<host>/ws/driver/location/?token=<accessToken>
//            → sends location_update  { type, lat, lng, heading, speed, accuracy }
//            → sends status           { type, is_available }
//            ← heartbeat ping/pong (every 25 s, 10 s timeout)
//
// Both channels auto-reconnect with exponential back-off + ±20 % jitter,
// up to MAX_RETRIES attempts, matching the harness behaviour exactly.
//
// Usage:
//   const { sendLocation, sendStatus, wsStatus } = useDriverWebSocket({
//     token:      accessToken,
//     isOnline:   online,
//     onOrder:    (order) => { /* handle incoming order */ },
//   });

import { useEffect, useRef, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ── Config (mirrors the harness) ─────────────────────────────────────────────
const WS_BASE            = "wss://ovena-backend-production.up.railway.app";
const HEARTBEAT_INTERVAL = 25_000;   // ms — send ping every 25 s
const HEARTBEAT_TIMEOUT  = 10_000;   // ms — close if no pong within 10 s
const RECONNECT_BASE     = 1_000;    // ms — first retry delay
const RECONNECT_MAX      = 30_000;   // ms — max retry delay
const RECONNECT_JITTER   = 0.2;      // ±20 %
const MAX_RETRIES        = 5;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LocationPayload {
  lat:      number;
  lng:      number;
  heading:  number;
  speed:    number;
  accuracy: number;
}

export type WsConnectionStatus = "disconnected" | "connecting" | "connected" | "reconnecting" | "error";

export interface WsStatus {
  orders:   WsConnectionStatus;
  location: WsConnectionStatus;
}

interface UseDriverWebSocketOptions {
  /** JWT access token — both sockets use this */
  token:     string | null;
  /** Whether the driver is currently online — sent as status message on change */
  isOnline:  boolean;
  /** Called when the backend pushes a full order (order.driver_assigned) */
  onOrder:   (order: any) => void;
  /** Called when the backend pushes a short notification (order_message) */
  onInbox?:  (msg: any) => void;
  /** Optional: called when WS connection statuses change */
  onStatus?: (status: WsStatus) => void;
}

// ── Channel state ─────────────────────────────────────────────────────────────

interface ChannelState {
  socket:         WebSocket | null;
  retryCount:     number;
  retryTimer:     ReturnType<typeof setTimeout> | null;
  heartbeatTimer: ReturnType<typeof setInterval> | null;
  pongTimer:      ReturnType<typeof setTimeout> | null;
  intentional:    boolean;
  status:         WsConnectionStatus;
}

function makeChannel(): ChannelState {
  return {
    socket: null, retryCount: 0, retryTimer: null,
    heartbeatTimer: null, pongTimer: null,
    intentional: false, status: "disconnected",
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDriverWebSocket({
  token, isOnline, onOrder, onInbox, onStatus,
}: UseDriverWebSocketOptions) {
  const ordersRef   = useRef<ChannelState>(makeChannel());
  const locationRef = useRef<ChannelState>(makeChannel());
  const onOrderRef  = useRef(onOrder);
  const onInboxRef  = useRef(onInbox);
  const onStatusRef = useRef(onStatus);
  const tokenRef    = useRef(token);
  const isOnlineRef = useRef(isOnline);

  // Keep refs current without restarting sockets
  onOrderRef.current  = onOrder;
  onInboxRef.current  = onInbox;
  onStatusRef.current = onStatus;
  tokenRef.current    = token;
  isOnlineRef.current = isOnline;

  // ── Status reporting ────────────────────────────────────────────────────────

  const reportStatus = useCallback(() => {
    onStatusRef.current?.({
      orders:   ordersRef.current.status,
      location: locationRef.current.status,
    });
  }, []);

  const setStatus = useCallback((ch: ChannelState, status: WsConnectionStatus) => {
    ch.status = status;
    reportStatus();
  }, [reportStatus]);

  // ── Heartbeat helpers ───────────────────────────────────────────────────────

  const stopHeartbeat = useCallback((ch: ChannelState) => {
    if (ch.heartbeatTimer) { clearInterval(ch.heartbeatTimer); ch.heartbeatTimer = null; }
    if (ch.pongTimer)      { clearTimeout(ch.pongTimer);       ch.pongTimer      = null; }
  }, []);

  const startHeartbeat = useCallback((ch: ChannelState) => {
    stopHeartbeat(ch);
    ch.heartbeatTimer = setInterval(() => {
      if (!ch.socket || ch.socket.readyState !== WebSocket.OPEN) return;
      try { ch.socket.send(JSON.stringify({ type: "ping" })); } catch { /* ignore */ }
      ch.pongTimer = setTimeout(() => {
        console.warn("[WS] pong timeout — closing");
        ch.socket?.close(4001, "pong timeout");
      }, HEARTBEAT_TIMEOUT);
    }, HEARTBEAT_INTERVAL);
  }, [stopHeartbeat]);

  // ── Core connect function ───────────────────────────────────────────────────

  const connectChannel = useCallback((
    ch: ChannelState,
    url: string,
    onMessage: (data: any) => void,
    onOpen?: () => void,
  ) => {
    // Clear any pending retry
    if (ch.retryTimer) { clearTimeout(ch.retryTimer); ch.retryTimer = null; }

    // Close existing socket cleanly
    if (ch.socket && ch.socket.readyState < WebSocket.CLOSING) {
      ch.intentional = true;
      ch.socket.close(1000, "reconnecting");
    }

    ch.intentional = false;
    setStatus(ch, "connecting");

    const ws = new WebSocket(url);
    ch.socket = ws;

    ws.onopen = () => {
      ch.retryCount = 0;
      setStatus(ch, "connected");
      startHeartbeat(ch);
      console.log(`[WS] Connected: ${url}`);
      onOpen?.();
    };

    ws.onmessage = (e) => {
      let parsed: any = null;
      try { parsed = JSON.parse(e.data); } catch { /* raw */ }

      // Handle server ping → reply with pong (server expects this to confirm connection)
      // Also handle pong replies to our own outgoing pings → clear the timeout timer
      if (parsed?.type === "ping") {
        // Server sent a ping — reply with pong including the seq number
        try {
          ws.send(JSON.stringify({ type: "pong", seq: parsed.seq ?? 0 }));
          console.log(`[WS] 🏓 ping received → pong sent (seq: ${parsed.seq ?? 0})`);
        } catch { /* ignore send errors */ }
        if (ch.pongTimer) { clearTimeout(ch.pongTimer); ch.pongTimer = null; }
        return;
      }

      if (parsed?.type === "pong") {
        // This is a reply to our own outgoing ping — clear the timeout timer
        if (ch.pongTimer) { clearTimeout(ch.pongTimer); ch.pongTimer = null; }
        console.log("[WS] 🏓 pong received — connection confirmed");
        return;
      }

      if (parsed) onMessage(parsed);
    };

    ws.onerror = () => {
      setStatus(ch, "error");
    };

    ws.onclose = (e) => {
      stopHeartbeat(ch);
      console.log(`[WS] Closed: ${url} — code ${e.code} reason: ${e.reason || "none"}`);
      if (ch.intentional) {
        ch.retryCount = 0;
        setStatus(ch, "disconnected");
        return;
      }

      if (ch.retryCount >= MAX_RETRIES) {
        setStatus(ch, "error");
        console.warn(`[WS] max retries (${MAX_RETRIES}) reached`);
        return;
      }

      const delay  = Math.min(RECONNECT_BASE * Math.pow(2, ch.retryCount), RECONNECT_MAX);
      const jitter = delay * RECONNECT_JITTER * (Math.random() * 2 - 1);
      const wait   = Math.round(delay + jitter);
      ch.retryCount++;
      setStatus(ch, "reconnecting");
      ch.retryTimer = setTimeout(() => {
        connectChannel(ch, url, onMessage, onOpen);
      }, wait);
    };
  }, [setStatus, startHeartbeat, stopHeartbeat]);

  // ── Disconnect helper ───────────────────────────────────────────────────────

  const disconnectChannel = useCallback((ch: ChannelState) => {
    stopHeartbeat(ch);
    if (ch.retryTimer) { clearTimeout(ch.retryTimer); ch.retryTimer = null; }
    ch.retryCount = 0;
    if (ch.socket && ch.socket.readyState < WebSocket.CLOSING) {
      ch.intentional = true;
      ch.socket.close(1000, "user disconnect");
    }
    setStatus(ch, "disconnected");
  }, [stopHeartbeat, setStatus]);

  // ── Connect / disconnect when token or online state changes ─────────────────

  useEffect(() => {
    if (!token) {
      // No token — ensure both channels are closed
      disconnectChannel(ordersRef.current);
      disconnectChannel(locationRef.current);
      return;
    }

    const encodedToken = encodeURIComponent(token);
    const ordersUrl    = `${WS_BASE}/ws/driver/orders/?token=${encodedToken}`;
    const locationUrl  = `${WS_BASE}/ws/driver/location/?token=${encodedToken}`;

    // Orders channel — receives new order events from the backend
    connectChannel(
      ordersRef.current,
      ordersUrl,
      (rawMessage) => {
        console.log("[Orders WS] Message received:", JSON.stringify(rawMessage, null, 2));

        // The backend wraps every message in an outer envelope:
        // { type: "notification", data: { type: "notification" | "order_message", ... } }
        //
        // Routing based on the INNER data.type:
        //   "notification"  → full order payload with coordinates → onOrderRef (shows pickup modal)
        //   "order_message" → short status/inbox notification     → onInboxRef (stores in inbox)
        //
        // Always extract the inner payload first.
        const outerType = rawMessage?.type ?? "";
        const inner     = (outerType === "notification" && rawMessage?.data)
                            ? rawMessage.data
                            : rawMessage;

        const innerType = (inner?.type ?? "").toLowerCase();

        console.log(`[Orders WS] Outer type: "${outerType}" | Inner type: "${innerType}"`);

        if (innerType === "order_message") {
          // Full order data — triggers pickup modal
          console.log("[Orders WS] ✅ Full order payload (type: order_message) — triggering pickup modal");
          onOrderRef.current(inner);
        } else if (innerType === "notification") {
          // Short status/inbox notification — goes to inbox only
          console.log("[Orders WS] 📬 Inbox message (type: notification) — routing to inbox");
          onInboxRef.current?.(inner);
        } else {
          console.warn("[Orders WS] ❓ Unmatched inner type — ignoring:", innerType, inner);
        }
      },
    );

    // Location channel — sends GPS updates to the backend
    // On open, immediately broadcast the driver's current availability
    connectChannel(
      locationRef.current,
      locationUrl,
      (_data) => { /* responses from location channel are mostly pong, handled above */ },
      () => {
        // Send current availability status as soon as the location socket opens
        const available = isOnlineRef.current;
        locationRef.current.socket?.send(
          JSON.stringify({ type: "status", is_available: available })
        );
      },
    );

    return () => {
      disconnectChannel(ordersRef.current);
      disconnectChannel(locationRef.current);
    };
  }, [token]); // Only re-run when token changes — not on isOnline change

  // ── Send availability status when isOnline changes ───────────────────────────

  useEffect(() => {
    const loc = locationRef.current;
    if (!loc.socket || loc.socket.readyState !== WebSocket.OPEN) return;
    try {
      loc.socket.send(JSON.stringify({ type: "status", is_available: isOnline }));
    } catch { /* ignore if socket is closing */ }
  }, [isOnline]);

  // ── Public API ───────────────────────────────────────────────────────────────

  /**
   * Send the driver's current GPS position to the backend.
   * Call this from UserLocation.onUpdate in DriverMapView.
   */
  const sendLocation = useCallback((payload: LocationPayload) => {
    const loc = locationRef.current;
    if (!loc.socket || loc.socket.readyState !== WebSocket.OPEN) return;
    try {
      loc.socket.send(JSON.stringify({
        type:     "location_update",
        lat:      payload.lat,
        lng:      payload.lng,
        heading:  payload.heading,
        speed:    payload.speed,
        accuracy: payload.accuracy,
      }));
    } catch { /* ignore */ }
  }, []);

  /**
   * Manually send an availability status (used for Go Online / Go Offline).
   * Usually called automatically via the isOnline useEffect above, but
   * exposed here for explicit control if needed.
   */
  const sendStatus = useCallback((available: boolean) => {
    const loc = locationRef.current;
    if (!loc.socket || loc.socket.readyState !== WebSocket.OPEN) return;
    try {
      loc.socket.send(JSON.stringify({ type: "status", is_available: available }));
    } catch { /* ignore */ }
  }, []);

  /**
   * POST to /menu/driver-order/ — accept, reject, or deliver an order.
   * For "deliver" the order_code (passphrase from customer) is required.
   */
  const postDriverAction = useCallback(async (
    action: "accept" | "reject" | "deliver",
    order_id: number,
    order_code?: string,
  ) => {
    const t = tokenRef.current;

    if (!t) {
      console.warn(`[driverAction] ⚠️  Cannot POST "${action}" — no auth token available`);
      return;
    }

    if (!order_id) {
      console.warn(`[driverAction] ⚠️  Cannot POST "${action}" — order_id is missing`);
      return;
    }

    // Build payload — each action has a distinct required shape
    const body: Record<string, any> = { action, order_id: order_id };

    if (action === "deliver") {
      // order_code is required for deliver; warn loudly if missing so it's caught early
      if (!order_code || !order_code.trim()) {
        console.warn("[driverAction] ⚠️  deliver action called without order_code — sending anyway, backend may reject");
      } else {
        body.order_code = order_code.trim();
      }
    }

    console.log(`[driverAction] ➡️  POST /menu/driver-order/ — action: "${action}", order_id: ${order_id}${action === "deliver" ? `, order_code: "${body.order_code ?? "(missing)"}"` : ""}`);

    try {
      const res = await fetch(
        "https://ovena-backend-production.up.railway.app/api/menu/driver-order/",
        {
          method:  "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:  `Bearer ${t}`,
          },
          body: JSON.stringify(body),
        }
      );

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        console.warn(`[driverAction] ⚠️  "${action}" — response was not JSON (status ${res.status})`);
      }

      if (res.ok) {
        console.log(`[driverAction] ✅ "${action}" succeeded (${res.status}):`, JSON.stringify(json));
      } else {
        console.warn(`[driverAction] ❌ "${action}" failed (${res.status}):`, JSON.stringify(json));
      }

      return json;
    } catch (err) {
      console.warn(`[driverAction] 🔴 Network error on "${action}":`, err);
    }
  }, []);

  return { sendLocation, sendStatus, postDriverAction };
}