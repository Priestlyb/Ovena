import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";

/* =========================================
   TYPES
========================================= */

export interface PointsBalance {
    user_id: string;
    name: string;
    points_balance: number;
}

/* =========================================
   FETCHER
========================================= */

const fetchPointsBalance = async (): Promise<PointsBalance> => {
    const res = await api.get(
        "/customer/points/me/balance/"
    );

    //console.log(
    //   "[POINTS BALANCE RESPONSE]",
    //   res.data
    // );

    return res.data;
};

/* =========================================
   HOOK
========================================= */

export const usePointsBalance = () => {
    return useQuery({
        queryKey: ["points-balance"],

        queryFn: fetchPointsBalance,

        staleTime: 1000 * 60 * 5,

        gcTime: 1000 * 60 * 30,

        retry: 1,

        refetchOnReconnect: true,

        refetchOnWindowFocus: false,
    });
};