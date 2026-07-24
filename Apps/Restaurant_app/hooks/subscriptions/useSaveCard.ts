import axios from "axios";
import { useState } from "react";

import { getAccessToken } from "@/utils/authStorage";

const SAVE_CARD_URL =
    "https://m0ckct25-8000.euw.devtunnels.ms/api/business/card/save/";

export const useSaveCard = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const saveCard = async (email: string) => {
        try {
            setLoading(true);
            setError(null);

            const token = await getAccessToken();
            console.log("Email:", email);
            console.log("Token exists:", !!token);

            const response = await axios.post(
                SAVE_CARD_URL,
                {
                    email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("SAVE CARD RESPONSE");
            console.log(JSON.stringify(response.data, null, 2));

            return response.data;
        } catch (err: any) {
            console.log("STATUS:", err?.response?.status);
            console.log(
                "RESPONSE:",
                JSON.stringify(err?.response?.data, null, 2)
            );

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        saveCard,
        loading,
        error,
    };
};