import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/services/apiClient";

/* =========================================
   TYPES
========================================= */

export interface CustomerOrderItemSnapshot {
    item: {
        id: number;
        name: string;
        image?: string | null;
    };
    options: string[];
    addons: Array<
        | string
        | {
            id?: number;
            name?: string;
        }
    >;
}

export interface CustomerOrderItem {
    quantity: number;
    line_total: string;
    snapshot: CustomerOrderItemSnapshot;
    addtional_note: string;
}

export interface CustomerOrderResponse {
    id: number | string;

    order_number?: number;

    status?: string;

    total?: string;

    grand_total?: string;

    created_at?: string;

    updated_at?: string;

    delivery_passphrase?: string | null;

    picked_up_by_user?: boolean;

    branch_name?: string;

    branch_address?: string;

    driver_name?: string;

    driver_phone_number?: string;

    driver_vehicle?: string;

    items: CustomerOrderItem[];

    customer?: {
        id: number;
        name?: string;
        phone?: string;
    };

    [key: string]: any;
}

/* =========================================
   API FUNCTION
========================================= */

const fetchCustomerOrder = async (
    orderId: number | string
): Promise<CustomerOrderResponse> => {
    const { data } = await api.get(`/customer/order/${orderId}/`);

    //console.log(
    //    "===== CUSTOMER ORDER DETAILS =====",
    //   JSON.stringify(data, null, 2)
    // );

    return data;
};

/* =========================================
   HOOK
========================================= */

export const useCustomerOrderId = (orderId?: number | string) => {
    const query = useQuery<CustomerOrderResponse, Error>({
        queryKey: ["customer-order", orderId],
        queryFn: () => fetchCustomerOrder(orderId!),
        enabled: !!orderId,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });

    /* ===============================
       DEBUG LOGGING (v5 safe way)
    =============================== */
    useEffect(() => {
        if (query.data) {
            //console.log(
            //"[CUSTOMER ORDER SUCCESS]:",
            //JSON.stringify(query.data, null, 2)
            //);
        }
    }, [query.data]);

    useEffect(() => {
        if (query.error) {
            console.log("[CUSTOMER ORDER ERROR]:", query.error);
        }
    }, [query.error]);

    return query;
};