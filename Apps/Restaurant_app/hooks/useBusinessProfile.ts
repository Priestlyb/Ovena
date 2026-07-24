import { fetchBusinessProfile } from "@/services/businessProfile.service";
import { useQuery } from "@tanstack/react-query";

export interface BusinessProfile {
    name?: string;
    email?: string;
    phone_number?: string;
    business_logo?: string;
    business_image?: string;
}

export const BUSINESS_PROFILE_QUERY_KEY = ["business-profile"];

export const useBusinessProfile = () => {
    const query = useQuery<BusinessProfile>({
        queryKey: BUSINESS_PROFILE_QUERY_KEY,
        queryFn: fetchBusinessProfile,
    });

    return {
        profile: query.data ?? ({} as BusinessProfile),
        profileLoading: query.isLoading,
        refreshProfile: query.refetch,
    };
};