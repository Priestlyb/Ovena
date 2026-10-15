// hooks/business/useBulkDeleteImages.ts

import api from "@/services/apiClient";
import { useCallback, useState } from "react";

export interface BulkDeleteImagesPayload {
    items?: string[];
    addons?: string[];
}

const useBulkDeleteImages = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const bulkDeleteImages = useCallback(
        async ({
            items = [],
            addons = [],
        }: BulkDeleteImagesPayload) => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.post(
                    "/menu/business/bulk-delete/images/",
                    {
                        items,
                        addons,
                    }
                );

                return response.data;
            } catch (err: any) {
                const message =
                    err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to delete images.";

                setError(message);

                console.log(
                    "Bulk Delete Images Error:",
                    err?.response?.data ?? err
                );

                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        bulkDeleteImages,
        loading,
        error,
    };
};

export default useBulkDeleteImages;