import AsyncStorage from "@react-native-async-storage/async-storage";

import { Order } from "@/data/mockOrders";
import api from "@/services/apiClient";

import { STAFF_ORDER_HISTORY_QUERY_KEY } from "@/hooks/staff/useStaffOrderHistory";
import { useQueryClient } from "@tanstack/react-query";

const ACTIVE_ORDERS_STORAGE_KEY = "active_orders_ws";

type OrderAction =
    | "accept"
    | "cancel"
    | "made"
    | "pickup"
    | "complete";

export const useOrderActions = (
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
) => {
    const queryClient = useQueryClient();

    const handleOrderAction = async (
        order: Order,
        action: OrderAction,
        pickupCode?: string,
    ) => {
        try {
            console.log("================================");
            console.log("Order Action");
            console.log("Received action:", action);

            let pickedUpByUser = order.picked_up_by_user;

            try {
                const cached = await AsyncStorage.getItem(
                    ACTIVE_ORDERS_STORAGE_KEY,
                );

                if (cached) {
                    const orders = JSON.parse(cached);

                    const cachedOrder = orders.find(
                        (o: any) => String(o.id) === String(order.id),
                    );

                    if (cachedOrder) {
                        pickedUpByUser = cachedOrder.picked_up_by_user;
                    }
                }
            } catch (err) {
                console.log("Failed to read cached orders:", err);
            }

            console.log("picked_up_by_user:", pickedUpByUser);

            const payload = {
                action,
                order_id: Number(order.id),
                ...((action === "pickup" || action === "complete") &&
                    pickupCode
                    ? {
                        order_code: pickupCode,
                    }
                    : {}),
            };

            console.log("Payload:", payload);

            const response = await api.post(
                "/menu/restaurant-order/",
                payload,
            );

            console.log("Order action success");
            console.log(response.data);

            setOrders((prev) =>
                prev.map((o) => {
                    if (o.id !== order.id) return o;

                    let nextStatus = o.status;

                    switch (action) {
                        case "accept":
                            nextStatus = "preparing";
                            break;

                        case "made":
                            nextStatus = "ready";
                            break;

                        case "pickup":
                            nextStatus = "complete";
                            break;

                        case "complete":
                            nextStatus = "complete";
                            break;

                        case "cancel":
                            nextStatus = "rejected";
                            break;
                    }

                    return {
                        ...o,
                        status: nextStatus,
                        picked_up_by_user: pickedUpByUser,
                    };
                }),
            );

            await queryClient.invalidateQueries({
                queryKey: STAFF_ORDER_HISTORY_QUERY_KEY,
            });
        } catch (err: any) {
            console.log("Order action error");

            if (err.response) {
                console.log("Status:", err.response.status);
                console.log("Data:", err.response.data);
            } else if (err.request) {
                console.log("Request:", err.request);
            } else {
                console.log("Message:", err.message);
            }
        }
    };

    return {
        handleOrderAction,
    };
};