/* =========================================================
   GOOGLE PLACES CONFIGURATION
========================================================= */

/**
 * Google Places Autocomplete API
 */
export const GOOGLE_PLACES_AUTOCOMPLETE_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";

/**
 * Google Place Details API
 */
export const GOOGLE_PLACE_DETAILS_URL =
  "https://maps.googleapis.com/maps/api/place/details/json";

/**
 * Optional Geocoding API
 * (Useful for reverse geocoding in the future)
 */
export const GOOGLE_GEOCODE_URL =
  "https://maps.googleapis.com/maps/api/geocode/json";

/* =========================================================
   SEARCH CONFIGURATION
========================================================= */

/**
 * Delay before searching while typing.
 */
export const SEARCH_DEBOUNCE = 500;

/**
 * Minimum characters before requesting suggestions.
 */
export const MIN_SEARCH_LENGTH = 3;

/**
 * Maximum number of suggestions to display.
 */
export const MAX_RESULTS = 5;

/* =========================================================
   PLACE DETAILS FIELDS
========================================================= */

/**
 * Only request the fields we actually need.
 * This reduces API usage and speeds up responses.
 */
export const PLACE_DETAILS_FIELDS = [
  "formatted_address",
  "geometry",
  "address_component",
  "place_id",
].join(",");

/* =========================================================
   DEFAULT SEARCH SETTINGS
========================================================= */

/**
 * Restrict autocomplete results to addresses only.
 */
export const DEFAULT_TYPES = "address";

/**
 * Default language.
 */
export const DEFAULT_LANGUAGE = "en";

/**
 * Restrict results to Nigeria by default.
 * Can be overridden from the component.
 */
export const DEFAULT_COUNTRY = "ng";