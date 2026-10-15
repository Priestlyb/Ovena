import { useState } from "react";
import Toast from "react-native-toast-message";
import { is18Plus } from "@/src/utils/date";

const BASE_URL =
  "https://ovena-backend-production.up.railway.app/api";

type Props = {
  accessToken: string | null;
  completeOtpSignup: () => Promise<void>;
  logout: () => Promise<void>;

  fullName: string;
  email: string;
  referral: string;

  address: string;
  isPickingUpFood: boolean;

  latitude: number | null;
  longitude: number | null;

  day: number;
  month: number;
  year: number;
};

export const useOtpSignup = ({
  accessToken,
  completeOtpSignup,
  logout,
  fullName,
  email,
  referral,
  address,
  isPickingUpFood,
  latitude,
  longitude,
  day,
  month,
  year,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      if (!accessToken) {
        await logout();
        return;
      }

      if (!fullName.trim()) {
        throw new Error("Full name is required");
      }

      if (!email.trim()) {
        throw new Error("Email is required");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        throw new Error("Enter a valid email");
      }

      if (latitude === null || longitude === null) {
        throw new Error("Location is required");
      }

      const dob = new Date(year, month, day);

      if (!is18Plus(dob)) {
        throw new Error("You must be 18+");
      }

      setLoading(true);

      const payload = {
        name: fullName.trim(),
        email: email.trim(),
        lat: latitude,
        long: longitude,
        address:address.trim(),
        referral_code: referral.trim(),
        is_picking_up_food: isPickingUpFood,
        birth_date: dob.toISOString().split("T")[0],
      };

      console.log("REGISTER PAYLOAD");
      console.log(JSON.stringify(payload, null, 2));

      const res = await fetch(
        `${BASE_URL}/accounts/register-user/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        const firstField = Object.keys(data)[0];

        let errorMsg = "Signup failed";

        if (Array.isArray(data[firstField])) {
          errorMsg = data[firstField][0];
        } else if (typeof data[firstField] === "string") {
          errorMsg = data[firstField];
        }

        throw new Error(errorMsg);
      }

      await completeOtpSignup();

      Toast.show({
        type: "success",
        text1: "Signup Successful",
        text2: "Welcome aboard!",
        position: "top",
      });
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Signup Error",
        text2: e.message,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submit,
  };
};