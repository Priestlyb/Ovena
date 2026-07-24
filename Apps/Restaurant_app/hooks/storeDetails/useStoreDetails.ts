import api from "@/services/apiClient";
import { useCallback, useEffect, useState } from "react";

export interface StoreDetails {
  id: number;

  business_name: string;
  business_type: string;

  business_logo?: string;
  business_image?: string;

  business_address?: string;
  phone_number?: string;
  email?: string;

  description?: string;
  is_open?: boolean;

  created_at?: string;
  updated_at?: string;
}

interface UseStoreDetailsReturn {
  data: StoreDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStoreDetails = (): UseStoreDetailsReturn => {
  const [data, setData] = useState<StoreDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStoreDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/business/detail/");

      console.log("[useStoreDetails API Response]:", response.data);

      const raw = response.data;

      // Normalize response (safe mapping layer)
      const formatted: StoreDetails = {
        id: raw?.id,
        business_name: raw?.business_name ?? "",
        business_type: raw?.business_type ?? "",

        business_logo: raw?.business_logo ?? null,
        business_image: raw?.business_image ?? null,

        business_address: raw?.business_address ?? "",
        phone_number: raw?.phone_number ?? "",
        email: raw?.email ?? "",

        description: raw?.description ?? "",

        is_open: raw?.is_open ?? false,

        created_at: raw?.created_at ?? "",
        updated_at: raw?.updated_at ?? "",
      };

      setData(formatted);
    } catch (err: any) {
      console.log("[useStoreDetails] Error:", err?.message);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch store details",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStoreDetails();
  }, [fetchStoreDetails]);

  return {
    data,
    loading,
    error,
    refetch: fetchStoreDetails,
  };
};