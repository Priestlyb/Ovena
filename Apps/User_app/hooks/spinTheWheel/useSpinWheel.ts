import { useCallback, useState } from "react";
import api from "@/services/apiClient";

type SpinWheelResponse = any;

export const useSpinWheel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SpinWheelResponse | null>(null);

  const spinWheel = useCallback(async (payload?: any) => {
    setLoading(true);
    setError(null);

    try {
      console.log("[SPIN WHEEL] Request payload:", payload);

      const response = await api.post("/coupons/wheel/spin/", payload ?? {});

      console.log("[SPIN WHEEL RESPONSE]:", response.data);

      setData(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to spin wheel";

      console.log("[SPIN WHEEL ERROR]:", err?.response?.data || err);

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
    spinWheel,
    reset,
  };
};