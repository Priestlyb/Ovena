import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";

/* =========================================
   TYPES
========================================= */

export interface LeaderboardUser {
    rank: number;
    user_id: string;
    name: string;
    points: number;
}

/* =========================================
   FETCHER
========================================= */

const fetchPointsLeaderboard =
    async (): Promise<LeaderboardUser[]> => {
        const res = await api.get(
            "/customer/points/leaderboard/"
        );

        //console.log(
        //   "[POINTS LEADERBOARD RESPONSE]",
        //    res.data
        //  );

        return res.data;
    };

/* =========================================
   HOOK
========================================= */

export const usePointsLeaderboard = () => {
    return useQuery({
        queryKey: ["points-leaderboard"],

        queryFn: fetchPointsLeaderboard,

        staleTime: 1000 * 60 * 5,

        gcTime: 1000 * 60 * 30,

        retry: 1,

        refetchOnReconnect: true,

        refetchOnWindowFocus: false,
    });
};