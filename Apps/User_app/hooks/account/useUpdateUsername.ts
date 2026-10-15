import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUsername } from "@/services/Account/account.service";
import { useAuth } from "@/context/AuthContext";

export const useUpdateUsername = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!accessToken) {
        throw new Error("No authentication token found");
      }

      const { response, data } = await updateUsername(
        accessToken,
        name
      );

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update username"
        );
      }

      return data;
    },

    onSuccess: async (data) => {

      // Mark the profile query as stale
      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      // Force active profile queries to refetch
      await queryClient.refetchQueries({
        queryKey: ["profile"],
        type: "active",
      });
    },

    onError: (error) => {
      console.error("❌ Failed to update username:", error);
    },
  });
};