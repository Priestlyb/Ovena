import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";

/* =========================================
   FETCHER
========================================= */

const fetchFavorites = async () => {

  const response = await api.get("/customer/favorite/list/");

  //console.log(
  //  "[FAVORITES RESPONSE]",
  // JSON.stringify(response.data, null, 2)
  // );

  return response.data;
};

/* =========================================
   HOOK
========================================= */

export const useFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,

    staleTime: 0,

    refetchOnMount: true,
    refetchOnWindowFocus: true,

    refetchOnReconnect: true,
  });
};