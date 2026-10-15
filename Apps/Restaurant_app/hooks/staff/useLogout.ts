import { useRouter } from "expo-router";
import { useState } from "react";

import api, { setIsLoggingOut as setGlobalLogout } from "@/services/apiClient";

import { clearAuth, getRefreshToken } from "@/utils/authStorage";

export default function useLogout() {
    const router = useRouter();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        try {
            const refreshToken = await getRefreshToken();

            if (refreshToken) {
                await api.post("/accounts/logout/", {
                    refresh: refreshToken,
                });
            }

            // Block any remaining protected requests while we clear auth
            setGlobalLogout(true);

            console.log("✅ Logout successful");
        } catch (error: any) {
            console.warn(
                "Logout error:",
                error?.response?.data || error?.message
            );
        } finally {
            try {
                await clearAuth();
            } catch (clearError) {
                console.warn("Error clearing auth:", clearError);
            }

            // Re-enable API requests for the next login
            setGlobalLogout(false);

            router.replace("/");

            setIsLoggingOut(false);
        }
    };

    return {
        logout,
        isLoggingOut,
    };
}