// hooks/orders/useRetryOrderPayment.ts

import { useCallback, useState } from "react";
import axios from "axios";
import api from "@/services/apiClient";

/* =========================================
   TYPES
========================================= */

export interface RetryOrderPaymentPayload {
    order_id: number;
}

export interface RetryOrderPaymentResponse {
    detail?: string;
    message?: string;
    payment_url?: string;
    authorization_url?: string;
    reference?: string;

    [key: string]: any;
}

/* =========================================
   HOOK
========================================= */

export const useRetryOrderPayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const retryPayment = useCallback(
        async (
            payload: RetryOrderPaymentPayload
        ): Promise<RetryOrderPaymentResponse> => {
            try {
                setLoading(true);
                setError(null);

                console.log(
                    "[RETRY PAYMENT PAYLOAD]",
                    payload
                );

                const response = await api.post(
                    "/menu/orders/retry-payment/",
                    payload
                );

                console.log(
                    "[RETRY PAYMENT RESPONSE]",
                    response.data
                );

                return response.data;
            } catch (err: any) {
                console.log(
                    "[RETRY PAYMENT ERROR]",
                    err?.response?.data || err
                );

                const message = axios.isAxiosError(err)
                    ? err.response?.data?.detail ||
                    err.response?.data?.message ||
                    err.message
                    : "Unable to retry payment.";

                setError(message);

                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        retryPayment,
        loading,
        error,
    };
};