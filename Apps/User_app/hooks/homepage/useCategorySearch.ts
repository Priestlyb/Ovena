import { useMutation } from "@tanstack/react-query";
import api from "@/services/apiClient";

export interface CategorySearchPayload {
    category_id: number;
    lat: number;
    lng: number;
}

export interface CategorySearchResponse {
    // Add the exact response shape from your backend here.
    // Keeping this flexible for now:
    [key: string]: any;
}

const searchCategories = async (
    payload: CategorySearchPayload
): Promise<CategorySearchResponse> => {
    const response = await api.post(
        "/menu/cat/categories/search/",
        payload
    );

    return response.data;
};

export const useCategorySearch = () => {
    return useMutation({
        mutationFn: searchCategories,
    });
};