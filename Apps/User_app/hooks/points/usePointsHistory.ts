import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";

/* =========================================
   TYPES
========================================= */

export interface PointsHistoryItem {
    id: string;
    event_type: string;
    points: number;
    balance_after: number;
    proof_type: string;
    proof_object_id: string;
    notes: string;
    created_at: string;
}

/* =========================================
   FETCHER
========================================= */

const fetchPointsHistory =
    async (): Promise<PointsHistoryItem[]> => {
        const res = await api.get(
            "/customer/points/me/history/"
        );

        //console.log(
        // "[POINTS HISTORY RESPONSE]",
        //   res.data
        //);

        return res.data;
    };

/* =========================================
   HOOK
========================================= */

export const usePointsHistory = () => {
    return useQuery({
        queryKey: ["points-history"],

        queryFn: fetchPointsHistory,

        staleTime: 1000 * 60 * 5,

        gcTime: 1000 * 60 * 30,

        retry: 1,

        refetchOnReconnect: true,

        refetchOnWindowFocus: false,
    });
};