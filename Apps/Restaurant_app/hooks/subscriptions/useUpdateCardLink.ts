import api from "@/services/apiClient";
import { useState } from "react";

interface UpdateCardLinkResponse {
    authorization_url?: string;
    payment_url?: string;
    url?: string;
    [key: string]: any;
}

export const useUpdateCardLink = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getUpdateCardLink = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("💳 Fetching card update link...");

            const response = await api.post<UpdateCardLinkResponse>(
                "/business/update/card/link/"
            );

            console.log(
                "✅ UPDATE CARD LINK RESPONSE",
                JSON.stringify(response.data, null, 2)
            );

            return response.data;
        } catch (err: any) {
            console.error(
                "❌ UPDATE CARD LINK ERROR",
                err?.response?.data || err
            );

            setError(
                err?.response?.data?.detail ||
                err?.message ||
                "Failed to fetch card update link"
            );

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        getUpdateCardLink,
        loading,
        error,
    };
};