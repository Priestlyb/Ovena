import { useCallback, useState } from "react";
import api from "@/services/apiClient";

type WheelInfoResponse = any;

export const useWheelInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WheelInfoResponse | null>(null);

  const getWheelInfo = useCallback(async (params?: {
    unused?: boolean;
    search?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/coupons/wheel/", {
        params: params ?? {},
      });

      setData(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch wheel info";

      console.log("[WHEEL INFO ERROR]:", err?.response?.data || err);

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    getWheelInfo,
    reset,
  };
};