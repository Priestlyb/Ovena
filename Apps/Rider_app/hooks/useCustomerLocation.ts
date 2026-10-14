// hooks/useCustomerLocation.ts
//
// Returns the active customer/delivery destination coordinate.
//
// HOW IT WORKS RIGHT NOW (mock mode):
//   Returns a hardcoded coordinate so you can see the map, polyline, and
//   route banner working immediately without a real order.
//
// HOW TO WIRE TO YOUR BACKEND:
//   1. Your API already has `active_order` inside the dashboard response:
//        data?.dashboard?.data?.active_order
//   2. When an order is active it should include the delivery coordinates.
//      Add those fields to your backend response (e.g. delivery_lat / delivery_lng)
//      and swap the mock block below for the real one (already written, just
//      uncomment it and delete the mock block).
//
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { useAppData } from "../context/appDataContext";

export interface CustomerLocation {
  latitude:  number;
  longitude: number;
  label:     string;
}

// ── MOCK ─────────────────────────────────────────────────────────────────────
// A fixed coordinate used during development so the map always shows a route.
// Change this to any address near your test location.
// Set MOCK_ENABLED = false when you wire up the real backend field.

const MOCK_ENABLED = true;

const MOCK_CUSTOMER: CustomerLocation = {
  // Example: a point roughly 1.5 km from the centre of Lagos Island
  latitude:  6.4541,
  longitude: 3.3947,
  label:     "Mock Customer – 12 Broad St, Lagos",
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCustomerLocation(): CustomerLocation | null {
  const { data } = useAppData();

  return useMemo(() => {
    // ── MOCK MODE ────────────────────────────────────────────────────────────
    if (MOCK_ENABLED) return MOCK_CUSTOMER;

    // ── REAL MODE (uncomment when backend sends coordinates) ─────────────────
    // const order = data?.dashboard?.data?.active_order;
    // if (!order) return null;
    //
    // const lat = order.delivery_lat ?? order.destination?.latitude;
    // const lng = order.delivery_lng ?? order.destination?.longitude;
    // const label = order.delivery_address ?? order.destination?.address ?? "Customer";
    //
    // if (lat == null || lng == null) return null;
    // return { latitude: lat, longitude: lng, label };

    return null;
  }, [data]);
}