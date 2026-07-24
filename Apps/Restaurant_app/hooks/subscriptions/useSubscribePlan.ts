import { getAccessToken } from "@/utils/authStorage";
import axios from "axios";
import { useState } from "react";

interface SubscribePayload {
    plan_id: number;
}

const SAVE_CARD_URL =
    "https://m0ckct25-8000.euw.devtunnels.ms/api/business/subscription/";

export const useSubscribePlan = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subscribePlan = async (payload: SubscribePayload) => {
        try {
            setLoading(true);
            setError(null);

            console.log("SUBSCRIBE TO PLAN");
            console.log("Payload:");
            console.log(JSON.stringify(payload, null, 2));

            const token = await getAccessToken();
            console.log("Token exists:", !!token);

            const response = await axios.post(
                SAVE_CARD_URL,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("SUBSCRIPTION RESPONSE");
            console.log(JSON.stringify(response.data, null, 2));

            return response.data;
        } catch (err) {
            console.log("SUBSCRIPTION ERROR");

            if (axios.isAxiosError(err)) {
                console.log("Status:", err.response?.status);
                console.log(
                    "Response:",
                    JSON.stringify(err.response?.data, null, 2)
                );

                setError(
                    typeof err.response?.data === "string"
                        ? err.response.data
                        : JSON.stringify(err.response?.data)
                );
            } else {
                console.log(err);

                setError(
                    err instanceof Error ? err.message : "Something went wrong"
                );
            }

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        subscribePlan,
        loading,
        error,
    };
};