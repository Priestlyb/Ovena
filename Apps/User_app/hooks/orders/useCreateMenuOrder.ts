import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import api from "@/services/apiClient";

import { saveDeliveryPassphrase } from "@/src/utils/deliveryPassphraseStorage";

export interface MenuOrderItem {
  menu_item_id: number;
  quantity: number;
  variant_option_ids: number[];
  addon_ids: number[];
  addtional_note?: string;
}

export interface CreateMenuOrderPayload {
  branch_id: number;
  coupon_code?: string;
  is_delivery?: boolean;
  wallet_entry_id?: number | null;
  lat: number;
  long: number;
  items: MenuOrderItem[];
}

export default function useCreateMenuOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);

  const queryClient = useQueryClient();

  const createOrder = async (payload: CreateMenuOrderPayload) => {
    try {
      setLoading(true);
      setError(null);

      const safePayload: CreateMenuOrderPayload = {
        ...payload,

        items: payload.items.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          variant_option_ids: item.variant_option_ids ?? [],
          addon_ids: item.addon_ids ?? [],
          addtional_note: item.addtional_note ?? "",
        })),
      };

      console.log("[MENU ORDER REQUEST]");
      console.log(JSON.stringify(safePayload, null, 2));

      const res = await api.post("/menu/order/", safePayload);

      console.log("[MENU ORDER RESPONSE]");
      console.log(JSON.stringify(res.data, null, 2));

      // Save delivery passphrase if available
      if (
        res.data?.order_id &&
        res.data?.delivery_passphrase
      ) {
        await saveDeliveryPassphrase(
          res.data.order_id,
          res.data.delivery_passphrase,
        );

        console.log(
          "[MENU ORDER] Delivery passphrase saved locally",
        );
      }

      setResponse(res.data);

      /**
       * Creating the order is successful even if there is
       * no payment_url.
       *
       * Payment is handled separately through:
       *
       * POST /menu/order/payment/{order_id}/
       *
       * with:
       *
       * { method: "points" }
       *
       * or:
       *
       * { method: "paystack" }
       */

      if (!res.data?.order_id) {
        const failure = {
          success: false,
          error:
            res.data?.message ||
            "Order could not be created.",
          data: res.data,
        };

        console.log("[MENU ORDER FAILED]");
        console.log(JSON.stringify(failure, null, 2));

        setError(failure.error);

        return failure;
      }

      /**
       * IMPORTANT:
       * Refresh order history after every successfully
       * created order.
       *
       * refetchType: "all" makes this work even when the
       * order-history screen is not currently mounted.
       */
      await queryClient.invalidateQueries({
        queryKey: ["order-history"],
        refetchType: "all",
      });

      console.log(
        "[MENU ORDER] Order history refreshed",
      );

      return {
        success: true,
        data: res.data,
      };
    } catch (err: any) {
      const apiError =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Something went wrong.";

      console.log("[MENU ORDER ERROR]");
      console.log(JSON.stringify(apiError, null, 2));

      setError(apiError);

      return {
        success: false,
        error: apiError,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    loading,
    error,
    response,
  };
}