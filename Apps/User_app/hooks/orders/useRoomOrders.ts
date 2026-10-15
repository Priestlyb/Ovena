// hooks/orders/useRoomOrders.ts

import { useMemo } from "react";

export const useRoomOrders = (
    orders: any[],
    filter: string,
) => {
    return useMemo(() => {
        const roomOrders = orders
            .filter((item: any) => {
                const type =
                    item?.order_type?.toLowerCase?.();

                return (
                    type === "room" ||
                    type === "rooms"
                );
            })
            .map((item: any) => ({
                id: item?.id,
                roomType:
                    item?.room_name ||
                    "Room Booking",
                status:
                    item?.status?.toLowerCase?.() ||
                    "pending",
            }));

        return roomOrders.filter((item: any) => {
            if (filter === "Upcoming") {
                return (
                    item.status !== "completed"
                );
            }

            return item.status === "completed";
        });
    }, [orders, filter]);
};