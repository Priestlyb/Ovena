// hooks/orders/useReorder.ts

import { useMutation } from "@tanstack/react-query";
import api from "@/services/apiClient";
import { useDeviceLocation } from "@/hooks/Location/useDeviceLocation";

/* =========================================
   TYPES
========================================= */

export interface ReorderResponse {
  message: string;
  order_id: number;
  order_number: number;
  payment_url: string;
  delivery_passphrase: string;
  websocket_url: string;
}

export const useReorder = () => {
  const { coords } = useDeviceLocation();

  return useMutation<ReorderResponse, Error, number | string>({
    mutationFn: async (order_id) => {
      if (!coords) {
        throw new Error(
          "Unable to determine your location. Please try again in a moment."
        );
      }

      const response = await api.post<ReorderResponse>(
        `/customer/order/${order_id}/reorder/`,
        {
          lat: coords.lat,
          long: coords.lng,
        }
      );

      console.log("[REORDER RESPONSE]", response.data);

      return response.data;
    },
  });
};