/**
 * services/passwordResetApi.ts
 *
 * Handles the driver-facing password reset flow, plus the general-purpose
 * email OTP verification pair (send-email-otp / verify-email-otp) — the
 * latter isn't yet wired into any screen since no current flow (signup,
 * account settings) calls for standalone email verification, but the
 * functions are here ready to use once one does.
 *
 * Endpoints:
 *   POST /api/accounts/password-reset/send/     { email }
 *   POST /api/accounts/password-reset/          { email, new_password, otp_code }
 *   POST /api/accounts/send-email-otp/           { email }
 *   POST /api/accounts/verify-email-otp/         { otp_code, email }
 *
 * Same raw-text-first parsing + emoji-tagged console logging convention as
 * authApi.ts / signupApi.ts, so Metro logs read consistently across files.
 */

const BASE_URL = 'https://ovena-backend-production.up.railway.app';
const LOG_TAG  = '[passwordResetApi]';

class PasswordResetApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'PasswordResetApiError';
  }
}

// ── Shared raw-text-first POST helper ───────────────────────────────────────
async function postJSON<T>(endpoint: string, body: object): Promise<T> {
  console.log(`${LOG_TAG} 🌐 POST →`, endpoint);

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const rawText = await res.text();
  console.log(`${LOG_TAG} 📥 Raw response (${res.status}) [${endpoint}]:`, rawText.slice(0, 500));

  let data: any;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    console.error(`${LOG_TAG} ❌ Non-JSON response body [${endpoint}]:`, rawText.slice(0, 300));
    throw new PasswordResetApiError(
      `Server returned a non-JSON response (HTTP ${res.status}) for ${endpoint}.`,
      res.status,
    );
  }

  if (!res.ok) {
    console.error(`${LOG_TAG} ❌ Backend error response [${endpoint}]:`, JSON.stringify(data, null, 2));
    const message = data?.message ?? data?.detail ?? `Request failed (${res.status}) for ${endpoint}`;
    throw new PasswordResetApiError(message, res.status);
  }

  console.log(`${LOG_TAG} ✅ Response [${endpoint}]:`, JSON.stringify(data, null, 2));
  return data as T;
}

// ── POST /api/accounts/password-reset/send/ ─────────────────────────────────
// Sends the OTP code to the given email for a password reset.
export async function sendPasswordResetOtp(email: string): Promise<void> {
  await postJSON('/api/accounts/password-reset/send/', { email: email.trim() });
  console.log(`${LOG_TAG} ✅ Password reset OTP sent to`, email);
}

// ── POST /api/accounts/password-reset/ ───────────────────────────────────────
// Verifies the OTP and sets the new password in one step.
export async function resetPassword(params: {
  email: string;
  newPassword: string;
  otpCode: string;
}): Promise<void> {
  await postJSON('/api/accounts/password-reset/', {
    email:        params.email.trim(),
    new_password: params.newPassword,
    otp_code:     params.otpCode.trim(),
  });
  console.log(`${LOG_TAG} ✅ Password reset for`, params.email);
}

// ── POST /api/accounts/send-email-otp/ ───────────────────────────────────────
// General-purpose email verification OTP — not yet wired into any screen.
export async function sendEmailOtp(email: string): Promise<void> {
  await postJSON('/api/accounts/send-email-otp/', { email: email.trim() });
  console.log(`${LOG_TAG} ✅ Email verification OTP sent to`, email);
}

// ── POST /api/accounts/verify-email-otp/ ─────────────────────────────────────
export async function verifyEmailOtp(params: { email: string; otpCode: string }): Promise<void> {
  await postJSON('/api/accounts/verify-email-otp/', {
    otp_code: params.otpCode.trim(),
    email:    params.email.trim(),
  });
  console.log(`${LOG_TAG} ✅ Email verified for`, params.email);
}

export { PasswordResetApiError };