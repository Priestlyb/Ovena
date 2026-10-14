/**
 * services/adminUsersApi.ts
 *
 * Paginated fetch for GET /api/admin/users/ — an ACTIVE, parameterized
 * request (takes offset/limit at call time), so it lives outside
 * appDataApi.ts's passive bootstrap set, alongside userDetailApi.ts under
 * the same conventions (raw-text-first parsing, [tag] console logs,
 * dedicated error class).
 */

import { AdminAppUser, PaginatedResponse } from '@/types/appData';

const BASE_URL = 'https://ovena-backend-production.up.railway.app';
const LOG_TAG = '[adminUsersApi]';
const PAGE_SIZE = 20;

export class AdminUsersApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'AdminUsersApiError';
  }
}

export async function fetchAdminUsers(
  offset: number,
  accessToken: string,
  limit: number = PAGE_SIZE
): Promise<PaginatedResponse<AdminAppUser>> {
  const endpoint = `/api/admin/users/?limit=${limit}&offset=${offset}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const rawText = await res.text();

  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error(`${LOG_TAG} ❌ Non-JSON response [${endpoint}]:`, rawText.slice(0, 300));
    throw new AdminUsersApiError(
      `Server returned a non-JSON response (HTTP ${res.status}) for ${endpoint}.`,
      res.status
    );
  }

  if (!res.ok) {
    console.error(`${LOG_TAG} ❌ Backend error [${endpoint}]:`, JSON.stringify(data, null, 2));
    const message = data?.message ?? data?.detail ?? `Request failed (${res.status}) for ${endpoint}`;
    throw new AdminUsersApiError(message, res.status);
  }

  return data as PaginatedResponse<AdminAppUser>;
}

export { PAGE_SIZE as ADMIN_USERS_PAGE_SIZE };