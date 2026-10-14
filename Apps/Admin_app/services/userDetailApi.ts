/**
 * services/userDetailApi.ts
 *
 * Fetches full detail for one admin-visible user — GET /api/admin/users/{id}/.
 * ACTIVE, parameterized fetch, so it lives outside appDataApi.ts's passive
 * bootstrap set — same convention as adminUsersApi.ts (raw-text-first
 * parsing, [tag] logs, dedicated error class).
 */

import { UserDetailResponse } from '@/types/userDetail';

const BASE_URL = 'https://ovena-backend-production.up.railway.app';
const LOG_TAG = '[userDetailApi]';

export class UserDetailApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'UserDetailApiError';
  }
}

export async function fetchUserDetail(
  userId: string | number,
  accessToken: string
): Promise<UserDetailResponse> {
  const endpoint = `/api/admin/users/${userId}/`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const rawText = await res.text();

  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error(`${LOG_TAG} ❌ Non-JSON response [${endpoint}]:`, rawText.slice(0, 300));
    throw new UserDetailApiError(
      `Server returned a non-JSON response (HTTP ${res.status}) for ${endpoint}.`,
      res.status
    );
  }

  if (!res.ok) {
    console.error(`${LOG_TAG} ❌ Backend error [${endpoint}]:`, JSON.stringify(data, null, 2));
    const message = data?.message ?? data?.detail ?? `Request failed (${res.status}) for ${endpoint}`;
    throw new UserDetailApiError(message, res.status);
  }

  console.log(`${LOG_TAG} ✅ Loaded detail for user ${userId} — profiles:`, data?.profiles);

  return data as UserDetailResponse;
}