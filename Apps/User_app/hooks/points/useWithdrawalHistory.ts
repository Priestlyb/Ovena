// hooks/points/useWithdrawalHistory.ts

import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";

export interface WithdrawalHistoryItem {
    id: string;
    user: number;
    points_requested: number;
    status: "pending" | "approved" | "rejected";
    requested_at: string;
    resolved_at: string | null;
}

const fetchWithdrawalHistory = async (): Promise<
    WithdrawalHistoryItem[]
> => {
    const response = await api.get(
        "/customer/points/me/withdrawals/"
    );

    console.log(
        "[WITHDRAWAL HISTORY]",
        response.data
    );

    return response.data;
};

export const useWithdrawalHistory = () => {
    return useQuery({
        queryKey: ["withdrawal-history"],
        queryFn: fetchWithdrawalHistory,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
};