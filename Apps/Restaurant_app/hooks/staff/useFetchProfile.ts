import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import api from "@/services/apiClient";

export interface UserProfile {
    // Staff
    staff_id?: number;
    name?: string;
    phone_number?: string;
    email?: string | null;
    role?: string;
    device_name?: string;
    is_active?: boolean;
    revoked?: boolean;
    created_at?: string;

    // Branch
    branch_id?: number;
    branch_name?: string;
    branch_address?: string;
    business_id?: number;

    average_prep_time?: number;
    avg_rating?: number;
    rating_count?: number;
    rating_sum?: number;

    delivery_method?: string;
    is_accepting_orders?: boolean;
}

const PROFILE_CACHE_PREFIX = "profile_cache";

export default function useFetchProfile(
    profileType: string = "businessstaff"
) {
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile>({});

    useEffect(() => {
        let mounted = true;

        const cacheKey = `${PROFILE_CACHE_PREFIX}_${profileType}`;

        const fetchProfile = async () => {
            try {
                // Load cache first
                const cached = await AsyncStorage.getItem(cacheKey);

                if (cached && mounted) {
                    setUserProfile(JSON.parse(cached));
                    setLoadingProfile(false);
                }

                const response = await api.get("/accounts/profile/", {
                    params: {
                        profile_type: profileType,
                    },
                });

                const data = response.data;

                //console.log("[PROFILE FRESH]", data);

                const branch = data.profile?.branch ?? {};
                const profile = data.profile ?? {};
                const user = data.user ?? {};

                const freshProfile: UserProfile = {
                    staff_id: profile.id,
                    name: profile.name,
                    phone_number: user.phone_number,
                    email: user.email,
                    role: data.roles?.[0],

                    device_name: profile.device_name,
                    is_active: profile.is_active,
                    revoked: profile.revoked,
                    created_at: profile.created_at,

                    branch_id: branch.id,
                    branch_name: branch.name,
                    branch_address: branch.address,
                    business_id: branch.business,

                    average_prep_time: branch.average_prep_time,
                    avg_rating: branch.avg_rating,
                    rating_count: branch.rating_count,
                    rating_sum: branch.rating_sum,

                    delivery_method: branch.delivery_method,
                    is_accepting_orders: branch.is_accepting_orders,
                };

                if (!mounted) return;

                setUserProfile(freshProfile);

                await AsyncStorage.setItem(
                    cacheKey,
                    JSON.stringify(freshProfile)
                );
            } catch (error) {
                console.error("Profile fetch error:", error);

                const cached = await AsyncStorage.getItem(cacheKey);

                if (!cached) {
                    Alert.alert(
                        "Error",
                        "Could not load profile. Please try again later."
                    );
                }
            } finally {
                if (mounted) {
                    setLoadingProfile(false);
                }
            }
        };

        fetchProfile();

        return () => {
            mounted = false;
        };
    }, [profileType]);

    return {
        loadingProfile,
        userProfile,
    };
}