import api from "@/services/apiClient";
import { BranchHour } from "@/types/storeHub";
import { useEffect, useState } from "react";

export const useBranchHours = (branchId?: number) => {
    const [loading, setLoading] = useState(false);
    const [apiHours, setApiHours] = useState<BranchHour[]>([]);

    useEffect(() => {
        if (!branchId) return;

        const fetchHours = async () => {
            setLoading(true);
            try {
                const res = await api.get(
                    `/business/branches/${branchId}/hours/`,
                );

                const mapped: BranchHour[] = res.data.map((h: any) => ({
                    day: Number(h.day),
                    open_time: h.open_time || "00:00:00",
                    close_time: h.close_time || "00:00:00",
                    is_closed: Boolean(h.is_closed),
                }));

                setApiHours(mapped);
            } catch (e) {
                console.error("Failed to load hours:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchHours();
    }, [branchId]);

    return { apiHours, loading };
};