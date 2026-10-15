import * as Crypto from "expo-crypto";
import { useMutation } from "@tanstack/react-query";

import api from "@/services/apiClient";

export interface CreateWithdrawalPayload {
    points_requested: number;
}

export interface CreateWithdrawalResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const useCreateWithdrawal = () => {
    return useMutation<
        CreateWithdrawalResponse,
        Error,
        CreateWithdrawalPayload
    >({
        mutationFn: async ({ points_requested }) => {
            const response = await api.post(
                "/customer/points/withdrawals/",
                {
                    points_requested,
                    idempotency_key: Crypto.randomUUID(),
                }
            );

            return response.data;
        },
    });
};