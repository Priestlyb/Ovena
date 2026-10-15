import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";

/* ======================================================
   CATEGORY TAG
====================================================== */

export interface CategoryTag {
    id: number;
    images: string;
    name: string;
    slug: string;
    tags: number[];
    tags_count: number;
}

/* ======================================================
   CATEGORY SEARCH
====================================================== */

export interface CategorySearchPayload {
    category_id: number;
    lat: number;
    lng: number;
}

/*
 * Your backend response currently looks like:
 *
 * [
 *   {
 *     business_name: "Pristina Hotel",
 *     categories: [...],
 *     id: 17,
 *     nearest_branch: {
 *       distance_km: 0.04,
 *       id: 13,
 *       is_open: true
 *     }
 *   }
 * ]
 *
 * We keep this flexible for now until you have
 * the complete response structure.
 */

export interface CategorySearchBusiness {
    id: number;
    business_name: string;
    categories?: any[];
    nearest_branch?: {
        id: number;
        distance_km: number;
        is_open: boolean;
        [key: string]: any;
    };
    [key: string]: any;
}

export type CategorySearchResponse =
    CategorySearchBusiness[];

/* ======================================================
   GET CATEGORY TAGS
====================================================== */

const fetchCategoryTags =
    async (): Promise<CategoryTag[]> => {
        const response = await api.get(
            "/menu/cat/categories/tag/list",
        );

        return response.data;
    };

/* ======================================================
   CATEGORY TAGS HOOK
====================================================== */

export const useCategoryTags = () => {
    return useQuery<CategoryTag[], Error>({
        queryKey: ["category-tags"],
        queryFn: fetchCategoryTags,
    });
};

/* ======================================================
   CATEGORY SEARCH API
====================================================== */

const searchCategories = async (
    payload: CategorySearchPayload,
): Promise<CategorySearchResponse> => {
    const response = await api.post(
        "/menu/cat/categories/search/",
        payload,
    );

    return response.data;
};

/* ======================================================
   CATEGORY SEARCH HOOK
====================================================== */

export const useCategorySearch = () => {
    return useMutation<
        CategorySearchResponse,
        Error,
        CategorySearchPayload
    >({
        mutationFn: searchCategories,
    });
};