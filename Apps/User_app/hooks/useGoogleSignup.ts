import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const REGISTER_URL =
  "https://ovena-backend-production.up.railway.app/api/accounts/register-user/";

export const useGoogleSignup = () => {
  const { loginWithOAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  const formatPhone = (phone: string) => {
    if (phone.startsWith("0")) return "+234" + phone.slice(1);
    if (!phone.startsWith("+234")) return "+234" + phone;
    return phone;
  };

  interface SignupParams {
    phoneNumber: string;
    birthDate: string;
    lat: number;
    long: number;
    referralCode?: string;
    accessToken: string;
  }

  const submitSignup = async (params: SignupParams) => {
    try {
      setLoading(true);

      const payload = {
        phone_number: formatPhone(params.phoneNumber),
        birth_date: params.birthDate,
        lat: params.lat,
        long: params.long,
        referral_code: params.referralCode || "",
      };

      console.log("SIGNUP PAYLOAD:", payload);

      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${params.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("SIGNUP RESPONSE:", data);

      const { access, refresh } = data;

      await loginWithOAuth("google", access, refresh, false);
    } catch (err) {
      console.log("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { submitSignup, loading };
};