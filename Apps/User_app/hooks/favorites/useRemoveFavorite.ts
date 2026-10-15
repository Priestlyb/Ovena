import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/apiClient";

interface RemoveFavoritePayload {
    menu_item_id: number;
    branch_id: number;
}

export const useRemoveFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            payload: RemoveFavoritePayload
        ) => {
            const response = await api.post(
                "/customer/favorite/remove/",
                payload
            );

            console.log(
                "[REMOVE FAVORITE RESPONSE]",
                response.data
            );

            return response.data;
        },

        onSuccess: async () => {
            console.log("[REMOVE FAVORITE] Invalidating favorites");

            await queryClient.invalidateQueries({
                queryKey: ["favorites"],
            });
        },

        onError: (error: any) => {
            console.log(
                "[REMOVE FAVORITE ERROR]",
                error?.response?.data || error.message
            );
        },
    });
};