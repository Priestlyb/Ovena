import api from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface BulkDeleteMenuPayload {
    menus?: number[];
    categories?: number[];
    items?: number[];
    addons?: number[];
    varity?: number[];
}

const bulkDeleteMenu = async (payload: BulkDeleteMenuPayload) => {
    const { data } = await api.post(
        "/menu/business/bulk-delete/",
        payload
    );

    return data;
};

export const useBulkDeleteMenu = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bulkDeleteMenu,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["business-menu"],
            });
        },
    });
};