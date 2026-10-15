import api from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export interface StaffOrderHistoryItem {
    id: number;
    product_name: string | null;
    customer_name: string | null;
    product_image: string | null;
    extra_items: number;
    branch: string;
    grand_total: string;
    subtotal: string;
    order_number: number;
    status: string;
    created_at: string;
    driver?: string;
}

export const STAFF_ORDER_HISTORY_QUERY_KEY = [
    "staff-order-history",
] as const;

export const getStaffOrderHistory = async (): Promise<
    StaffOrderHistoryItem[]
> => {
    const response = await api.get("/menu/staff/order/history/");

    //console.log(
    //"[ORDER HISTORY FIRST ITEM]",
    //response.data?.results?.[0] ?? response.data?.[0]
    //);

    return response.data?.results ?? [];
};

export const useStaffOrderHistory = () => {
    return useQuery({
        queryKey: STAFF_ORDER_HISTORY_QUERY_KEY,
        queryFn: getStaffOrderHistory,

        // Keep history fresh when the screen is opened again.
        staleTime: 0,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
    });
};