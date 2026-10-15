/**
 * -----------------------------------------------------------------------------
 * File: src/hooks/business/useBusinessVerificationStatus.ts
 * -----------------------------------------------------------------------------
 * Brika Business Verification Status Hook
 *
 * Fetches the authenticated business verification status.
 *
 * Endpoint:
 * GET /api/verify/business/status/
 *
 * Responsibilities:
 * - Fetch the authenticated business verification status.
 * - Cache the verification status with React Query.
 * - Prevent unnecessary refetches while data is fresh.
 * - Expose loading, fetching, error, and refetch states.
 * - Log the API response in an orderly manner.
 * -----------------------------------------------------------------------------
 */

import api from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

export interface BusinessVerificationStatus {
    [key: string]: unknown;
}

/**
 * -----------------------------------------------------------------------------
 * Query Key
 * -----------------------------------------------------------------------------
 *
 * Keeping the query key in one place makes it easier to invalidate/refetch
 * this query from other parts of the application.
 */

export const BUSINESS_VERIFICATION_STATUS_QUERY_KEY = [
    "businessVerificationStatus",
] as const;

/**
 * -----------------------------------------------------------------------------
 * API Request
 * -----------------------------------------------------------------------------
 */

const getBusinessVerificationStatus =
    async (): Promise<BusinessVerificationStatus> => {
        const endpoint = "/verify/business/status/";

        try {
            const response = await api.get(endpoint);

            console.log("\n");
            console.log(
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            );
            console.log("🏢 BUSINESS VERIFICATION STATUS");
            console.log(
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            );
            console.log("📡 Endpoint:", endpoint);
            console.log("🔢 HTTP Status:", response.status);
            console.log("📦 Response:");
            console.log(
                JSON.stringify(response.data, null, 2)
            );
            console.log(
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            );
            console.log("\n");

            return response.data;
        } catch (error: any) {
            console.log("\n");
            console.log(
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            );
            console.log("❌ BUSINESS VERIFICATION STATUS ERROR");
            console.log(
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            );
            console.log("📡 Endpoint:", endpoint);

            if (error?.response) {
                console.log(
                    "🔢 HTTP Status:",
                    error.response.status
                );

                console.log("📦 Error Response:");

                console.log(
                    JSON.stringify(
                        error.response.data,
                        null,
                        2
                    )
                );
            } else if (error?.request) {
                console.log(
                    "🌐 No response received from server."
                );
            } else {
                console.log(
                    "💬 Error:",
                    error?.message || "Unknown error"
                );
            }

            console.log(
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            );
            console.log("\n");

            throw error;
        }
    };

/**
 * -----------------------------------------------------------------------------
 * Hook
 * -----------------------------------------------------------------------------
 */

export const useBusinessVerificationStatus = () => {
    const query = useQuery({
        queryKey: BUSINESS_VERIFICATION_STATUS_QUERY_KEY,

        queryFn: getBusinessVerificationStatus,

        /**
         * Keep the response fresh for 5 minutes.
         *
         * This prevents the endpoint from being unnecessarily called every
         * time the component re-renders or remounts within that period.
         */
        staleTime: 5 * 60 * 1000,

        /**
         * Don't automatically refetch simply because the screen mounted again
         * while the cached data is still fresh.
         */
        refetchOnMount: false,

        /**
         * React Native does not need browser-style window focus refetching.
         */
        refetchOnWindowFocus: false,

        /**
         * Don't continuously retry failed requests.
         * React Query will retry once before exposing the error.
         */
        retry: 1,
    });

    return {
        /**
         * API response
         */
        verificationStatus: query.data,

        /**
         * Initial request
         */
        isLoading: query.isLoading,

        /**
         * Any request currently in progress, including refetch.
         */
        isFetching: query.isFetching,

        /**
         * Error state
         */
        isError: query.isError,

        /**
         * Error object
         */
        error: query.error,

        /**
         * Manually refresh verification status.
         */
        refetch: query.refetch,
    };
};