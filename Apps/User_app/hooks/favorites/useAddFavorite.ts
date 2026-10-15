import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/apiClient";

interface AddFavoritePayload {
  menu_item_id: number;
  branch_id: number;
}

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: AddFavoritePayload
    ) => {
      console.log(
        "[ADD FAVORITE REQUEST]:",
        payload
      );

      const response = await api.post(
        "/customer/favorite/",
        {
          menu_item_id: payload.menu_item_id,
          branch_id: payload.branch_id,
        }
      );

      console.log(
        "[ADD FAVORITE RESPONSE]:",
        response.data
      );

      return response.data;
    },

    onSuccess: async (data) => {
      console.log(
        "[ADD FAVORITE SUCCESS]:",
        data
      );

      await queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },

    onError: (error: any) => {
      console.log(
        "[API RESPONSE ERROR]:",
        error?.response?.data
      );

      console.log(
        "[ADD FAVORITE ERROR]:",
        error?.response?.data ||
          error?.message
      );
    },
  });
};