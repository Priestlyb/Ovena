// hooks/orders/useFoodOrders.ts

import { useMemo } from "react";

export const useFoodOrders = (
  orders: any[],
  filter: string,
) => {
  return useMemo(() => {
    return orders.filter((item: any) => {
      const status =
        item?.status?.toLowerCase?.() || "";

      if (filter === "Upcoming") {
        return (
          status !== "delivered" &&
          status !== "cancelled"
        );
      }

      return (
        status === "delivered" ||
        status === "cancelled"
      );
    });
  }, [orders, filter]);
};