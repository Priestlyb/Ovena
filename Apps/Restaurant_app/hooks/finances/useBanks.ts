import { useQuery } from "@tanstack/react-query";

import api from "@/services/apiClient";

export interface Bank {
  id: number;
  name: string;
  code: string;
}

const fetchBanks = async (): Promise<Bank[]> => {
  const response = await api.get("/banks/");

  //console.log("[BANKS API RESPONSE]", response.data);

  return response.data;
};

export function useBanks() {
  return useQuery({
    queryKey: ["banks"],
    queryFn: fetchBanks,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
  });
}