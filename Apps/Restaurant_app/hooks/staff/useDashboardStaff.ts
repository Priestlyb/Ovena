import api from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

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

const buildDateRange = (key: string) => {
  const today = new Date();
  const start = new Date();

  switch (key) {
    case "7d":
      start.setDate(today.getDate() - 7);
      break;

    case "30d":
      start.setDate(today.getDate() - 30);
      break;

    case "12m":
      start.setMonth(today.getMonth() - 12);
      break;
  }

  const format = (date: Date) => date.toISOString().split("T")[0];

  return {
    from_date: format(start),
    to_date: format(today),
  };
};

const fetchDashboardStaff = async (
  filter: string
): Promise<DashboardStaff> => {
  let params: Record<string, string> = {};

  if (filter === "today") {
    params = {
      range: "today",
    };
  } else {
    params = {
      range: "custom",
      ...buildDateRange(filter),
    };
  }

  console.log("Dashboard params:", params);

  const response = await api.get<DashboardStaffResponse>(
    "/business/dashboard/staff/",
    {
      params,
    }
  );

  //console.log(
  // `[Dashboard Staff - ${filter}]`,
  //  JSON.stringify(response.data, null, 2)
  //);

  return response.data.data;
};

export const useDashboardStaff = (filter: string = "today") => {
  const query = useQuery({
    queryKey: ["dashboard-staff", filter],
    queryFn: () => fetchDashboardStaff(filter),

    // Cache for 15 minutes
    staleTime: 15 * 60 * 1000,

    // Keep cache in memory for 15 minutes after unused
    gcTime: 15 * 60 * 1000,

    retry: 1,

    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });

  return {
    staff: query.data ?? null,
    loading: query.isLoading,
    refreshing: query.isFetching && !query.isLoading,
    error:
      query.error instanceof Error
        ? query.error.message
        : null,
    refetch: query.refetch,
  };
};

export default useDashboardStaff;