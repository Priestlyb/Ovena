import { getAccessToken } from "@/utils/authStorage";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export const useAuthRedirect = () => {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await getAccessToken();
            if (token) {
                router.replace("/screens/staffs/staffTabs");
            }
        };

        checkAuth();
    }, []);
};