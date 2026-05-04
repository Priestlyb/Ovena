// services/adminAuthService.ts

import api from "./apiClient";
import { OnboardAdminResponse } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SendOtpResponse {
  success: boolean;
  message?: string;
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

    const msg =
      error?.response?.data?.detail ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to send OTP";

    throw new Error(msg);
  }
};

/* -----------------------------------------
   ONBOARD ADMIN (VERIFY OTP + LOGIN)
----------------------------------------- */
type OnboardPayload = {
  full_name: string;
  email: string;
  phone_number: string; 
  otp_code: string;
};

export const OnboardingAdmin = async (
  data: OnboardPayload
): Promise<OnboardAdminResponse> => {
  try {
    const response = await api.post<OnboardAdminResponse>(
      "/accounts/onboard/admin/",
      data
    );

    console.log("ONBOARD SUCCESS:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("ONBOARD SERVER ERROR:", error?.response?.data);

    const msg =
      error?.response?.data?.detail ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to onboard admin";

    throw new Error(msg);
  }
};

/* -----------------------------------------
   LOGOUT
----------------------------------------- */
export const logoutAdmin = async (): Promise<void> => {
  try {
    // Use exact keys from authStorage.ts
    await AsyncStorage.removeItem("access_token"); // must match getAccessToken()
    await AsyncStorage.removeItem("refresh_token");
    await AsyncStorage.removeItem("adminData"); // optional, if you store user info

    console.log("Admin logged out successfully.");
  } catch (error: any) {
    console.log("Logout Error:", error?.message || error);
    throw new Error("Failed to log out");
  }
};