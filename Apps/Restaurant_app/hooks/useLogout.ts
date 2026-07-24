// hooks/useLogout.ts

import { useRouter } from "expo-router";
import { useState } from "react";

import { useAuthStore } from "@/stores/authStore";
import { clearAuth, getRefreshToken } from "@/utils/authStorage";

let isLoggingOutGlobal = false;

export const useLogout = () => {
    const router = useRouter();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logout = async () => {
        if (isLoggingOut || isLoggingOutGlobal) return;

        try {
            setIsLoggingOut(true);
            isLoggingOutGlobal = true;

            console.log("Logging out safely...");

            const refreshToken = await getRefreshToken();

            if (refreshToken) {
                try {
                    await fetch(
                        `${process.env.EXPO_PUBLIC_API_URL}/accounts/logout/`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                refresh: refreshToken,
                            }),
                        },
                    );

                    console.log("Server logout successful");
                } catch {
                    console.warn("Server logout failed (ignored)");
                }
            }

            await clearAuth();

            const { bumpVersion } = useAuthStore.getState();

            bumpVersion();

            router.replace("/screens/Loginpage");
        } catch (err: any) {
            console.log("Logout failed:", err.message);
        } finally {
            setIsLoggingOut(false);
            isLoggingOutGlobal = false;
        }
    };

    return {
        logout,
        isLoggingOut,
    };
};