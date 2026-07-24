import api from "@/services/apiClient";
import { BranchHour } from "@/types/storeHub";
import { useEffect, useState } from "react";

export const useBranchHours = (branchId?: number | null) => {
  const [loading, setLoading] = useState(false);
  const [apiHours, setApiHours] = useState<BranchHour[]>([]);

  useEffect(() => {
    let mounted = true;

    const fetchHours = async () => {
      if (!branchId) {
        if (mounted) {
          setApiHours([]);
        }
        return;
      }

      setLoading(true);

      try {
        console.log("[BRANCH HOURS] Fetching branch:", branchId);

        const res = await api.get(`/business/branches/${branchId}/hours/`);

        console.log(
          "[BRANCH HOURS RAW]",
          JSON.stringify(res.data, null, 2),
        );

        if (!Array.isArray(res.data)) {
          console.warn(
            "[BRANCH HOURS] Expected an array but received:",
            res.data,
          );

          if (mounted) {
            setApiHours([]);
          }

          return;
        }

        const mapped: BranchHour[] = res.data.map((h: any) => ({
          day: Number(h.day),
          open_time: h.open_time ?? "00:00:00",
          close_time: h.close_time ?? "00:00:00",
          is_closed: Boolean(h.is_closed),
        }));

        console.log("[BRANCH HOURS MAPPED]", mapped);

        if (mounted) {
          setApiHours(mapped);
        }
      } catch (error: any) {
        console.error(
          "[BRANCH HOURS ERROR]",
          error?.response?.data || error?.message || error,
        );

        if (mounted) {
          setApiHours([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHours();

    return () => {
      mounted = false;
    };
  }, [branchId]);

  return {
    apiHours,
    loading,
  };
};