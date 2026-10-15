import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/services/apiClient";
import { useDeviceLocation } from "@/hooks/Location/useDeviceLocation";

/* ================= TYPES ================= */

export type BusinessMenuResponse = {
    id: number;
    business_name?: string;
    business_logo?: string | null;
    business_type?: string;
    business_image?: string | null;
    avg_rating?: number;
    rating_count?: number;

    nearest_branch?: {
        id: number;
        name: string;
        address: string;
        distance_km: number | null;
        average_prep_time: number;

        // NEW
        is_open: boolean;
        open_time: string;
        close_time: string;
        delivery_method: string;

        lat?: number;
        long?: number;
    };

    menus?: any[];
    categories?: any[];
};

type NormalizedBusinessMenu = {
    id: number;
    business_name: string;
    business_logo: string | null;
    business_image: string | null;
    business_type: string;
    avg_rating: number;
    rating_count: number;
    nearest_branch?: BusinessMenuResponse["nearest_branch"];
    menus: any[];
    categories: any[];
};

/* ================= IN-MEMORY CACHE ================= */

const businessMenuCache = new Map<string, NormalizedBusinessMenu>();

const getCacheKey = (
    businessId?: string | number,
    lat?: number,
    lng?: number
) => {
    const normalize = (v?: number) =>
        typeof v === "number" ? v.toFixed(4) : "0";

    return `${businessId}-${normalize(lat)}-${normalize(lng)}`;
};

/* ================= NORMALIZER ================= */

const normalizeBusinessMenu = (
    data: BusinessMenuResponse
): NormalizedBusinessMenu => {
    const menus = data?.menus || [];

    const categories =
        data?.categories ||
        menus.flatMap((m: any) => m?.categories || []) ||
        [];

    return {
        id: data.id,
        business_name: data.business_name || "Restaurant",
        business_logo: data.business_logo || null,
        business_image: data.business_image || null,
        business_type: data.business_type || "Restaurant",
        avg_rating: data.avg_rating ?? 0,
        rating_count: data.rating_count ?? 0,

        nearest_branch: data.nearest_branch
            ? {
                id: data.nearest_branch.id,
                name: data.nearest_branch.name,
                address: data.nearest_branch.address,
                distance_km: data.nearest_branch.distance_km,
                average_prep_time:
                    data.nearest_branch.average_prep_time,

                // NEW
                is_open: data.nearest_branch.is_open,
                open_time: data.nearest_branch.open_time,
                close_time: data.nearest_branch.close_time,
                delivery_method: data.nearest_branch.delivery_method,

                lat: data.nearest_branch.lat,
                long: data.nearest_branch.long,
            }
            : undefined,

        menus,
        categories,
    };
};

/* ================= HOOK ================= */

export const useBusinessId = (
    businessId?: number | string
) => {
    const {
        coords,
        getLocation,
        loading: locationLoading,
    } = useDeviceLocation();

    const [data, setData] =
        useState<NormalizedBusinessMenu | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const lastCacheKeyRef = useRef<string | null>(null);

    /* ================= INIT LOCATION ================= */

    useEffect(() => {
        if (!coords) {
            getLocation();
        }
    }, [coords, getLocation]);

    /* ================= FETCH ================= */

    const fetchBusinessMenu = useCallback(
        async (mode: "initial" | "silent" = "initial") => {
            if (!businessId || !coords) return;

            const lat = coords.lat;
            const lng = coords.lng;

            const cacheKey = getCacheKey(businessId, lat, lng);

            /* ================= CACHE HIT ================= */

            const cached = businessMenuCache.get(cacheKey);

            if (cached && mode === "initial") {
                setData(cached);
                return;
            }

            /* ================= PREVENT DUPLICATE CALLS ================= */

            if (
                mode === "initial" &&
                lastCacheKeyRef.current === cacheKey
            ) {
                return;
            }

            lastCacheKeyRef.current = cacheKey;

            try {
                if (mode === "initial") {
                    setLoading(true);
                }

                setError(null);

                const response = await api.get(
                    `/menu/businesses/${businessId}/`,
                    {
                        params: {
                            lat,
                            lng,
                        },
                    }
                );

                //console.log(
                //    "[BusinessMenu Response]",
                //    JSON.stringify(response.data, null, 2)
                // );

                const normalized = normalizeBusinessMenu(
                    response.data
                );

                businessMenuCache.set(cacheKey, normalized);
                setData(normalized);
            } catch (err: any) {
                console.log(
                    "[BusinessMenu Error]",
                    err?.message
                );

                setError(
                    err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Something went wrong"
                );
            } finally {
                if (mode === "initial") {
                    setLoading(false);
                }
            }
        },
        [businessId, coords]
    );

    /* ================= INITIAL FETCH ================= */

    useEffect(() => {
        if (!businessId || !coords) return;

        fetchBusinessMenu("initial");
    }, [businessId, coords, fetchBusinessMenu]);

    /* ================= SILENT REFRESH ================= */

    const refetchSilent = useCallback(() => {
        if (!coords) return;

        fetchBusinessMenu("silent");
    }, [fetchBusinessMenu, coords]);

    /* ================= MANUAL REFRESH ================= */

    const refetch = useCallback(() => {
        return fetchBusinessMenu("initial");
    }, [fetchBusinessMenu]);

    return {
        data,
        loading,
        locationLoading,
        error,
        refetch,
        refetchSilent,
    };
};