// hooks/Menu/useBranchAvailability.ts

import { useQuery } from "@tanstack/react-query";

import { getAvailability } from "@/services/menu.service";

export const useBranchAvailability = (selectedBranch?: string) => {
  const query = useQuery({
    queryKey: ["branch-availability", selectedBranch],

    enabled: !!selectedBranch,

    queryFn: async () => {
      const response = await getAvailability(selectedBranch!);
      return response.data;
    },

    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes

    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });

  return {
    availability: query.data ?? [],
    loading: query.isPending,
    refreshing: query.isRefetching,
    error: query.error,

    refetchAvailability: query.refetch,
  };
};