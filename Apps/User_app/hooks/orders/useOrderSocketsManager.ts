import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useQueryClient } from "@tanstack/react-query";

type OrderSocketMessage = {
    type?: string;
    status?: string;
    message?: string;
    orderId?: number;
    order_id?: number;
    id?: number;
    [key: string]: any;
};

type Order = {
    id: number | string;
    status?: string;
    [key: string]: any;
};

type Props = {
    orders: Order[];
    token: string;
    enabled?: boolean;
    onOrderUpdate?: (
        orderId: number | string,
        data: OrderSocketMessage,
    ) => void;
};

const TERMINAL_STATUSES = [
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
];

export const useOrderSocketsManager = ({
    orders,
    token,
    enabled = true,
    onOrderUpdate,
}: Props) => {
    const queryClient = useQueryClient();

    const socketsRef = useRef<Map<string, WebSocket>>(
        new Map(),
    );

    const onOrderUpdateRef = useRef(onOrderUpdate);

    const [connectedOrderIds, setConnectedOrderIds] =
        useState<(string | number)[]>([]);

    /**
     * Always keep the latest callback without
     * causing the socket effect to re-run.
     */
    useEffect(() => {
        onOrderUpdateRef.current = onOrderUpdate;
    }, [onOrderUpdate]);

    /**
     * Stable dependency so the effect only runs when
     * order ids/statuses actually change.
     */
    const ordersKey = useMemo(
        () =>
            orders
                .map(
                    (order) =>
                        `${order.id}:${order.status ?? ""}`,
                )
                .sort()
                .join("|"),
        [orders],
    );

    useEffect(() => {
        if (!enabled || !token) {
            return;
        }

        const activeOrders = orders.filter(
            (order) =>
                order.id &&
                !TERMINAL_STATUSES.includes(
                    String(order.status ?? "").toUpperCase(),
                ),
        );

        const activeIds = new Set(
            activeOrders.map((order) => String(order.id)),
        );

        /**
         * Close sockets that are no longer needed.
         */
        socketsRef.current.forEach((socket, id) => {
            if (!activeIds.has(id)) {
                if (
                    socket.readyState === WebSocket.OPEN ||
                    socket.readyState === WebSocket.CONNECTING
                ) {
                    socket.close();
                }

                socketsRef.current.delete(id);

                setConnectedOrderIds((prev) =>
                    prev.filter(
                        (value) => String(value) !== id,
                    ),
                );
            }
        });

        /**
         * Open sockets for new active orders.
         */
        activeOrders.forEach((order) => {
            const key = String(order.id);

            if (socketsRef.current.has(key)) {
                return;
            }

            const rawToken = token.replace(
                /^Bearer\s+/i,
                "",
            );

            const url =
                `wss://ovena-backend-production.up.railway.app/ws/orders/${order.id}/?token=${encodeURIComponent(
                    rawToken,
                )}`;

            console.log(
                "[WS MANAGER] Connecting:",
                order.id,
            );

            const socket = new WebSocket(url);

            socketsRef.current.set(key, socket);

            /**
             * WebSocket connected.
             */
            socket.onopen = () => {
                console.log(
                    "[WS MANAGER] Connected:",
                    order.id,
                );

                setConnectedOrderIds((prev) =>
                    prev.includes(order.id)
                        ? prev
                        : [...prev, order.id],
                );
            };

            /**
             * WebSocket message received.
             */
            socket.onmessage = (event) => {
                try {
                    const data: OrderSocketMessage =
                        JSON.parse(event.data);

                    /**
                     * Ignore ping messages and respond
                     * with pong.
                     */
                    if (data.type === "ping") {
                        socket.send(
                            JSON.stringify({
                                type: "pong",
                            }),
                        );

                        return;
                    }

                    /**
                     * Determine which order the message
                     * belongs to.
                     */
                    const messageOrderId =
                        data.orderId ??
                        data.order_id ??
                        data.id ??
                        order.id;

                    console.log(
                        "[WS MANAGER] Update:",
                        messageOrderId,
                        data,
                    );

                    /**
                     * Notify the component using this hook.
                     */
                    onOrderUpdateRef.current?.(
                        messageOrderId,
                        data,
                    );

                    /**
                     * ----------------------------------------
                     * UPDATE INDIVIDUAL ORDER CACHE
                     * ----------------------------------------
                     *
                     * Update the cached menu-order query
                     * immediately so the UI can respond
                     * without waiting for the API.
                     */
                    if (data.status) {
                        const numericOrderId =
                            Number(messageOrderId);

                        queryClient.setQueryData(
                            ["menu-order", numericOrderId],
                            (old: any) => {
                                if (!old) {
                                    return old;
                                }

                                return {
                                    ...old,
                                    ...data,
                                    status:
                                        data.status ??
                                        old.status,
                                };
                            },
                        );
                    }

                    /**
                     * ----------------------------------------
                     * REFRESH ORDER HISTORY
                     * ----------------------------------------
                     *
                     * Only refresh when the WebSocket
                     * actually contains a status update.
                     *
                     * This prevents unnecessary API requests
                     * for things like location updates or
                     * other non-status messages.
                     */
                    if (data.status) {
                        queryClient.invalidateQueries({
                            queryKey: ["order-history"],
                            refetchType: "active",
                        });

                        console.log(
                            "[WS MANAGER] Order history invalidated:",
                            messageOrderId,
                        );
                    }
                } catch (err) {
                    console.log(
                        "[WS MANAGER] Parse error:",
                        err,
                    );
                }
            };

            /**
             * WebSocket error.
             */
            socket.onerror = (err) => {
                console.log(
                    "[WS MANAGER] Error:",
                    order.id,
                    err,
                );
            };

            /**
             * WebSocket closed.
             */
            socket.onclose = (event) => {
                console.log(
                    "[WS MANAGER] Closed:",
                    order.id,
                    event.code,
                );

                socketsRef.current.delete(key);

                setConnectedOrderIds((prev) =>
                    prev.filter(
                        (id) => String(id) !== key,
                    ),
                );
            };
        });
    }, [
        ordersKey,
        token,
        enabled,
        queryClient,
    ]);

    /**
     * Cleanup ONLY when the hook unmounts.
     */
    useEffect(() => {
        return () => {
            console.log(
                "[WS MANAGER] Cleaning up sockets",
            );

            socketsRef.current.forEach((socket) => {
                if (
                    socket.readyState === WebSocket.OPEN ||
                    socket.readyState === WebSocket.CONNECTING
                ) {
                    socket.close();
                }
            });

            socketsRef.current.clear();

            setConnectedOrderIds([]);
        };
    }, []);

    return {
        connectedOrderIds,
        activeSocketCount:
            connectedOrderIds.length,
    };
};