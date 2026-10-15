import { useCallback, useState } from "react";
import {
    generateReferralLink,
    GenerateLinkResponse,
} from "@/services/referralService";

type ReferralData = {
    code: string;
    referral_link: string;
};

export const useGenerateReferralLink = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ReferralData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generateLink = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const res: GenerateLinkResponse = await generateReferralLink();

            const normalized: ReferralData = {
                code: res.referral_code,
                referral_link: res.generated_link,
            };

            setData(normalized);
            return normalized;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to generate referral link";

            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        generateLink,
        loading,
        data,
        error,
    };
};