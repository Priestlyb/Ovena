// hooks/useProfile.ts

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/context/AuthContext";

const BASE_URL =
  "https://ovena-backend-production.up.railway.app/api";

/* ================= TYPES ================= */

interface DefaultAddress {
  id: number;
  label: string;
  address: string;
  lat: number;
  long: number;
}

interface UserProfile {
  id: number;
  referral_code?: string;
  default_address?: DefaultAddress;
  points?: number;
  name?: string;
}

interface UserData {
  id: number;
  email: string;
  phone_number: string;
  name?: string;
}

export interface ProfileData {
  name: string;
  email: string;
  points: number;

  user?: UserData;

  profile?: UserProfile;

  /* =========================================
     DIRECT ACCESS HELPERS
  ========================================= */
  default_address?: DefaultAddress;

  lat?: number;
  lng?: number;
}

/* ================= CACHE ================= */

// Global cache shared across app
let profileCache: ProfileData | null =
  null;

let rawProfileCache: any = null;

let lastFetchTime = 0;

let ongoingRequest:
  | Promise<void>
  | null = null;

// 5 minutes cache
const CACHE_DURATION =
  1000 * 60 * 5;

/* ================= HOOK ================= */

export const useProfile = () => {
  const { accessToken } =
    useAuth();

  const [profile, setProfile] =
    useState<ProfileData>(
      profileCache || {
        name: "Ovena User",
        email: "Member",
        points: 0,
      }
    );

  const [loading, setLoading] =
    useState(!profileCache);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const [rawData, setRawData] =
    useState<any>(
      rawProfileCache
    );

  const fetchProfile =
    useCallback(
      async (
        silent = false
      ) => {
        if (!accessToken) {
          setError(
            "No access token"
          );

          setLoading(false);

          return;
        }

        /* =========================================
           CACHE CHECK
        ========================================= */
        const now = Date.now();

        const cacheStillValid =
          profileCache &&
          now -
          lastFetchTime <
          CACHE_DURATION;

        if (
          cacheStillValid &&
          silent
        ) {
          return;
        }

        /* =========================================
           PREVENT DUPLICATE REQUESTS
        ========================================= */
        if (ongoingRequest) {
          await ongoingRequest;

          return;
        }

        if (!silent) {
          setLoading(true);
        }

        setError(null);

        ongoingRequest =
          (async () => {
            try {
              const res =
                await fetch(
                  `${BASE_URL}/accounts/profile/`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                      "Content-Type":
                        "application/json",
                    },
                  }
                );

                //console.log("Profile Response", res)

              if (!res.ok) {
                setError(
                  `Server returned ${res.status}`
                );

                return;
              }

              const data =
                await res.json();

              //console.log("PROFILE RESPONSE");
              //console.log(JSON.stringify(data, null, 2));

              /* =========================================
                 LOCATION EXTRACTION
              ========================================= */
              const defaultAddress =
                data?.profile
                  ?.default_address;

              const lat =
                defaultAddress?.lat;

              const lng =
                defaultAddress?.long;

              /* =========================================
                 FORMAT PROFILE
              ========================================= */
              const formattedProfile: ProfileData =
              {
                name:
                  data?.profile
                    ?.name ||
                  data?.user
                    ?.name ||
                  "User",

                email:
                  data?.user
                    ?.phone_number ||
                  "Member",

                points: Number(
                  data?.profile
                    ?.points ??
                  0
                ),

                user:
                  data?.user,

                profile:
                  data?.profile,

                // Direct access helpers
                default_address:
                  defaultAddress,

                lat,

                lng,
              };

              /* =========================================
                 SAVE TO CACHE
              ========================================= */
              profileCache =
                formattedProfile;

              rawProfileCache =
                data;

              lastFetchTime =
                Date.now();

              /* =========================================
                 UPDATE STATE
              ========================================= */
              setRawData(data);

              setProfile(
                formattedProfile
              );
            } catch {
              setError(
                "Network error"
              );
            } finally {
              ongoingRequest =
                null;

              setLoading(false);
            }
          })();

        await ongoingRequest;
      },
      [accessToken]
    );

  useEffect(() => {
    // Load instantly from cache
    if (profileCache) {
      setProfile(
        profileCache
      );

      if (
        rawProfileCache
      ) {
        setRawData(
          rawProfileCache
        );
      }

      // Silent refresh in background
      fetchProfile(true);

      return;
    }

    // First ever fetch
    fetchProfile();
  }, [
    fetchProfile,
    accessToken,
  ]);

  return {
    profile,
    loading,
    error,
    rawData,

    // Manual refresh
    refetchProfile: () =>
      fetchProfile(false),
  };
};