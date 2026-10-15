import api from "./apiClient";

export type GenerateLinkResponse = {
    generated_link: string;
    referral_code: string;
};

export const generateReferralLink = async (): Promise<GenerateLinkResponse> => {
    const response = await api.get("/customer/generate/link/");
    return response.data;
};