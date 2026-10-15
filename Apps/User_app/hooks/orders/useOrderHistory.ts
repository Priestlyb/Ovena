import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";
import { useAuth } from "@/context/AuthContext";

type OrderHistoryResponse = any;

/**
 * Fetch all orders belonging to the authenticated customer.
 */
const fetchOrderHistory = async (): Promise<OrderHistoryResponse[]> => {
  try {
    const response = await api.get("/customer/order/history/");

    const data =
      response.data?.results ??
      response.data ??
      [];

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ ORDER HISTORY FETCH ERROR:", error);

    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }

    throw error;
  }
};

export const useOrderHistory = () => {
  const { authStatus, accessToken } = useAuth();

  const isAuthenticated =
    authStatus === "authenticated" &&
    !!accessToken;

  const query = useQuery<OrderHistoryResponse[], Error>({
    queryKey: ["order-history"],

    queryFn: fetchOrderHistory,

    enabled: isAuthenticated,

    // Keep cached order history fresh for 5 minutes.
    staleTime: 1000 * 60 * 5,

    // Keep unused order history in memory for 30 minutes.
    gcTime: 1000 * 60 * 30,

    // Don't automatically refetch every time
    // the screen mounts.
    refetchOnMount: false,

    // Refetch when the network reconnects.
    refetchOnReconnect: true,

    // React Native doesn't need window-focus refetching.
    refetchOnWindowFocus: false,
  });

  return {
    orders: query.data ?? [],

    loading: query.isLoading,

    isFetching: query.isFetching,

    error: query.error,

    isError: query.isError,

    refetch: query.refetch,
  };
};