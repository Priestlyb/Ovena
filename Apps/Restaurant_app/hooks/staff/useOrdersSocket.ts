import { Order } from "@/data/mockOrders";
import {
    STAFF_ORDER_HISTORY_QUERY_KEY,
    StaffOrderHistoryItem,
} from "@/hooks/staff/useStaffOrderHistory";
import { getAccessToken } from "@/utils/authStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const HEARTBEAT_INTERVAL = 25000;
const HEARTBEAT_TIMEOUT = 10000;

const RECONNECT_BASE = 1000;
const RECONNECT_MAX = 30000;
const RECONNECT_JITTER = 0.2;
const MAX_RETRIES = 5;
const ACTIVE_ORDERS_STORAGE_KEY = "active_orders_ws";

const mapBackendStatus = (
    status: string,
): Order["status"] => {
    switch (status) {
        case "pending":
        case "payment_pending":
            return "incoming";

        case "preparing":
            return "preparing";

        case "ready":
            return "ready";

        case "driver_assigned":
            return "driver_assigned";

        case "picked_up":
            return "picked_up";

        case "on_the_way":
        case "in_transit":
            return "on_the_way";

        case "completed":
        case "delivered":
            return "complete";

        case "cancelled":
            return "rejected";

        default:
            return "incoming";
    }
};

type Props = {
    orderType: "food" | "rooms";
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
};

export const useOrdersSocket = ({
    orderType,
    setOrders,
}: Props) => {
    const queryClient = useQueryClient();

    const socketRef = useRef<WebSocket | null>(null);

    const reconnectTimer = useRef<
        ReturnType<typeof setTimeout> | null
    >(null);

    const heartbeatTimer = useRef<
        ReturnType<typeof setInterval> | null
    >(null);

    const pongTimer = useRef<
        ReturnType<typeof setTimeout> | null
    >(null);

    const retryCount = useRef(0);
    const intentionalClose = useRef(false);

    useEffect(() => {
        if (orderType !== "food") return;

        let isMounted = true;

        const clearHeartbeat = () => {
            if (heartbeatTimer.current) {
                clearInterval(heartbeatTimer.current);
                heartbeatTimer.current = null;
            }

            if (pongTimer.current) {
                clearTimeout(pongTimer.current);
                pongTimer.current = null;
            }
        };

        const handleSocketData = (payload: any) => {
            if (!payload?.type) return;

            if (payload.type === "notification") {
                const event = payload.data;

                if (!event?.order_id) return;

                const mappedStatus = mapBackendStatus(event.status);

                queryClient.setQueryData<StaffOrderHistoryItem[]>(
                    STAFF_ORDER_HISTORY_QUERY_KEY,
                    (old) => {
                        if (!old) return old;

                        const orderId = Number(event.order_id);

                        return old.map((order) =>
                            order.id === orderId
                                ? {
                                    ...order,
                                    status: event.status,
                                    driver:
                                        event.driver ??
                                        order.driver,
                                    subtotal:
                                        event.amount != null
                                            ? String(event.amount)
                                            : order.subtotal,
                                }
                                : order,
                        );
                    },
                );

                setOrders((prev) => {
                    const id = String(event.order_id);

                    const index = prev.findIndex(
                        (o) => o.id === id,
                    );

                    const updatedOrder: Order = {
                        id,
                        order_id: event.order_number ?? id,
                        item_name:
                            event.item_name ??
                            `Order #${id}`,
                        price:
                            event.amount != null
                                ? Math.round(Number(event.amount) * 100)
                                : 0,
                        created_at:
                            event.timestamp ??
                            new Date().toISOString(),
                        status: mapBackendStatus(
                            event.status,
                        ),
                        type: "food",
                        customer_name:
                            event.customer_name ??
                            "Customer",
                        customer_phone:
                            event.customer_phone ??
                            "N/A",
                        picked_up_by_user: event.picked_up_by_user ?? false,
                        reference: event.reference,
                    };

                    if (index !== -1) {
                        const updated = [...prev];

                        updated[index] = {
                            ...updated[index],
                            status: updatedOrder.status,
                            price: updatedOrder.price,
                            picked_up_by_user:
                                updatedOrder.picked_up_by_user ??
                                updated[index].picked_up_by_user,
                        };

                        return updated;
                    }

                    return [updatedOrder, ...prev];
                });

                return;
            }

            if (payload.type === "active_orders") {
                const mapped: Order[] = (payload.data || []).map((o: any) => {

                    return {
                        id: String(o.id),
                        order_id: o.order_number,
                        item_name: o.orderer__name || `Order #${o.id}`,

                        price: Math.round(Number(o.subtotal)),

                        created_at: o.created_at,

                        status: mapBackendStatus(o.status),

                        type: "food",

                        customer_name:
                            o.orderer__name || "Customer",

                        customer_phone: "N/A",

                        picked_up_by_user: o.picked_up_by_user,

                        reference:
                            o.last_event_metadata?.reference,
                    };
                });

                setOrders(mapped);
            }
        };

        const connectSocket = async () => {
            try {
                const token = await getAccessToken();

                if (!token) {
                    console.log(
                        "❌ No auth token available",
                    );
                    return;
                }

                const rawToken = token.replace(
                    /^Bearer\s+/i,
                    "",
                );

                const socket = new WebSocket(
                    `wss://ovena-backend-production.up.railway.app/ws/branch/?token=${rawToken}`,
                );

                socketRef.current = socket;

                socket.onopen = () => {

                    retryCount.current = 0;

                    clearHeartbeat();

                    heartbeatTimer.current =
                        setInterval(() => {
                            if (
                                socket.readyState !==
                                WebSocket.OPEN
                            ) {
                                return;
                            }

                            try {
                                const pingPayload = {
                                    type: "ping",
                                    source: "mobile",
                                    timestamp:
                                        Date.now(),
                                };

                                socket.send(
                                    JSON.stringify(
                                        pingPayload,
                                    ),
                                );

                                if (
                                    pongTimer.current
                                ) {
                                    clearTimeout(
                                        pongTimer.current,
                                    );
                                }

                                pongTimer.current =
                                    setTimeout(() => {
                                        console.warn(
                                            "❌ Pong timeout - closing socket",
                                        );

                                        socket.close(
                                            4001,
                                            "pong timeout",
                                        );
                                    }, HEARTBEAT_TIMEOUT);
                            } catch (err) {
                                console.log(
                                    "❌ Heartbeat send failed",
                                    err,
                                );
                            }
                        }, HEARTBEAT_INTERVAL);
                };

                socket.onmessage = async (event) => {

                    try {
                        const parsed = JSON.parse(event.data);

                        if (parsed?.type === "active_orders") {
                            try {
                                await AsyncStorage.setItem(
                                    ACTIVE_ORDERS_STORAGE_KEY,
                                    JSON.stringify(parsed.data),
                                );
                            } catch (storageError) {
                                console.log(
                                    "❌ Failed to save active orders",
                                    storageError,
                                );
                            }
                        }

                        if (parsed?.type === "ping") {
                            const pong = {
                                type: "pong",
                                seq: parsed.seq ?? 0,
                            };

                            socket.send(JSON.stringify(pong));

                            return;
                        }

                        if (parsed?.type === "websocket.ping") {
                            const pong = {
                                type: "websocket.pong",
                                seq: parsed.seq ?? 0,
                            };

                            socket.send(JSON.stringify(pong));

                            return;
                        }

                        if (parsed?.type === "pong") {
                            if (pongTimer.current) {
                                clearTimeout(pongTimer.current);
                                pongTimer.current = null;
                            }

                            return;
                        }

                        if (parsed?.type === "websocket.pong") {
                            if (pongTimer.current) {
                                clearTimeout(pongTimer.current);
                                pongTimer.current = null;
                            }

                            return;
                        }

                        handleSocketData(parsed);
                    } catch (err) {
                        console.log("❌ WS parse error:", err);
                        console.log("❌ Failed payload:", event.data);
                    }
                };

                socket.onerror = (event) => {
                    console.log(
                        "❌ WS ERROR",
                    );
                    console.log(event);
                };

                socket.onclose = (event) => {

                    clearHeartbeat();

                    if (
                        !isMounted ||
                        intentionalClose.current
                    ) {
                        return;
                    }

                    if (
                        retryCount.current >=
                        MAX_RETRIES
                    ) {
                        console.warn(
                            `❌ Max reconnect attempts (${MAX_RETRIES}) reached`,
                        );
                        return;
                    }

                    const delay =
                        Math.min(
                            RECONNECT_BASE *
                            Math.pow(
                                2,
                                retryCount.current,
                            ),
                            RECONNECT_MAX,
                        );

                    const jitter =
                        delay *
                        RECONNECT_JITTER *
                        (Math.random() *
                            2 -
                            1);

                    const wait =
                        Math.round(
                            delay +
                            jitter,
                        );

                    retryCount.current++;

                    console.log(
                        `🔄 Reconnecting in ${wait}ms (attempt ${retryCount.current}/${MAX_RETRIES})`,
                    );

                    reconnectTimer.current =
                        setTimeout(() => {
                            connectSocket();
                        }, wait);
                };
            } catch (err) {
                console.log(
                    "❌ WS setup error",
                    err,
                );
            }
        };

        intentionalClose.current = false;

        connectSocket();

        return () => {
            isMounted = false;
            intentionalClose.current = true;

            clearHeartbeat();

            if (reconnectTimer.current) {
                clearTimeout(
                    reconnectTimer.current,
                );
                reconnectTimer.current =
                    null;
            }

            if (socketRef.current) {

                socketRef.current.close(
                    1000,
                    "component unmount",
                );

                socketRef.current = null;
            }
        };
    }, [orderType, setOrders]);
};