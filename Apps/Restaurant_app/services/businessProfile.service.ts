// services/businessProfile.service.ts

import apiClient from "@/services/apiClient";

export const fetchBusinessProfile = async () => {
    const response = await apiClient.get("/accounts/profile/", {
        params: {
            profile_type: "businessadmin",
        },
    });

    return {
        name: response.data.profile?.name,
        email: response.data.user?.email,
        phone_number: response.data.user?.phone_number,
        business_image: response.data.profile?.business_image,
        business_logo: response.data.profile?.business_logo,
    };
};