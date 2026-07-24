import {
    DEFAULT_COUNTRY,
    DEFAULT_LANGUAGE,
    DEFAULT_TYPES,
    GOOGLE_PLACE_DETAILS_URL,
    GOOGLE_PLACES_AUTOCOMPLETE_URL,
    MAX_RESULTS,
    PLACE_DETAILS_FIELDS,
} from "@/constants/google";

import {
    AddressComponent,
    AutocompleteResponse,
    GoogleLocation,
    PlaceDetailsResponse,
    PlacePrediction,
} from "@/types/google";

/* =========================================================
   SEARCH PLACES
========================================================= */

export const searchPlaces = async ({
  query,
  apiKey,
  country = DEFAULT_COUNTRY,
}: {
  query: string;
  apiKey: string;
  country?: string;
}): Promise<PlacePrediction[]> => {
  try {
    if (!query.trim()) {
      return [];
    }

    const params = new URLSearchParams({
      input: query,
      key: apiKey,
      language: DEFAULT_LANGUAGE,
      types: DEFAULT_TYPES,
      components: `country:${country}`,
    });

    const response = await fetch(
      `${GOOGLE_PLACES_AUTOCOMPLETE_URL}?${params.toString()}`,
    );

    const json: AutocompleteResponse = await response.json();

    if (json.status !== "OK" && json.status !== "ZERO_RESULTS") {
      console.log(JSON.stringify(json, null, 2));

      return [];
    }

    return (json.predictions || []).slice(0, MAX_RESULTS);
  } catch (error) {
    console.log("Google search error:", error);

    return [];
  }
};

/* =========================================================
   PLACE DETAILS
========================================================= */

export const getPlaceDetails = async ({
  placeId,
  apiKey,
}: {
  placeId: string;
  apiKey: string;
}): Promise<GoogleLocation | null> => {
  try {
    const params = new URLSearchParams({
      place_id: placeId,
      key: apiKey,
      fields: PLACE_DETAILS_FIELDS,
    });

    const response = await fetch(
      `${GOOGLE_PLACE_DETAILS_URL}?${params.toString()}`,
    );

    const json: PlaceDetailsResponse = await response.json();

    if (json.status !== "OK") {
      console.log("Place Details:", json.status);

      return null;
    }

    return parsePlaceDetails(json.result);
  } catch (error) {
    console.log("Google details error:", error);

    return null;
  }
};

/* =========================================================
   PARSE PLACE DETAILS
========================================================= */

export const parsePlaceDetails = (
  place: PlaceDetailsResponse["result"],
): GoogleLocation => {
  const city =
    findComponent(place.address_components, "locality") ||
    findComponent(place.address_components, "administrative_area_level_2");

  const state = findComponent(
    place.address_components,
    "administrative_area_level_1",
  );

  const country = findComponent(
    place.address_components,
    "country",
  );

  const postalCode = findComponent(
    place.address_components,
    "postal_code",
  );

  return {
    address: place.formatted_address,

    latitude: place.geometry.location.lat,

    longitude: place.geometry.location.lng,

    city,

    state,

    country,

    postalCode,

    placeId: place.place_id,
  };
};

/* =========================================================
   FIND ADDRESS COMPONENT
========================================================= */

const findComponent = (
  components: AddressComponent[],
  type: string,
): string => {
  const component = components.find((item) =>
    item.types.includes(type),
  );

  return component?.long_name || "";
};