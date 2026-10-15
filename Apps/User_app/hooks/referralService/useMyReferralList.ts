import { useCallback, useState } from "react";
import api from "@/services/apiClient";

export type ReferralUser = {
  id: string | number;
  name: string;
  date?: string;
  points?: number;
};

export const useMyReferralList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReferralUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/customer/ref/me/list/");

      //console.log("[REFERRAL LIST RESPONSE]:", response.data);
      const list =
        response.data?.results ||
        response.data?.data ||
        response.data ||
        [];

      setData(list);

      return list;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch referral list";

      console.log("[REFERRAL LIST ERROR]:", message);

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchReferrals,
    loading,
    data,
    error,
  };
};