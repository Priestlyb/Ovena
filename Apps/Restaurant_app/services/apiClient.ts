// services/apiClient.ts

import { getAccessToken } from "@/utils/authStorage";
import axios, { InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL as string;

if (!BASE_URL) {
  throw new Error("❌ EXPO_PUBLIC_API_URL is not defined");
}

// ----------------------
// GLOBAL LOGOUT CONTROL
// ----------------------
let isLoggingOutGlobal = false;

export const setIsLoggingOut = (value: boolean) => {
  isLoggingOutGlobal = value;
};

export const getIsLoggingOut = () => isLoggingOutGlobal;

// ----------------------
// EXTEND AXIOS CONFIG
// ----------------------
type CustomAxiosRequestConfig = InternalAxiosRequestConfig & {
  skipLogoutBlock?: boolean;
};

// ----------------------
// PUBLIC ENDPOINTS
// ----------------------
const PUBLIC_ENDPOINTS = [
  "/accounts/send-otp/",
  "/accounts/verify-otp/",
  "/accounts/refresh/",
  "/accounts/onboard/admin/",
  "/accounts/admin-login/",
  "/accounts/staff-login/",
  "/accounts/vendor-login/",
  "/accounts/linked/approval/",
];

// ----------------------
// AXIOS INSTANCE
// ----------------------
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------
// REQUEST INTERCEPTOR
// ----------------------
api.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    try {
      const isPublic = PUBLIC_ENDPOINTS.some((url) =>
        config.url?.includes(url)
      );

      // Block protected requests only while logout is in progress
      if (
        isLoggingOutGlobal &&
        !config.skipLogoutBlock &&
        !isPublic
      ) {
        console.warn("[API] 🚫 Blocked request:", config.url);
        return Promise.reject(new Error("Logout in progress"));
      }

      const token = await getAccessToken();

      if (token && !isPublic) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(
        "[API] Request:",
        config.url,
        "| Token:",
        token ?? "⏳ none"
      );

      return config;
    } catch (err) {
      console.warn("[API] Token attach failed:", err);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

export default api;