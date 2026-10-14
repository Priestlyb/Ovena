/**
 * utils/roles.ts
 *
 * Normalizes role spelling inconsistencies between endpoints:
 *   GET /api/admin/users/           → user.roles: ["customer","driver","businessadmin","businessstaff","appadmin"]
 *   GET /api/admin/users/{id}/      → profiles: { customer, driver, business_admin, business_staff, app_admin }
 *
 * Same underlying roles, different spelling per endpoint. Everything in
 * the UI should go through normalizeRole() rather than compare raw
 * strings, so a spelling drift on either endpoint doesn't silently break
 * badge rendering or section visibility.
 */

export type NormalizedRole = 'customer' | 'driver' | 'business_admin' | 'business_staff' | 'app_admin';

const ROLE_MAP: Record<string, NormalizedRole> = {
  customer: 'customer',
  driver: 'driver',
  businessadmin: 'business_admin',
  business_admin: 'business_admin',
  businessstaff: 'business_staff',
  business_staff: 'business_staff',
  appadmin: 'app_admin',
  app_admin: 'app_admin',
};

export function normalizeRole(role: string): NormalizedRole | string {
  return ROLE_MAP[role.toLowerCase()] ?? role;
}

export const ROLE_LABEL: Record<NormalizedRole, string> = {
  customer: 'Customer',
  driver: 'Driver',
  business_admin: 'Business Admin',
  business_staff: 'Business Staff',
  app_admin: 'App Admin',
};

export const ROLE_ACCENT: Record<NormalizedRole, 'lava' | 'success' | 'default'> = {
  customer: 'default',
  driver: 'lava',
  business_admin: 'success',
  business_staff: 'success',
  app_admin: 'lava',
};