/**
 * types/userDetail.ts
 *
 * GET /api/admin/users/{user_id}/ — shape varies per role. A user's
 * `profiles` object tells you which of the profile keys below will be
 * present; the presence of the key itself (not a null check) is the
 * signal, since absent profiles are omitted from the response entirely
 * rather than sent as null.
 *
 * A single user CAN have multiple profiles simultaneously (e.g. customer
 * + driver) — no example exists yet in the sample data, but the UI is
 * built to render every present section rather than assume exactly one.
 */

export interface UserAddress {
  id: number;
  label: string;
  address: string;
  lat: number;
  long: number;
  created_at: string;
}

export interface CustomerProfileWire {
  id: number;
  default_address: UserAddress | null;
  addresses: UserAddress[];
  birth_date: string | null;
  age: number | null;
  referral_code: string;
  name: string;
  pickup_food: boolean;
  points: number;
}

export interface DriverProfileWire {
  id: number;
  user: { id: number; email: string; phone_number: string; is_active: boolean; is_approved: boolean };
  first_name: string;
  last_name: string;
  gender: string;
  is_online: boolean;
  is_available: boolean;
  last_location_update: string | null;
  vehicle_make: string;
  vehicle_type: string | null;
  vehicle_number: string | null;
  total_deliveries: number;
  avg_rating: number;
  created_at: string;
  latest_onboarding_status: string;
  latest_onboarding_submitted_at: string | null;
  pending_documents_count: number;
  pending_onboarding_submissions_count: number;
}

export interface BusinessAdminBusinessWire {
  id: number;
  business_name: string;
  business_type: string;
  country: string;
  business_address: string;
  email: string;
  phone_number: string;
  onboarding_complete: boolean;
  created_at: string;
  admin_user: { id: number; email: string; phone_number: string } | null;
}

export interface BusinessStaffBranchWire {
  id: number;
  rating_sum: number;
  rating_count: number;
  avg_rating: number;
  name: string;
  address: string;
  location: { type: string; coordinates: [number, number] };
  is_active: boolean;
  is_accepting_orders: boolean;
  average_prep_time: number;
  created_at: string;
  delivery_method: string;
  pre_order_open_period: string | null;
  final_order_time: string | null;
  business: number;
}

export interface BusinessStaffProfileWire {
  id: number;
  device_name: string;
  is_active: boolean;
  revoked: boolean;
  created_at: string;
  branch: BusinessStaffBranchWire;
  name: string;
}

export interface AppAdminProfileWire {
  id: number;
}

export interface UserDetailResponse {
  user: {
    id: number;
    email: string | null;
    phone_number: string | null;
    is_active: boolean;
    is_staff: boolean;
    roles: string[];
  };
  profiles: {
    customer: boolean;
    driver: boolean;
    business_admin: boolean;
    business_staff: boolean;
    app_admin: boolean;
  };
  customer_profile?: CustomerProfileWire;
  driver_profile?: DriverProfileWire;
  business?: BusinessAdminBusinessWire;
  business_staff?: BusinessStaffProfileWire;
  app_admin?: AppAdminProfileWire;
}