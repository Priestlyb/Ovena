/* =========================================================
   GOOGLE PLACE AUTOCOMPLETE TYPES
========================================================= */

export interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

/* =========================================================
   GOOGLE ADDRESS COMPONENT
========================================================= */

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

/* =========================================================
   GOOGLE PLACE DETAILS
========================================================= */

export interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: AddressComponent[];
}

/* =========================================================
   FINAL LOCATION OBJECT
========================================================= */

export interface GoogleLocation {
  address: string;
  latitude: number;
  longitude: number;

  city: string;
  state: string;
  country: string;
  postalCode: string;

  placeId: string;
}

/* =========================================================
   GOOGLE AUTOCOMPLETE RESPONSE
========================================================= */

export interface AutocompleteResponse {
  predictions: PlacePrediction[];
  status: string;
  error_message?: string;
}

/* =========================================================
   GOOGLE PLACE DETAILS RESPONSE
========================================================= */

export interface PlaceDetailsResponse {
  result: PlaceDetails;
  status: string;
  error_message?: string;
}

/* =========================================================
   GOOGLE ADDRESS INPUT PROPS
========================================================= */

export interface GoogleAddressInputProps {
  label?: string;
  placeholder?: string;
  required?: boolean;

  value: string;

  apiKey: string;

  /**
   * Restrict search to a country.
   * Example:
   * "ng"
   * "us"
   * "gb"
   */
  country?: string;

  /**
   * Called while typing.
   */
  onChangeText?: (text: string) => void;

  /**
   * Called after a location is selected
   * and its full details have been fetched.
   */
  onSelectLocation: (
    location: GoogleLocation,
  ) => void;
}