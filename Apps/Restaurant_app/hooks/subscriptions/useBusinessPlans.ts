import api from "@/services/apiClient";
import { useCallback, useEffect, useState } from "react";

export interface BusinessPlan {
    id: string;
    name: string;
    description?: string;
    price?: number;
    duration?: number;
    [key: string]: any;
}

export const useBusinessPlans = () => {
    const [plans, setPlans] = useState<BusinessPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlans = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get("/business/plans/list/");

            //console.log(
            //  JSON.stringify(response.data, null, 2)
            //);

            setPlans(
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.results || []
            );
        } catch (err: any) {
            console.error(
                "BUSINESS PLANS ERROR"
            );

            console.error(err?.response?.data || err);

            setError(
                err?.response?.data?.detail ||
                err?.message ||
                "Failed to fetch plans"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    return {
        plans,
        loading,
        error,
        refetch: fetchPlans,
    };
};