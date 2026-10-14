/**
 * services/authApi.ts
 *
 * Thin fetch wrapper around the real Ovena Admin auth endpoint.
 *
 * Endpoint:  POST /api/admin/login
 * Payload:   { phone_number: string, password: string }
 * Response:  { access: string, refresh: string }   ← flat, no nested user,
 *            no expires_in — matches the driverLogin() convention used
 *            elsewhere in this codebase (services/signupApi.ts).
 *
 * Previous version of this file assumed a response shape with
 * access_token / refresh_token / expires_in / a nested user object.
 * The real backend doesn't return any of that on login — it only
 * returns the two raw JWTs. That mismatch meant `raw.access_token`
 * was always undefined, which threw inside the success path and surfaced
 * as a generic "unable to sign in" error even though the server had
 * returned 200 with a perfectly valid body (confirmed working in Postman).
 *
 * This rewrite also adopts the same raw-text-first parsing + console
 * logging pattern already used by signupApi.ts in this project, so a
 * non-JSON response body fails with a readable message instead of an
 * opaque JSON.parse crash, and every request/response is visible in the
 * Metro log while debugging.
 *
 * Since the login response has no user profile, fetchCurrentUser() below
 * is what populates the AdminUser shown in the app — it's called once
 * immediately after a successful login and again on every cold start
 * during session rehydration.
 */

import { AdminUser, AuthTokens, LoginCredentials, LoginResponse } from '../types/auth';

const BASE_URL = 'https://ovena-backend-production.up.railway.app';

class AuthApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'AuthApiError';
  }
}

// ── Shared fetch helper — mirrors putJSON's raw-text-first parsing ───────────
async function postJSON<T>(endpoint: string, body: object, token?: string): Promise<T> {
  console.log('🌐 POST →', endpoint);
  console.log('📤 Payload:', JSON.stringify(body, null, 2));

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const rawText = await res.text();
  console.log(`📥 Raw response (${res.status}):`, rawText.slice(0, 500));

  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error('❌ Non-JSON response body:', rawText);
    throw new AuthApiError(
      `Server returned a non-JSON response (HTTP ${res.status}).`,
      res.status,
    );
  }

  if (!res.ok) {
    console.error('❌ Backend error response:', JSON.stringify(data, null, 2));
    const message =
      data?.message || data?.detail || JSON.stringify(data) || `Request failed: ${res.status}`;
    throw new AuthApiError(message, res.status);
  }

  console.log('✅ Response:', JSON.stringify(data, null, 2));
  return data as T;
}

async function getJSON<T>(endpoint: string, token: string): Promise<T> {
  console.log('🌐 GET →', endpoint);

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const rawText = await res.text();
  console.log(`📥 Raw response (${res.status}):`, rawText.slice(0, 500));

  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error('❌ Non-JSON response body:', rawText);
    throw new AuthApiError(
      `Server returned a non-JSON response (HTTP ${res.status}).`,
      res.status,
    );
  }

  if (!res.ok) {
    console.error('❌ Backend error response:', JSON.stringify(data, null, 2));
    const message =
      data?.message || data?.detail || JSON.stringify(data) || `Request failed: ${res.status}`;
    throw new AuthApiError(message, res.status);
  }

  console.log('✅ Response:', JSON.stringify(data, null, 2));
  return data as T;
}

// ── Wire shape — exactly what /api/admin/login actually returns ──────────────
interface LoginWireResponse {
  access:  string;
  refresh: string;
}

// JWT access tokens carry their own expiry in the payload (exp claim, in
// seconds since epoch). We decode that locally instead of trusting a
// separate "expires_in" field the backend doesn't send.
function decodeJwtExpiry(token: string): number {
  try {
    const payloadB64 = token.split('.')[1];
    const base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const binary = typeof atob === 'function' ? atob(padded) : '';
    const decoded = decodeURIComponent(
      Array.from(binary, (char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''),
    );
    const json = JSON.parse(decoded);
    if (typeof json.exp === 'number') {
      return json.exp * 1000;
    }
  } catch {
    // fall through to default below
  }
  return Date.now() + 60 * 60 * 1000;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const raw = await postJSON<LoginWireResponse>('/api/admin/login/', {
    phone_number: credentials.phone,
    password:     credentials.password,
  });

  if (!raw.access || !raw.refresh) {
    console.error('❌ Login response is missing token(s). Raw response:', JSON.stringify(raw, null, 2));
    throw new AuthApiError('Login succeeded but no tokens were returned.', 200);
  }

  // ── Explicit token log — easy to spot/copy out of the Metro console ───────
  console.log('🔑🔑🔑 TOKENS RECEIVED FROM /api/admin/login/ 🔑🔑🔑');
  console.log('  ACCESS TOKEN: ', raw.access);
  console.log('  REFRESH TOKEN:', raw.refresh);
  console.log('🔑🔑🔑─────────────────────────────────────────🔑🔑🔑');

  const tokens: AuthTokens = {
    accessToken:  raw.access,
    refreshToken: raw.refresh,
    expiresAt:    decodeJwtExpiry(raw.access),
  };

  console.log(
    '  ⏱️ Decoded access token expiry:',
    new Date(tokens.expiresAt).toISOString(),
  );

  // The login response itself has no user profile. Try to fetch it, but
  // don't let a missing/unconfirmed /api/admin/me endpoint block a
  // successful login — fall back to a minimal profile built from the
  // phone number that was just used to sign in.
  let user: AdminUser;
  try {
    user = await fetchCurrentUser(tokens.accessToken);
  } catch (err) {
    console.warn(
      '⚠️ Login succeeded but fetching the user profile failed — using a minimal fallback profile. ' +
      'If /api/admin/me is not the correct endpoint, update fetchCurrentUser() in services/authApi.ts.',
      (err as Error).message,
    );
    user = {
      id:           credentials.phone,
      name:         'Admin',
      email:        '',
      phone:        credentials.phone,
      role:         'Administrator',
      twoFAEnabled: false,
    };
  }

  return { user, tokens };
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const raw = await postJSON<LoginWireResponse>('/api/admin/refresh/', {
    refresh: refreshToken,
  });

  if (!raw.access) {
    console.error('❌ Refresh response is missing access token. Raw response:', JSON.stringify(raw, null, 2));
    throw new AuthApiError('Token refresh succeeded but no access token was returned.', 200);
  }

  const nextRefresh = raw.refresh ?? refreshToken; // some backends don't rotate refresh tokens

  // ── Explicit token log — easy to spot/copy out of the Metro console ───────
  console.log('🔑🔑🔑 TOKENS RECEIVED FROM /api/admin/refresh 🔑🔑🔑');
  console.log('  ACCESS TOKEN: ', raw.access);
  console.log('  REFRESH TOKEN:', nextRefresh, raw.refresh ? '' : '(unchanged — backend did not rotate it)');
  console.log('🔑🔑🔑──────────────────────────────────────────🔑🔑🔑');

  const tokens: AuthTokens = {
    accessToken:  raw.access,
    refreshToken: nextRefresh,
    expiresAt:    decodeJwtExpiry(raw.access),
  };

  console.log(
    '  ⏱️ Decoded access token expiry:',
    new Date(tokens.expiresAt).toISOString(),
  );

  return tokens;
}


// ── Wire shape for the user profile endpoint ──────────────────────────────────
// Adjust field names here if /api/admin/me returns different keys —
// this is the only place that needs to change.
interface UserProfileWireResponse {
  id:               string;
  name?:            string;
  first_name?:      string;
  last_name?:       string;
  email:            string;
  phone_number:     string;
  role?:            string;
  avatar_url?:      string;
  two_fa_enabled?:  boolean;
}

function mapUserProfile(raw: UserProfileWireResponse): AdminUser {
  const name = raw.name
    ?? ([raw.first_name, raw.last_name].filter(Boolean).join(' ').trim()
    || 'Admin');

  return {
    id:           raw.id,
    name,
    email:        raw.email,
    phone:        raw.phone_number,
    role:         raw.role ?? 'Administrator',
    avatarUri:    raw.avatar_url,
    twoFAEnabled: raw.two_fa_enabled ?? false,
  };
}

export async function fetchCurrentUser(accessToken: string): Promise<AdminUser> {
  const raw = await getJSON<UserProfileWireResponse>('/api/admin/profile/', accessToken);
  return mapUserProfile(raw);
}

export async function logout(accessToken: string): Promise<void> {
  // Best-effort — don't throw if the server-side logout fails;
  // the client clears its local session regardless.
  try {
    await postJSON('/api/admin/logout/', {}, accessToken);
  } catch {
    // Network errors on logout are non-fatal
  }
}

export { AuthApiError };