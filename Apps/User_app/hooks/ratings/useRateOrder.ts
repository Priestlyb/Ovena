import { useState } from "react";

import api from "@/services/apiClient";

export type DriverComplaintType =
    | "LATE_DELIVERY"
    | "RUDE_DRIVER"
    | "UNSAFE_DRIVING"
    | "WRONG_ADDRESS"
    | "OTHER";

export type BranchComplaintType =
    | "COLD_FOOD"
    | "DIRTY_ENVIRONMENT"
    | "WRONG_ORDER"
    | "DELAYED_PREPARATION"
    | "RUDE_STAFF"
    | "OTHER";

export interface RatingPayload {
    order_id: number;

    driver?: {
        stars: number;
        complaint_type?: DriverComplaintType;
        review?: string;
    };

    branch?: {
        stars: number;
        complaint_type?: BranchComplaintType;
        review?: string;
    };
}

export default function useRateOrder() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitRating = async (
        payload: RatingPayload
    ) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            console.log(
                "[RATE ORDER PAYLOAD]",
                JSON.stringify(payload, null, 2)
            );

            const response = await api.post(
                "/customer/rating/rate-order/",
                payload
            );

            console.log(
                "[RATE ORDER RESPONSE STATUS]",
                response.status
            );

            console.log(
                "[RATE ORDER RESPONSE]",
                response.data
            );

            setSuccess(true);

            return {
                success: true,
                data: response.data,
            };
        } catch (err: any) {

            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.message ||
                "Failed to submit rating";

            setError(message);

            return {
                success: false,
                error: message,
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        submitRating,
        loading,
        success,
        error,
    };
}