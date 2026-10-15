import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "@/services/apiClient";
import { useDeviceLocation } from "@/hooks/Location/useDeviceLocation";

type HomepageResponse = {
    [key: string]: any;
};

const CACHE_KEY = "HOMEPAGE_MENU_CACHE_V1";
const CACHE_TTL = 1000 * 60 * 60 * 2; // 2 hours

type CacheShape = {
    timestamp: number;
    lat: number;
    lng: number;
    data: HomepageResponse;
};

/* =========================
   DISTANCE CHECK (50m threshold)
========================= */

const hasMovedSignificantly = (
    prev: { lat: number; lng: number } | null,
    next: { lat: number; lng: number },
    thresholdMeters = 50
) => {
    if (!prev) return true;

    const toRad = (v: number) => (v * Math.PI) / 180;

    const R = 6371e3;

    const dLat = toRad(next.lat - prev.lat);
    const dLng = toRad(next.lng - prev.lng);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(prev.lat)) *
        Math.cos(toRad(next.lat)) *
        Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance > thresholdMeters;
};

/* =========================
   HOOK
========================= */

export const useHomePageFetch = ({
    accessToken,
}: {
    accessToken?: string | null;
}) => {
    const { coords, getLocation } = useDeviceLocation();

    const [data, setData] = useState<HomepageResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const prevCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
    const hasFetchedOnceRef = useRef(false);
    const inFlightRef = useRef(false);
    const previousDataRef = useRef<HomepageResponse | null>(null);

    /* =========================
       LOAD CACHE
    ========================= */

    const loadCache = useCallback(async (lat: number, lng: number) => {
        try {
            const cached = await AsyncStorage.getItem(CACHE_KEY);

            if (!cached) return null;

            const parsed: CacheShape = JSON.parse(cached);

            const isFresh = Date.now() - parsed.timestamp < CACHE_TTL;

            const isSameLocation = !hasMovedSignificantly(
                { lat: parsed.lat, lng: parsed.lng },
                { lat, lng },
                50
            );

            if (isFresh && isSameLocation) {
                previousDataRef.current = parsed.data;

                setData(parsed.data);

                return parsed.data;
            }

            return null;
        } catch (error) {
            console.log("[useHomePageFetch] Failed to load cache", error);
            return null;
        }
    }, []);

    /* =========================
       SAVE CACHE
    ========================= */

    const saveCache = useCallback(
        async (lat: number, lng: number, homepageData: HomepageResponse) => {
            try {
                const payload: CacheShape = {
                    timestamp: Date.now(),
                    lat,
                    lng,
                    data: homepageData,
                };

                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
            } catch (error) {
                console.log("[useHomePageFetch] Failed to save cache", error);
            }
        },
        []
    );

    /* =========================
       FETCH LOGIC
    ========================= */

    const fetchHomepageMenu = useCallback(
        async (force = false) => {
            if (!accessToken || !coords) return;

            if (inFlightRef.current) return;

            const { lat, lng } = coords;

            const current = { lat, lng };

            if (
                !force &&
                !hasMovedSignificantly(prevCoordsRef.current, current)
            ) {
                return;
            }

            prevCoordsRef.current = current;

            try {
                inFlightRef.current = true;

                const cached = await loadCache(lat, lng);

                if (cached && !force) {
                    hasFetchedOnceRef.current = true;
                    return;
                }

                setLoading(true);
                setError(null);

                const response = await api.get("/menu/homepage/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    params: {
                        lat,
                        lng,
                    },
                });

                //console.log("========================================");
                //console.log("📦 Data:");
                //console.log(JSON.stringify(response.data, null, 2));
                //console.log("========================================\n");

                previousDataRef.current = response.data;

                setData(response.data);

                await saveCache(lat, lng, response.data);

                hasFetchedOnceRef.current = true;
            } catch (err: any) {
                setError(
                    err?.response?.data?.detail ??
                    err?.message ??
                    "Failed to fetch homepage menu"
                );
            } finally {
                setLoading(false);
                inFlightRef.current = false;
            }
        },
        [accessToken, coords, loadCache, saveCache]
    );

    /* =========================
       INIT LOCATION
    ========================= */

    useEffect(() => {
        if (!accessToken) return;

        getLocation();
    }, [accessToken, getLocation]);

    /* =========================
       FETCH WHEN LOCATION READY
    ========================= */

    useEffect(() => {
        if (!accessToken) return;

        if (!coords) return;

        if (hasFetchedOnceRef.current) return;

        fetchHomepageMenu();
    }, [accessToken, coords, fetchHomepageMenu]);

    /* =========================
       MANUAL REFRESH
    ========================= */

    const refetch = useCallback(async () => {
        hasFetchedOnceRef.current = false;

        await fetchHomepageMenu(true);
    }, [fetchHomepageMenu]);

    /* =========================
       RETRY AFTER ERROR
    ========================= */

    const retry = useCallback(async () => {
        await getLocation();

        hasFetchedOnceRef.current = false;

        await fetchHomepageMenu(true);
    }, [getLocation, fetchHomepageMenu]);

    return {
        data,
        loading,
        error,
        coords,
        refetchLocation: getLocation,
        refetch,
        retry,
    };
};