const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

export type GoogleSignupPayload = {
  provider: "google";
  id_token: string;
  referral_code?: string;
  lat: number;
  long: number;
  phone_number: string;
  birth_date: string;
};

export const exchangeGoogleOAuth = async (payload: GoogleSignupPayload) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${BASE_URL}/accounts/oauth/exchange/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await res.json();

    if (!res.ok) {
      const message =
        data?.phone_number?.[0] ||
        data?.email?.[0] ||
        data?.detail ||
        data?.non_field_errors?.[0] ||
        "Signup failed";

      throw new Error(message);
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
};