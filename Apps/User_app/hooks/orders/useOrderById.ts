// hooks/orders/useOrderById.ts

import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";

/* =========================================
   TYPES
========================================= */

export type OrderResponse = {
    id: number;
    status?: string;
    total_amount?: number;
    created_at?: string;
    items?: any[];
    [key: string]: any;
};

/* =========================================
   API CALL
========================================= */

const fetchOrderById = async (
    orderId: number | string
): Promise<OrderResponse> => {
    const response = await api.get(
        `/menu/order/${orderId}/`
    );

    return response.data;
};

/* =========================================
   HOOK
========================================= */

export const useOrderById = (
    orderId?: number | string
) => {
    return useQuery({
        queryKey: ["order", orderId],
        queryFn: () => fetchOrderById(orderId!),

        enabled: !!orderId,

        staleTime: 1000 * 30,
        retry: 1,
    });
};