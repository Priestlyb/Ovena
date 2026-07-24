import api from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const BUSINESS_PROFILE_QUERY_KEY = ["business-profile"];

export const useBusinessImageUpdate = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            console.log("====================================");
            console.log("[BUSINESS IMAGE UPDATE] Uploading...");
            console.log("====================================");

            const response = await api.patch(
                "/business/images/update/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("====================================");
            console.log(
                "[BUSINESS IMAGE UPDATE] Response:",
                JSON.stringify(response.data, null, 2)
            );
            console.log("====================================");

            return response.data;
        },

        onSuccess: async () => {
            console.log(
                "[BUSINESS IMAGE UPDATE] Refreshing business profile..."
            );

            await queryClient.invalidateQueries({
                queryKey: BUSINESS_PROFILE_QUERY_KEY,
            });
        },

        onError: (err: any) => {
            console.error(
                "[BUSINESS IMAGE UPDATE ERROR]",
                err?.response?.data || err
            );
        },
    });

    return {
        updateBusinessImages: mutation.mutateAsync,
        loading: mutation.isPending,
        error:
            (mutation.error as any)?.response?.data?.detail ||
            mutation.error?.message ||
            null,
    };
};