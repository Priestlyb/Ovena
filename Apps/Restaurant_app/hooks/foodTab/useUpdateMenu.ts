import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMenus } from "@/services/menu.service";
import { MENU_QUERY_KEY } from "./useMenu";

export const useUpdateMenu = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMenus,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: MENU_QUERY_KEY,
            });
        },

        onError: (error) => {
            console.error(
                "[Menu] Failed to update menu:",
                error
            );
        },
    });
};