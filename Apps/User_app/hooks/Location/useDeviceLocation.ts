{/*
// hooks/Location/useDeviceLocation.ts
import { useCallback, useState } from "react";

type Coords = {
    lat: number;
    lng: number;
};


const HARDCODED_COORDS: Coords = {
    lat: 5.002404,
    lng: 7.937773,
};

export const useDeviceLocation = () => {
    const [coords] = useState<Coords>(HARDCODED_COORDS);
    const [error] = useState<string | null>(null);
    const [loading] = useState(false);

    const getLocation = useCallback(async (): Promise<Coords> => {
        return HARDCODED_COORDS;
    }, []);

    return {
        coords,
        error,
        loading,
        getLocation,
    };
};
*/}



import { useCallback, useState } from "react";
import * as Location from "expo-location";

type Coords = {
    lat: number;
    lng: number;
};

const CACHE_DURATION = 25 * 60 * 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Shared cache across the app
let cachedCoords: Coords | null = null;
let lastFetchTime = 0;

// Shared in-flight request
let locationPromise: Promise<Coords | null> | null = null;

const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const useDeviceLocation = () => {
    const [coords, setCoords] = useState<Coords | null>(cachedCoords);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const getLocation = useCallback(async (): Promise<Coords | null> => {
        try {
            const now = Date.now();

            // Return cached location if still valid
            if (
                cachedCoords &&
                now - lastFetchTime < CACHE_DURATION
            ) {
                setCoords(cachedCoords);
                return cachedCoords;
            }

            // Wait for an existing request
            if (locationPromise) {
                const result = await locationPromise;

                if (result) {
                    setCoords(result);
                }

                return result;
            }

            setLoading(true);
            setError(null);

            locationPromise = (async () => {
                // Request permission once
                const { status } =
                    await Location.requestForegroundPermissionsAsync();

                if (status !== "granted") {
                    throw new Error("Location permission denied");
                }

                let lastError: any;

                for (
                    let attempt = 1;
                    attempt <= MAX_RETRIES;
                    attempt++
                ) {
                    try {
                        console.log(
                            `[GPS] Attempts ${attempt}/${MAX_RETRIES}`
                        );

                        const location =
                            await Location.getCurrentPositionAsync({
                                accuracy: Location.Accuracy.High,
                            });

                        const freshCoords: Coords = {
                            lat: location.coords.latitude,
                            lng: location.coords.longitude,
                        };

                        cachedCoords = freshCoords;
                        lastFetchTime = Date.now();

                        //console.log(
                        //   `[GPS] Success on attempt ${attempt}`
                        // );

                        return freshCoords;
                    } catch (err) {
                        lastError = err;

                        console.log(
                            `[GPS] Attempt ${attempt} failed`,
                            err
                        );

                        if (attempt < MAX_RETRIES) {
                            await sleep(RETRY_DELAY);
                        }
                    }
                }

                throw lastError ?? new Error("Failed to get device location");
            })();

            const result = await locationPromise;

            if (result) {
                setCoords(result);
            }

            return result;
        } catch (err: any) {
            const message =
                err?.message ?? "Failed to get device location";

            console.log("[GPS ERROR]", message);

            setError(message);

            return null;
        } finally {
            locationPromise = null;
            setLoading(false);
        }
    }, []);

    return {
        coords,
        error,
        loading,
        getLocation,
    };
};