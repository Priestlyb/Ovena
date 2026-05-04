// services/apiClient.ts
import { useOnboardingStore } from "@/stores/onboardingStore";
import {
  clearAuth,
  getAccessToken,
  getRefreshToken,
  saveAuth,
} from "@/utils/authStorage";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL as string;

if (!BASE_URL) throw new Error("❌ EXPO_PUBLIC_API_URL is not defined");

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
  skipLogoutBlock?: boolean; // ✅ NEW FLAG
};

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
// REQUEST INTERCEPTOR (FIXED)
// ----------------------
api.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    try {
      // ✅ Allow certain requests to bypass logout block
      if (isLoggingOutGlobal && !config.skipLogoutBlock) {
        console.warn("[API] 🚫 Blocked request:", config.url);
        return Promise.reject(new Error("Logout in progress"));
      }

      const publicEndpoints = [
        "/accounts/send-otp/",
        "/accounts/verify-otp/",
        "/accounts/refresh/",
        "/accounts/onboard/admin/",
        "/accounts/admin-login/",
        "/accounts/vendor-login/",
        "/accounts/linked/approval/",
      ];

      const isPublic = publicEndpoints.some((url) =>
        config.url?.includes(url)
      );

      const token = await getAccessToken();

      if (token && !isPublic) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(
        "[API] Request:",
        config.url,
        "| Token:",
        token || "⏳ none"
      );
    } catch (err) {
      console.warn("[API] Token attach failed:", err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------
// RESPONSE INTERCEPTOR
// ----------------------
let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest =
      error.config as CustomAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    if (isLoggingOutGlobal && !originalRequest.skipLogoutBlock) {
      console.warn("[API] 🚫 Skipping response handling (logout)");
      return Promise.reject(error);
    }

    // ----------------------
    // 401 → try refresh token
    // ----------------------
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/accounts/refresh/")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          console.warn("[API] ❌ No refresh token — skipping refresh");
          return Promise.reject(error);
        }

        console.log("[API] 🔄 Refreshing token...");

        const response = await axios.post<{ access: string }>(
          `${BASE_URL}/accounts/refresh/`,
          { refresh: refreshToken },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const newAccess = response.data.access;

        if (!newAccess) {
          throw new Error("No access token returned");
        }

        await saveAuth(newAccess, refreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

        console.log("[API] ✅ Token refreshed");

        processQueue(null, newAccess);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        console.warn("[API] ❌ Refresh failed — clearing auth");

        await clearAuth();
        useOnboardingStore.getState().reset();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response.status === 401 && originalRequest._retry) {
      console.warn("[API] ❌ Retry already attempted — rejecting");
    }

    return Promise.reject(error);
  }
);

export default api;