import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";

const AUTH_KEY = "auth_state";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL as string;

if (!BASE_URL) {
  throw new Error("❌ EXPO_PUBLIC_API_URL is not defined");
}

/**
 * Change this only if your backend uses a different refresh endpoint.
 */
const REFRESH_URL = "/accounts/token/refresh/";

/**
 * Used by AuthContext to be notified when the refresh token
 * is no longer valid and the user must be logged out.
 */
type AuthFailureHandler = () => void;

let authFailureHandler: AuthFailureHandler | null = null;

/**
 * AuthContext registers this callback when it mounts.
 */
export const registerAuthFailureHandler = (
  handler: AuthFailureHandler | null,
) => {
  authFailureHandler = handler;
};

/* =========================================
   AXIOS INSTANCE
========================================= */

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/* =========================================
   REFRESH STATE
========================================= */

/**
 * Prevents multiple simultaneous refresh requests.
 *
 * Example:
 *
 * Request A → 401
 * Request B → 401
 * Request C → 401
 *
 * Only ONE refresh request will be sent.
 *
 * A, B and C will wait for the same promise.
 */
let refreshPromise: Promise<string | null> | null = null;

/**
 * Prevent infinite refresh loops.
 */
const isRefreshRequest = (config?: AxiosRequestConfig) => {
  return config?.url === REFRESH_URL;
};

/* =========================================
   AUTH HELPERS
========================================= */

type StoredAuth = {
  accessToken: string | null;
  refreshToken: string | null;
  authMethod?: "otp" | "google" | "apple" | null;
  isNewUser?: boolean;
};

const getStoredAuth = async (): Promise<StoredAuth | null> => {
  try {
    const stored = await SecureStore.getItemAsync(AUTH_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.log("[AUTH] Failed to read stored auth:", error);
    return null;
  }
};

const saveStoredAuth = async (auth: StoredAuth) => {
  await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(auth));
};

const clearStoredAuth = async () => {
  await SecureStore.deleteItemAsync(AUTH_KEY);
};

/* =========================================
   REFRESH ACCESS TOKEN
========================================= */

export const refreshAccessToken = async (): Promise<string | null> => {
  /**
   * If another request is already refreshing the token,
   * wait for that refresh instead of creating another one.
   */
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const stored = await getStoredAuth();

      if (!stored?.refreshToken) {
        console.log("[AUTH] No refresh token available");

        await clearStoredAuth();

        authFailureHandler?.();

        return null;
      }

      if (__DEV__) {
        console.log("[AUTH] 🔄 Refreshing access token...");
      }

      /**
       * IMPORTANT:
       *
       * We use axios directly here instead of `api.post()`.
       *
       * That prevents this refresh request from going through
       * the response interceptor and accidentally triggering
       * another refresh.
       */
      const response = await axios.post(
        `${BASE_URL}${REFRESH_URL}`,
        {
          refresh: stored.refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000,
        },
      );

      /**
       * Django SimpleJWT normally returns:
       *
       * {
       *   access: "new-access-token"
       * }
       *
       * If refresh rotation is enabled, it may also return:
       *
       * {
       *   access: "...",
       *   refresh: "..."
       * }
       */
      const newAccessToken = response.data?.access;

      if (!newAccessToken) {
        throw new Error("Refresh response did not contain an access token");
      }

      const newRefreshToken =
        response.data?.refresh ?? stored.refreshToken;

      const updatedAuth: StoredAuth = {
        ...stored,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };

      await saveStoredAuth(updatedAuth);

      if (__DEV__) {
        console.log("[AUTH] ✅ Access token refreshed successfully");
      }

      return newAccessToken;
    } catch (error) {
      if (__DEV__) {
        const axiosError = error as AxiosError;

        console.log(
          "[AUTH] ❌ Access token refresh failed:",
          axiosError.response?.data || axiosError.message,
        );
      }

      /**
       * The refresh token is no longer usable.
       *
       * Clear local authentication.
       */
      await clearStoredAuth();

      /**
       * Tell AuthContext to update:
       *
       * authenticated → unauthenticated
       */
      authFailureHandler?.();

      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/* =========================================
   REQUEST INTERCEPTOR
========================================= */

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const stored = await getStoredAuth();

      if (stored?.accessToken) {
        config.headers = config.headers ?? {};

        config.headers.Authorization = `Bearer ${stored.accessToken}`;

        if (__DEV__) {
          // console.log(
          //   "[API] Authorization header attached",
          // );
        }
      }

      return config;
    } catch (error) {
      console.log(
        "❌ [API REQUEST INTERCEPTOR ERROR]:",
        error,
      );

      return config;
    }
  },
  (error) => {
    console.log("[API REQUEST ERROR]:", error);

    return Promise.reject(error);
  },
);

/* =========================================
   RESPONSE INTERCEPTOR
========================================= */

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest =
      error.config as (InternalAxiosRequestConfig & {
        _retry?: boolean;
      }) | null;

    const status = error.response?.status;

    if (__DEV__) {
      console.log(
        "[API RESPONSE ERROR]",
        error.response?.data || error.message,
      );
    }

    /**
     * Only handle 401 Unauthorized.
     */
    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    /**
     * Never try to refresh the refresh-token endpoint itself.
     */
    if (isRefreshRequest(originalRequest)) {
      return Promise.reject(error);
    }

    /**
     * Prevent the same request from being retried repeatedly.
     */
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (__DEV__) {
        console.log(
          "[AUTH] ⚠️ Access token rejected with 401",
        );
      }

      const newAccessToken = await refreshAccessToken();

      /**
       * Refresh failed.
       *
       * refreshAccessToken() already cleared auth and notified
       * AuthContext.
       */
      if (!newAccessToken) {
        return Promise.reject(error);
      }

      /**
       * Attach the new access token to the failed request.
       */
      originalRequest.headers =
        originalRequest.headers ?? {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      if (__DEV__) {
        console.log(
          "[AUTH] 🔁 Retrying request with new access token",
        );
      }

      /**
       * Retry the original request.
       */
      return api(originalRequest);
    } catch (refreshError) {
      if (__DEV__) {
        console.log(
          "[AUTH] ❌ Failed to refresh/retry request:",
          refreshError,
        );
      }

      return Promise.reject(refreshError);
    }
  },
);

export default api;