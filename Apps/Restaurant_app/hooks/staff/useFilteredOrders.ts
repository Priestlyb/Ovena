import { Order } from "@/data/mockOrders";
import { useMemo } from "react";

export const useFilteredOrders = (
    orders: Order[],
    statusFilter: string,
    historyFilter: string,
) => {
    return useMemo(() => {
        let filtered = [...orders];

        if (statusFilter === "history") {
            filtered = filtered.filter(
                (o) => o.status === historyFilter,
            );
        } else {
            filtered = filtered.filter(
                (o) => o.status === statusFilter,
            );
        }

        return filtered.sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
        );
    }, [orders, statusFilter, historyFilter]);
};