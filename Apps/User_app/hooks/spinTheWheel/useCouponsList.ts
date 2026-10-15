import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";

/* =========================================
   TYPES
========================================= */

export type CouponItem = {
    id: number;
    awarded_at: string;
    awarded_from_wheel_spin: boolean;
    is_expired: boolean;
    is_used: boolean;
    used_at: string | null;

    coupon: {
        id: number;
        code: string;
        description: string;
        discount_type: string;
        discount_value: string;
        valid_from: string;
        valid_until: string;
        time_left_seconds: number;
    };
};

/* =========================================
   API CALL
========================================= */

const fetchCoupons = async (): Promise<CouponItem[]> => {
    const response = await api.get("/coupons/list/");
    return response.data;
};

/* =========================================
   HOOK
========================================= */

export const useCouponsList = () => {
    return useQuery({
        queryKey: ["coupons-list"],
        queryFn: fetchCoupons,
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });
};