import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

type OrderSocketMessage = {
  type?: string;
  message?: string;
  status?: string;
  orderId?: number;
  order_id?: number;
  id?: number;
  [key: string]: any;
};

type UseOrderSocketProps = {
  orderId: number | string;
  token: string;
  enabled?: boolean;
};

export const useOrderSocket = ({
  orderId,
  token,
  enabled = true,
}: UseOrderSocketProps) => {
  const queryClient = useQueryClient();

  const socketRef = useRef<WebSocket | null>(null);

  const reconnectTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const manuallyClosedRef = useRef(false);

  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] =
    useState<OrderSocketMessage | null>(null);

  const disconnect = useCallback(() => {
    manuallyClosedRef.current = true;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    socketRef.current?.close();
    socketRef.current = null;
  }, []);

  const connect = useCallback(() => {
    if (!enabled || !orderId || !token) {
      return;
    }

    if (
      socketRef.current &&
      socketRef.current.readyState !== WebSocket.CLOSED
    ) {
      return;
    }

    manuallyClosedRef.current = false;

    const rawToken = token.replace(/^Bearer\s+/i, "");

    const wsUrl =
      `wss://ovena-backend-production.up.railway.app/ws/orders/${orderId}/?token=${encodeURIComponent(
        rawToken
      )}`;

    // console.log("[WS] Connecting:", orderId);

    const socket = new WebSocket(wsUrl);

    socketRef.current = socket;

    socket.onopen = () => {
      // console.log("[WS] Connected:", orderId);

      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data: OrderSocketMessage = JSON.parse(event.data);

        if (data.type === "ping") {
          socket.send(
            JSON.stringify({
              type: "pong",
            })
          );

          return;
        }

        setLastMessage(data);

        /**
         * Update the cached order immediately.
         */
        queryClient.setQueryData(
          ["menu-order", Number(orderId)],
          (old: any) => {
            if (!old) return old;

            return {
              ...old,
              ...data,
              status: data.status ?? old.status,
            };
          }
        );

        /**
         * Refresh from server to keep everything in sync.
         */
        queryClient.invalidateQueries({
          queryKey: ["menu-order", Number(orderId)],
        });

        /**
         * Refresh history as well.
         */
        queryClient.invalidateQueries({
          queryKey: ["order-history"],
        });

        // console.log("[WS] Update:", data);
      } catch (err) {
        // console.log("[WS] Parse error:", err);
      }
    };

    socket.onerror = (err) => {
      // console.log("[WS] Error:", err);
    };

    socket.onclose = (event) => {
      // console.log("[WS] Closed:", event.code);

      setConnected(false);

      socketRef.current = null;

      if (!manuallyClosedRef.current && enabled) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      }
    };
  }, [enabled, orderId, token, queryClient]);

  useEffect(() => {
    if (!enabled) return;

    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect, enabled]);

  return {
    connected,
    lastMessage,
    connect,
    disconnect,
  };
};