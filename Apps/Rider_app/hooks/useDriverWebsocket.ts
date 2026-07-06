// hooks/useDriverWebSocket.ts
import { useEffect, useRef, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WS_BASE            = "wss://ovena-backend-production.up.railway.app";
const HEARTBEAT_INTERVAL = 25_000;
const HEARTBEAT_TIMEOUT  = 10_000;
const RECONNECT_BASE     = 1_000;
const RECONNECT_MAX      = 30_000;
const RECONNECT_JITTER   = 0.2;
const MAX_RETRIES        = 5;

export interface LocationPayload {
  lat: number; lng: number; heading: number; speed: number; accuracy: number;
}

export type WsConnectionStatus = "disconnected" | "connecting" | "connected" | "reconnecting" | "error";
export interface WsStatus { orders: WsConnectionStatus; location: WsConnectionStatus; }

interface UseDriverWebSocketOptions {
  token:        string | null;
  isOnline:     boolean;
  onOrder:      (order: any) => void;
  onInbox?:     (msg: any) => void;
  onMyOrders?:  (orders: any[]) => void;
  onStatus?:    (status: WsStatus) => void;
}

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

// Envelope types whose .data field contains the real payload.
// Any outer `type` listed here will be unwrapped one level before
// classification. Add new envelope types here as the backend evolves.
const ENVELOPE_TYPES = new Set(["notification", "order_message"]);

export function useDriverWebSocket({
  token, isOnline, onOrder, onInbox, onMyOrders, onStatus,
}: UseDriverWebSocketOptions) {
  const ordersRef      = useRef<ChannelState>(makeChannel());
  const locationRef    = useRef<ChannelState>(makeChannel());
  const onOrderRef     = useRef(onOrder);
  const onInboxRef     = useRef(onInbox);
  const onMyOrdersRef  = useRef(onMyOrders);
  const onStatusRef    = useRef(onStatus);
  const tokenRef       = useRef(token);
  const isOnlineRef    = useRef(isOnline);

  onOrderRef.current    = onOrder;
  onInboxRef.current    = onInbox;
  onMyOrdersRef.current = onMyOrders;
  onStatusRef.current   = onStatus;
  tokenRef.current      = token;
  isOnlineRef.current   = isOnline;

  // ── Status reporting ──────────────────────────────────────────────────────

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

  // ── Heartbeat helpers ─────────────────────────────────────────────────────

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

  // ── Core connect function ─────────────────────────────────────────────────

  const connectChannel = useCallback((
    ch: ChannelState,
    url: string,
    onMessage: (data: any) => void,
    onOpen?: () => void,
  ) => {
    if (ch.retryTimer) { clearTimeout(ch.retryTimer); ch.retryTimer = null; }

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

      if (parsed?.type === "ping") {
        try {
          ws.send(JSON.stringify({ type: "pong", seq: parsed.seq ?? 0 }));
          console.log(`[WS] 🏓 ping received → pong sent (seq: ${parsed.seq ?? 0})`);
        } catch { /* ignore */ }
        if (ch.pongTimer) { clearTimeout(ch.pongTimer); ch.pongTimer = null; }
        return;
      }

      if (parsed?.type === "pong") {
        if (ch.pongTimer) { clearTimeout(ch.pongTimer); ch.pongTimer = null; }
        console.log("[WS] 🏓 pong received — connection confirmed");
        return;
      }

      if (parsed) onMessage(parsed);
    };

    ws.onerror = () => { setStatus(ch, "error"); };

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

  // ── Disconnect helper ─────────────────────────────────────────────────────

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

  // ── Connect / disconnect on token change ──────────────────────────────────

  useEffect(() => {
    if (!token) {
      disconnectChannel(ordersRef.current);
      disconnectChannel(locationRef.current);
      return;
    }

    const encodedToken = encodeURIComponent(token);
    const ordersUrl    = `${WS_BASE}/ws/driver/orders/?token=${encodedToken}`;
    const locationUrl  = `${WS_BASE}/ws/driver/location/?token=${encodedToken}`;

    connectChannel(
      ordersRef.current,
      ordersUrl,
      (rawMessage) => {
        console.log("[Orders WS] 📦 Full order payload received:", JSON.stringify(rawMessage, null, 2));

        const outerType = rawMessage?.type ?? "";

        // ── my_orders bulk push ──────────────────────────────────────────
        // Handled before envelope unwrapping — data is an array, not a
        // single order object.
        if (outerType === "my_orders") {
          const serverOrders = Array.isArray(rawMessage?.data) ? rawMessage.data : [];
          console.log(`[Orders WS] 📋 my_orders push — ${serverOrders.length} orders`);
          onMyOrdersRef.current?.(serverOrders);
          return;
        }

        // ── Unwrap single-order envelopes ────────────────────────────────
        // The backend wraps real payloads in an outer envelope whose `type`
        // is one of the ENVELOPE_TYPES (e.g. "notification", "order_message").
        // When that's the case, the actual data we care about is in `.data`.
        const inner: any = (ENVELOPE_TYPES.has(outerType) && rawMessage?.data != null)
          ? rawMessage.data
          : rawMessage;

        const innerType = (inner?.type ?? "").toLowerCase();

        console.log(`[Orders WS] Outer: "${outerType}" | Inner: "${innerType}"`);
        console.log("[Orders WS] ✅ Unwrapped inner payload:", JSON.stringify(inner, null, 2));

        // ── Classify by shape ─────────────────────────────────────────────
        // A "full order" push has delivery/location/customer data that is
        // needed to populate the pickup modal.
        // An "inbox notification" carries only a message/status update.
        const isFullOrderPayload =
          Boolean(inner?.order_id) && (
            Boolean(inner?.branch) ||
            Boolean(inner?.customer_destination) ||
            Boolean(inner?.delivery_address) ||
            Boolean(inner?.items) ||
            Boolean(inner?.restaurant)
          );

        const isInboxNotification =
          !isFullOrderPayload && (
            innerType.startsWith("order.") ||
            innerType === "notification"   ||
            Boolean(inner?.message)
          );

        if (isFullOrderPayload) {
          console.log(`[Orders WS] ✅ Full order — order_id: ${inner.order_id} — triggering pickup modal`);
          onOrderRef.current(inner);
        } else if (isInboxNotification) {
          console.log(`[Orders WS] 📬 Inbox notification (type: "${innerType}") — routing to inbox`);
          onInboxRef.current?.(inner);
        } else {
          console.warn("[Orders WS] ❓ Unmatched message — ignoring:", innerType, inner);
        }
      },
    );

    connectChannel(
      locationRef.current,
      locationUrl,
      (_data) => { /* pong handled in ws.onmessage above */ },
      () => {
        locationRef.current.socket?.send(
          JSON.stringify({ type: "status", is_available: isOnlineRef.current })
        );
      },
    );

    return () => {
      disconnectChannel(ordersRef.current);
      disconnectChannel(locationRef.current);
    };
  }, [token]);

  // ── Send availability when isOnline changes ───────────────────────────────

  useEffect(() => {
    const loc = locationRef.current;
    if (!loc.socket || loc.socket.readyState !== WebSocket.OPEN) return;
    try {
      loc.socket.send(JSON.stringify({ type: "status", is_available: isOnline }));
    } catch { /* ignore */ }
  }, [isOnline]);

  // ── Public API ────────────────────────────────────────────────────────────

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

  const sendStatus = useCallback((available: boolean) => {
    const loc = locationRef.current;
    if (!loc.socket || loc.socket.readyState !== WebSocket.OPEN) return;
    try {
      loc.socket.send(JSON.stringify({ type: "status", is_available: available }));
    } catch { /* ignore */ }
  }, []);

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

    const body: Record<string, any> = { action, order_id };
    if (action === "deliver") body.order_code = order_code;

    if (action === "deliver") {
      console.log(`[driverAction] ➡️  POST — action: "deliver", order_id: ${order_id}, order_code: "${order_code ?? "(missing)"}"`);
    } else {
      console.log(`[driverAction] ➡️  POST — action: "${action}", order_id: ${order_id}`);
    }

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
      try { json = await res.json(); } catch {
        console.warn(`[driverAction] ⚠️  "${action}" — response was not JSON (status ${res.status})`);
      }

      if (res.ok) {
        console.log(`[driverAction] ✅ "${action}" succeeded (${res.status}):`, JSON.stringify(json));

        if (action === "accept") {
          const acceptOrderCode =
            json?.order_code ?? json?.data?.order_code ?? json?.order?.order_code ?? null;

          if (acceptOrderCode) {
            console.log(`[driverAction] 📦 Order code for OnItsWayModal: "${acceptOrderCode}"`);
          } else {
            console.warn(`[driverAction] ⚠️  Accept succeeded but no order_code in response:`, json);
          }
        }
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