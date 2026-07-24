// hooks/Menu/useMenu.ts

import { useQuery } from "@tanstack/react-query";

import { getMenu } from "@/services/menu.service";

export const MENU_QUERY_KEY = ["business-menu"];

export const useMenu = () => {
    const query = useQuery({
        queryKey: MENU_QUERY_KEY,

        queryFn: async () => {
            const response = await getMenu();
            return response.data;
        },

        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
    });

    return {
        menu: query.data ?? [],
        loading: query.isPending,
        refreshing: query.isRefetching,
        error: query.error,

        refetchMenu: query.refetch,
    };
};