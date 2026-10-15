import { useCallback, useState } from "react";
import api from "@/services/apiClient";

export interface BranchRating {
    id: number;
    order: number;
    rater: number;
    branch: number;
    stars: number;
    complaint_type?: string;
    review?: string;
    created_at?: string;
}

const useGetMyBranchRatings = () => {
    const [ratings, setRatings] = useState<BranchRating[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const getMyBranchRatings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(
                "/customer/rating/me/branch-ratings/",
            );

            const data: BranchRating[] = Array.isArray(response.data)
                ? response.data
                : response.data?.results || [];

            setRatings(data);

            return data;
        } catch (err: any) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        ratings,
        loading,
        error,
        getMyBranchRatings,
    };
};

export default useGetMyBranchRatings;