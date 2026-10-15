// hooks/homepage/business/api.ts

import api from "@/services/apiClient";

import {
  BusinessesResponse,
  FetchBusinessesParams,
} from "@/src/types/business";

/**
 * Fetch a single page of nearby businesses.
 */
export const fetchBusinesses = async ({
  lat,
  lng,
  page = 1,
}: FetchBusinessesParams): Promise<BusinessesResponse> => {
  const response = await api.get<BusinessesResponse>(
    "/menu/businesses/",
    {
      params: {
        lat,
        lng,
        page,
      },
    }
  );

  // console.log(
  //  `[BUSINESSES] Page ${page}`,
  //   JSON.stringify(response.data, null, 2)
  // );

  return response.data;
};