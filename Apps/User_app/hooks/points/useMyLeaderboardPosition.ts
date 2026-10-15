import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";

/* =========================================
   TYPES
========================================= */

export interface MyLeaderboardPosition {
    user_id: string;
    rank: number;
    points: number;
}

/* =========================================
   FETCHER
========================================= */

const fetchMyLeaderboardPosition =
    async (): Promise<MyLeaderboardPosition> => {
        const res = await api.get(
            "/customer/points/leaderboard/me/"
        );

        //console.log(
        //    "[MY LEADERBOARD POSITION RESPONSE]",
        //    res.data
        // );

        return res.data;
    };

/* =========================================
   HOOK
========================================= */

export const useMyLeaderboardPosition = () => {
    return useQuery({
        queryKey: ["my-leaderboard-position"],

        queryFn: fetchMyLeaderboardPosition,

        staleTime: 1000 * 60 * 5,

        gcTime: 1000 * 60 * 30,

        retry: 1,

        refetchOnReconnect: true,

        refetchOnWindowFocus: false,
    });
};