// hooks/homepage/business/types.ts

export interface NearestBranch {
  id: number;
  name: string;
  distance_km: number;
  lat: number;
  long: number;
  address: string;
  is_open: boolean;
}

export interface Business {
  id: number;

  business_name: string;
  business_type: string;

  business_logo: string | null;
  business_image: string | null;

  avg_rating: number;
  rating_count: number;

  nearest_branch: NearestBranch | null;

  // Allow future fields from the API
  [key: string]: any;
}

export interface BusinessesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Business[];
}

export interface FetchBusinessesParams {
  lat: number;
  lng: number;
  page?: number;
}

export interface UseBusinessMenuFetchReturn {
  businesses: Business[];

  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;

  error: string | null;

  hasNextPage: boolean;

  loadMore: () => void;

  refetch: () => Promise<void>;
}