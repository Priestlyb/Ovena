import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import api from "@/services/apiClient";

export default function useGetMenuOrder() {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);

  const getOrder = useCallback(
    async (orderId: number | string) => {
      try {
        setLoading(true);
        setError(null);

        // ==========================================
        // 1. Fetch the individual order
        // ==========================================

        const res = await api.get(`/menu/orders/${orderId}/`);

        setOrder(res.data);

        // ==========================================
        // 2. Fetch the latest order history
        // ==========================================

        await queryClient.refetchQueries({
          queryKey: ["order-history"],
        });

        return {
          success: true,
          data: res.data,
        };
      } catch (err: any) {
        const apiError = err?.response?.data || err?.message;

        setError(apiError);

        return {
          success: false,
          error: apiError,
        };
      } finally {
        setLoading(false);
      }
    },
    [queryClient]
  );

  /**
   * Merge websocket updates into the current order.
   */
  const updateOrder = useCallback((updates: Record<string, any>) => {
    setOrder((prev: any) => {
      if (!prev) return prev;

      return {
        ...prev,
        ...updates,
      };
    });
  }, []);

  /**
   * Replace the entire order.
   */
  const replaceOrder = useCallback((newOrder: any) => {
    setOrder(newOrder);
  }, []);

  /**
   * Clear cached order.
   */
  const clearOrder = useCallback(() => {
    setOrder(null);
    setError(null);
  }, []);

  return {
    getOrder,
    updateOrder,
    replaceOrder,
    clearOrder,
    loading,
    error,
    order,
    setOrder,
  };
}