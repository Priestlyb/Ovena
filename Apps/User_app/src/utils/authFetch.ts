import { useAuth } from "@/context/AuthContext";

export const useAuthFetch = () => {
  const { getValidAccessToken, logout } = useAuth();

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = await getValidAccessToken();

    if (!token) {
      await logout();
      throw new Error("Unauthorized");
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      await logout();
      throw new Error("Session expired");
    }

    return res;
  };

  return authFetch;
};
