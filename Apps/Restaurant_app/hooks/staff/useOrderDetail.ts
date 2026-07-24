import api from "@/services/apiClient";
import { useCallback, useEffect, useState } from "react";

interface UseStaffOrderDetailReturn {
    order: any | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export default function useOrderDetail(
    orderId: string | number
): UseStaffOrderDetailReturn {
    const [order, setOrder] = useState<any | null>(null);
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

            const response = await api.get(
                `/menu/staff/order/${orderId}/`
            );

            //console.log(
            //   "[STAFF ORDER DETAIL SUCCESS]",
            //  JSON.stringify(response.data, null, 2)
            // );

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