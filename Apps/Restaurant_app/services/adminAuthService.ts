// services/adminAuthService.ts

import { OnboardAdminResponse } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./apiClient";

interface SendOtpResponse {
  success: boolean;
  message?: string;
  pin_id: string;
}

/* -----------------------------------------
   SEND OTP
----------------------------------------- */
export const sendOtp = async (
  phone_number: string
): Promise<SendOtpResponse> => {
  try {
    const response = await api.post<SendOtpResponse>(
      "/accounts/send-otp/",
      {
        phone_number,
      }
    );

    console.log("SEND OTP RESPONSE:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("SEND OTP ERROR:", error?.response?.data);

    const data = error?.response?.data;

    let msg = "Failed to send OTP";

    if (typeof data?.detail === "string") {
      msg = data.detail;
    } else if (typeof data?.error === "string") {
      msg = data.error;
    } else if (data && typeof data === "object") {
      const firstValue = Object.values(data)[0];

      if (Array.isArray(firstValue) && firstValue.length > 0) {
        msg = String(firstValue[0]);
      } else if (typeof firstValue === "string") {
        msg = firstValue;
      }
    } else if (error?.message) {
      msg = error.message;
    }

    throw new Error(msg);
  }
};

/* -----------------------------------------
   VERIFY OTP
----------------------------------------- */
type OnboardPayload = {
  full_name: string;
  email: string;
  phone_number: string;
  otp_code: string;
  pin_id: string;
};

export const OnboardingAdmin = async (
  data: OnboardPayload
): Promise<OnboardAdminResponse> => {
  try {
    console.log("ONBOARD REQUEST BODY:", data);

    const response = await api.post<OnboardAdminResponse>(
      "/accounts/onboard/admin/",
      data
    );

    console.log("ONBOARD SUCCESS:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("ONBOARD SERVER ERROR:", error?.response?.data);
    console.log("ONBOARD STATUS:", error?.response?.status);
    console.log("ONBOARD FULL ERROR:", error);

    // Re-throw the original axios error so the screen
    // can access err.response.data
    throw error;
  }
};

/* -----------------------------------------
   LOGOUT
----------------------------------------- */
export const logoutAdmin = async (): Promise<void> => {
  try {
    // Use exact keys from authStorage.ts
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    await AsyncStorage.removeItem("adminData");

    console.log("Admin logged out successfully.");
  } catch (error: any) {
    console.log("Logout Error:", error?.message || error);
    throw new Error("Failed to log out");
  }
};