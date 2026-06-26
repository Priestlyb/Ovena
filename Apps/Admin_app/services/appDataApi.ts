/**
 * services/appDataApi.ts
 *
 * Fetches the aggregated dashboard payload in a single request.
 * Real backends typically expose this as a "bootstrap" or "dashboard"
 * endpoint so the client doesn't have to make 4-5 separate calls on
 * every cold start.
 *
 * Uses the same raw-text-first parsing + console logging convention as
 * services/authApi.ts and services/signupApi.ts — every request logs its
 * URL, every response logs its raw body and status before any JSON
 * parsing happens, so a malformed or unexpected response is visible in
 * the Metro log immediately instead of surfacing as an opaque error.
 */

import { AllAppData } from '../types/appData';

const BASE_URL = 'https://ovena-backend-production.up.railway.app';

class AppDataApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'AppDataApiError';
  }
}

export async function fetchAllAppData(accessToken: string): Promise<AllAppData> {
  const endpoint = '/admin/dashboard';
  console.log('🌐 GET →', endpoint);

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const rawText = await res.text();
  console.log(`📥 Raw response (${res.status}):`, rawText.slice(0, 500));

  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error('❌ Non-JSON response body:', rawText);
    throw new AppDataApiError(
      `Server returned a non-JSON response (HTTP ${res.status}).`,
      res.status,
    );
  }

  if (!res.ok) {
    console.error('❌ Backend error response:', JSON.stringify(data, null, 2));
    const message = data?.message ?? data?.detail ?? `Failed to load dashboard data (${res.status})`;
    throw new AppDataApiError(message, res.status);
  }

  console.log('✅ Dashboard data loaded:', JSON.stringify(data, null, 2));
  return data as AllAppData;
}

export { AppDataApiError };
export type { AllAppData };