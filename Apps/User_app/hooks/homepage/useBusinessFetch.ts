// hooks/homepage/useBusinessMenuFetch.ts

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useDeviceLocation } from "@/hooks/Location/useDeviceLocation";

import { fetchBusinesses } from "@/services/businessApi";
import { businessKeys } from "@/src/lib/businessKeys";
import {
  Business,
  BusinessesResponse,
  UseBusinessMenuFetchReturn,
} from "@/src/types/business";

/* ================= DISTANCE CHECK ================= */

const hasMovedSignificantly = (
  prev: { lat: number; lng: number } | null,
  next: { lat: number; lng: number },
  thresholdMeters = 50
) => {
  if (!prev) return true;

  const toRad = (v: number) =>
    (v * Math.PI) / 180;

  const R = 6371e3;

  const dLat = toRad(next.lat - prev.lat);
  const dLng = toRad(next.lng - prev.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(prev.lat)) *
    Math.cos(toRad(next.lat)) *
    Math.sin(dLng / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c > thresholdMeters;
};

/* ================= HOOK ================= */

const useBusinessMenuFetch =
  (): UseBusinessMenuFetchReturn => {
    const { coords, getLocation } =
      useDeviceLocation();

    const previousCoords = useRef<{
      lat: number;
      lng: number;
    } | null>(null);

    /* ================= GET LOCATION ================= */

    useEffect(() => {
      getLocation();
    }, [getLocation]);

    /* ================= UPDATE LOCATION ================= */

    useEffect(() => {
      if (!coords) return;

      const current = {
        lat: coords.lat,
        lng: coords.lng,
      };

      if (
        hasMovedSignificantly(
          previousCoords.current,
          current
        )
      ) {
        previousCoords.current = current;
      }
    }, [coords]);

    /* ================= QUERY ================= */

    const query =
      useInfiniteQuery<BusinessesResponse, Error>({
        queryKey:
          coords && previousCoords.current
            ? businessKeys.list(
              previousCoords.current.lat,
              previousCoords.current.lng
            )
            : ["businesses", "disabled"],

        enabled: !!coords,

        initialPageParam: 1,

        staleTime: 1000 * 60 * 10,

        gcTime: 1000 * 60 * 30,

        retry: 2,

        queryFn: async ({ pageParam }) => {
          if (!coords) {
            throw new Error(
              "Location unavailable."
            );
          }

          return fetchBusinesses({
            lat:
              previousCoords.current?.lat ??
              coords.lat,

            lng:
              previousCoords.current?.lng ??
              coords.lng,

            page: Number(pageParam),
          });
        },

        getNextPageParam: (
          lastPage,
          allPages
        ) => {
          if (!lastPage.next) {
            return undefined;
          }

          return allPages.length + 1;
        },
      });

    /* ================= FLATTEN + REMOVE DUPLICATES ================= */

    const businesses = useMemo<Business[]>(() => {
      if (!query.data?.pages) {
        return [];
      }

      const allBusinesses =
        query.data.pages.flatMap(
          (page) => page.results
        );

      /**
       * Remove duplicated businesses
       * caused by overlapping pagination.
       */
      return Array.from(
        new Map(
          allBusinesses.map((business) => [
            business.id,
            business,
          ])
        ).values()
      );
    }, [query.data]);

    /* ================= LOAD MORE ================= */

    const loadMore = useCallback(() => {
      if (
        query.hasNextPage &&
        !query.isFetchingNextPage
      ) {
        query.fetchNextPage();
      }
    }, [
      query.hasNextPage,
      query.isFetchingNextPage,
      query.fetchNextPage,
    ]);

    /* ================= REFRESH ================= */

    const refetch = useCallback(async () => {
      await query.refetch();
    }, [query]);

    /* ================= LOADING STATES ================= */

    const loading =
      query.isPending &&
      businesses.length === 0;

    const loadingMore =
      query.isFetchingNextPage;

    const refreshing =
      query.isRefetching &&
      !query.isFetchingNextPage;

    /* ================= ERROR ================= */

    const error =
      query.error?.message ?? null;

    /* ================= RETURN ================= */

    return {
      businesses,

      loading,

      loadingMore,

      refreshing,

      error,

      hasNextPage:
        !!query.hasNextPage,

      loadMore,

      refetch,
    };
  };

export default useBusinessMenuFetch;