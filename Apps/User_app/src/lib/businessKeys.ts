// hooks/homepage/business/keys.ts

/**
 * React Query keys for nearby businesses.
 *
 * The location is included in the key so each location
 * maintains its own cached paginated results.
 */

export const businessKeys = {
    all: ["businesses"] as const,

    lists: () => [...businessKeys.all, "list"] as const,

    list: (lat: number, lng: number) =>
        [...businessKeys.lists(), lat, lng] as const,
};