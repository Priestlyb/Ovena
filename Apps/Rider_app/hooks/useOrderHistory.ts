// hooks/useOrderHistory.ts
import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MockOrder } from "../data/mockOrders";

const STORAGE_KEY   = "ovena_order_history_v1";
const TWENTY_FOUR_H = 24 * 60 * 60 * 1000;

export type OrderStatus =
  | "pending" | "accepted" | "picked_up" | "on_the_way"
  | "delivered" | "rejected" | "cancelled";

export type OrderDeliveryStep = "pickup" | "onitsway" | "delivering" | "success";

export interface OrderRecord {
  id:             number;
  order_number:   number;
  status:         OrderStatus;
  created_at:     string;
  last_event?:    { type: string; timestamp: string; metadata: Record<string, any> };
  branch_name:    string;
  restaurant_name:string;
  customer_name:  string;
  delivery_type:  string;
  delivery_step:  OrderDeliveryStep | null;
  fullOrder:      MockOrder | null;
  savedAt:        string;
}

export function isActiveOrder(o: OrderRecord): boolean {
  if (o.status === "delivered" || o.status === "rejected" || o.status === "cancelled") return false;
  if (o.delivery_step === "success") return false;
  return (
    o.status === "picked_up"  ||
    o.status === "on_the_way" ||
    o.status === "accepted"   ||
    (o.delivery_step !== null && o.delivery_step !== "success")
  );
}

export function within24h(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() < TWENTY_FOUR_H;
}

export function useOrderHistory() {
  const [orders,  setOrders]  = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const all: OrderRecord[] = JSON.parse(raw);
          const recent = all.filter(o => within24h(o.savedAt));
          setOrders(recent);
          if (recent.length !== all.length) {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
          }
        }
      } catch (e) {
        console.warn("[useOrderHistory] load:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (updated: OrderRecord[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("[useOrderHistory] save:", e);
    }
  }, []);

  const upsertOrder = useCallback((patch: Partial<OrderRecord> & { id: number }) => {
    setOrders(prev => {
      const idx = prev.findIndex(o => o.id === patch.id);
      let next: OrderRecord[];

      if (idx >= 0) {
        next = [...prev];
        next[idx] = { ...next[idx], ...patch, savedAt: new Date().toISOString() };
      } else {
        const record: OrderRecord = {
          order_number:    patch.order_number    ?? patch.id,
          status:          patch.status          ?? "accepted",
          created_at:      patch.created_at      ?? new Date().toISOString(),
          branch_name:     patch.branch_name     ?? "",
          restaurant_name: patch.restaurant_name ?? "",
          customer_name:   patch.customer_name   ?? "",
          delivery_type:   patch.delivery_type   ?? "",
          delivery_step:   patch.delivery_step   ?? null,
          fullOrder:       patch.fullOrder       ?? null,
          savedAt:         new Date().toISOString(),
          ...patch,
        };
        next = [record, ...prev];
      }

      const pruned = next.filter(o => within24h(o.savedAt));
      persist(pruned);
      return pruned;
    });
  }, [persist]);

  const mergeMyOrders = useCallback((serverOrders: any[]) => {
    setOrders(prev => {
      const map = new Map<number, OrderRecord>(prev.map(o => [o.id, o]));

      for (const so of serverOrders) {
        const existing = map.get(so.id);
        map.set(so.id, {
          id:             so.id,
          order_number:   so.order_number    ?? so.id,
          status:         so.status          ?? existing?.status          ?? "accepted",
          created_at:     so.created_at      ?? existing?.created_at      ?? new Date().toISOString(),
          last_event:     so.last_event      ?? existing?.last_event,
          branch_name:    so.branch?.name    ?? existing?.branch_name     ?? "",
          restaurant_name:existing?.restaurant_name ?? so.branch?.name   ?? "",
          customer_name:  so.customer_name   ?? existing?.customer_name   ?? "",
          delivery_type:  so.delivery_type   ?? existing?.delivery_type   ?? "",
          delivery_step:  existing?.delivery_step  ?? null,
          fullOrder:      existing?.fullOrder      ?? null,
          savedAt:        existing?.savedAt        ?? new Date().toISOString(),
        });
      }

      const pruned = Array.from(map.values()).filter(o => within24h(o.savedAt));
      persist(pruned);
      return pruned;
    });
  }, [persist]);

  const recentOrders  = orders.filter(o => within24h(o.savedAt));
  const activeOrder   = recentOrders.find(isActiveOrder) ?? null;
  const activeCount   = recentOrders.filter(isActiveOrder).length;

  return { orders: recentOrders, activeOrder, activeCount, loading, upsertOrder, mergeMyOrders };
}