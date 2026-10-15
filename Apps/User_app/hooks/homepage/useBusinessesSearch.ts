import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import api from "@/services/apiClient";
import { useDeviceLocation } from "@/hooks/Location/useDeviceLocation";

type Business = {
  id: number | string;
  name: string;
  logo?: string | null;
  image?: string | null;
  address?: string;
  rating?: number;
  ratingCount?: number;
  businessType?: string;

  nearestBranch?: {
    id: number | string;
    name: string;
    distance_km: number;
    lat: number;
    long: number;
    address: string;
    is_open: boolean;
  };

  matchType?: string;
  matches?: any[];
  totalMatches?: number;

  [key: string]: any;
};

const SEARCH_DELAY = 500;
const DEFAULT_PAGE = 1;
const DEFAULT_MAX_DISTANCE = 10;

export default function useBusinessesSearch() {
  const {
    coords,
    getLocation,
    loading: locationLoading,
  } = useDeviceLocation();

  const [search, setSearch] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* =========================================================
     LOAD DEVICE LOCATION
  ========================================================= */

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  /* =========================================================
     FETCH BUSINESSES
  ========================================================= */

  const fetchBusinesses = useCallback(async () => {
    const trimmedSearch = search.trim();

    // Don't search for less than 3 characters
    if (trimmedSearch.length < 3) {
      setBusinesses([]);
      setLoading(false);
      setError("");
      return;
    }

    let currentLat = coords?.lat;
    let currentLng = coords?.lng;

    /* ---------------------------------------------------------
       Get location if it isn't available yet
    --------------------------------------------------------- */

    if (currentLat == null || currentLng == null) {
      const location = await getLocation();

      if (!location) {
        console.log("Unable to get device location.");

        setBusinesses([]);
        setLoading(false);

        return;
      }

      currentLat = location.lat;
      currentLng = location.lng;
    }

    try {
      setLoading(true);
      setError("");

      /* -------------------------------------------------------
         Cancel previous request
      ------------------------------------------------------- */

      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();

      abortRef.current = controller;

      /* -------------------------------------------------------
         API REQUEST
      ------------------------------------------------------- */

      const response = await api.get("/menu/businesses/search/", {
        params: {
          search: trimmedSearch.toLowerCase(),
          lat: currentLat,
          lng: currentLng,
          page: DEFAULT_PAGE,
          max_distance: DEFAULT_MAX_DISTANCE,
        },
        signal: controller.signal,
      });

      const data = response.data;

      /* =======================================================
         LOG ONLY THE FIRST RAW RESULT
      ======================================================= */

      const firstResult = data?.results?.[0];

      console.log(
        "========== FIRST BUSINESS SEARCH RESULT =========="
      );

      if (firstResult) {
        console.log(
          JSON.stringify(firstResult, null, 2)
        );
      } else {
        console.log("No business results found.");
      }

      /* =======================================================
         NORMALIZE RESULTS
      ======================================================= */

      const results = Array.isArray(data?.results)
        ? data.results
        : [];

      const normalized: Business[] = results
        .map((item: any) => {
          const business = item?.business;

          if (!business) {
            return null;
          }

          return {
            id: business.id,

            name: business.business_name,

            logo: business.business_logo,

            image: business.business_image,

            address:
              business.nearest_branch?.address,

            rating: business.avg_rating,

            businessType:
              business.business_type,

            ratingCount:
              business.rating_count,

            nearestBranch:
              business.nearest_branch,

            matchType:
              item.match_type,

            matches:
              item.matches,

            totalMatches:
              item.total_matches,
          };
        })
        .filter(Boolean) as Business[];

      /* =======================================================
         LOG ONLY THE FIRST NORMALIZED BUSINESS

      console.log(
        "========== FIRST NORMALIZED BUSINESS =========="
      );

      if (normalized.length > 0) {
        console.log(
          JSON.stringify(normalized[0], null, 2)
        );
      } else {
        console.log("No normalized businesses found.");
      }
        
      ======================================================= */

      /* =======================================================
         UPDATE STATE
      ======================================================= */

      setBusinesses(normalized);
    } catch (err: any) {
      /* -------------------------------------------------------
         Ignore cancelled requests
      ------------------------------------------------------- */

      if (
        axios.isCancel(err) ||
        err?.code === "ERR_CANCELED"
      ) {
        return;
      }

      console.log(
        "Businesses search error:",
        err?.response?.data ||
        err?.message ||
        err
      );

      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch businesses."
      );

      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  }, [search, coords, getLocation]);

  /* =========================================================
     DEBOUNCE SEARCH
  ========================================================= */

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchBusinesses();
    }, SEARCH_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [search, fetchBusinesses]);

  /* =========================================================
     REFETCH WHEN LOCATION BECOMES AVAILABLE
  ========================================================= */

  useEffect(() => {
    if (
      coords &&
      search.trim().length >= 3
    ) {
      fetchBusinesses();
    }
  }, [coords, search, fetchBusinesses]);

  /* =========================================================
     RETURN
  ========================================================= */

  return {
    search,
    setSearch,
    businesses,
    loading,
    error,
    refetch: fetchBusinesses,
    locationLoading,
  };
}