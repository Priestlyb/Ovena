import api from "@/services/apiClient";
import { useCallback, useEffect, useState } from "react";

export interface StaffOrderItemSnapshot {
    item: {
        id: number;
        name: string;
        image: string;
    };
    options: string[];
    addons: string[];
}

export interface StaffOrderItem {
    quantity: number;
    line_total: string;
    snapshot: StaffOrderItemSnapshot;
    addtional_note: string;
}

export interface StaffOrderDetail {
    id: number;
    branch_name: string;
    branch_address: string;
    grand_total: string;
    order_number: number;
    status: string;
    created_at: string;
    picked_up_by_user: boolean;
    items: StaffOrderItem[];
}

interface UseStaffOrderDetailReturn {
    order: StaffOrderDetail | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export default function useOrderDetail(
    orderId: string | number
): UseStaffOrderDetailReturn {
    const [order, setOrder] = useState<StaffOrderDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderDetail = useCallback(async () => {
        if (!orderId) {
            setError("Order ID is required");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await api.get<StaffOrderDetail>(
                `/menu/staff/order/${orderId}/`
            );

            //console.log(
            //  "[STAFF ORDER DETAIL SUCCESS]",
            //JSON.stringify(response.data, null, 2)
            //);

            setOrder(response.data);
        } catch (err: any) {
            console.error(
                "[STAFF ORDER DETAIL ERROR]",
                err?.response?.data || err?.message
            );

            setError(
                err?.response?.data?.detail ||
                err?.message ||
                "Failed to fetch order details"
            );
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrderDetail();
    }, [fetchOrderDetail]);

    return {
        order,
        loading,
        error,
        refetch: fetchOrderDetail,
    };
}