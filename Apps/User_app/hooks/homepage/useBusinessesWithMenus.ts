import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiClient";
import { useProfile } from "@/hooks/useProfile";
import { useMemo } from "react";

/* ================= TYPES ================= */

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface BusinessWithMenus {
  id: number;
  name: string;
  description?: string;
  address?: string;
  image?: string;
  menus: MenuItem[];
}

/* ================= FETCHER ================= */

const fetchBusinessesWithMenus = async (params: {
  lat: number;
  lng: number;
  page: number;
}): Promise<BusinessWithMenus[]> => {
  const response = await api.get(
    "/menu/businesses/with-menus/",
    {
      params: {
        lat: params.lat,
        lng: params.lng,
        page: params.page,
      },
    }
  );


  //console.log(
    //"[BusinessMenuFetch API RESPONSE]",
    //JSON.stringify(response.data, null, 2)
  //);

  return response.data?.results || response.data || [];

};


/* ================= HOOK ================= */

export const useBusinessesWithMenus = (page: number = 1) => {
  const { profile } = useProfile();

  const lat = profile?.profile?.default_address?.lat;
  const lng = profile?.profile?.default_address?.long;

  const isLocationReady = useMemo(() => {
    return (
      typeof lat === "number" &&
      typeof lng === "number" &&
      !Number.isNaN(lat) &&
      !Number.isNaN(lng)
    );
  }, [lat, lng]);

  const query = useQuery({
    queryKey: ["businesses-with-menus", lat, lng, page],
    enabled: isLocationReady,
    queryFn: () =>
      fetchBusinessesWithMenus({
        lat: lat!,
        lng: lng!,
        page,
      }),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    retry: 2,
  });

  return query;
};