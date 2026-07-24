import api from "@/services/apiClient";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

interface DashboardMetric {
  filter: string;
  count: number;
  amount: number;
}

export interface DashboardStaff {
  username: string;
  today_sales: number;
  today_sales_count: number;
  total_shipment: DashboardMetric;
  total_orders: DashboardMetric;
}

interface DashboardStaffResponse {
  detail: string;
  data: DashboardStaff;
}

export const useDashboardStaff = (filter: string = "today") => {
  const [staff, setStaff] = useState<DashboardStaff | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<DashboardStaffResponse>(
        "/business/dashboard/staff/",
        {
          params: {
            filter,
          },
        }
      );

      console.log(
        `[Dashboard Staff - ${filter}]`,
        JSON.stringify(response.data, null, 2)
      );

      setStaff(response.data.data);
    } catch (err) {
      const error = err as AxiosError;

      console.log(
        "[Dashboard Staff Error]",
        JSON.stringify(error.response?.data, null, 2)
      );

      setError(
        (error.response?.data as any)?.detail ||
          (error.response?.data as any)?.message ||
          error.message ||
          "Failed to fetch dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return {
    staff,
    loading,
    error,
    refetch: fetchStaff,
  };
};

export default useDashboardStaff;