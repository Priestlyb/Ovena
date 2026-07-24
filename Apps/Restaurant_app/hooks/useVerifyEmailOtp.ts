import axios from "axios";
import { useState } from "react";

import api from "@/services/apiClient";

type VerifyEmailOtpPayload = {
    email: string;
    otp_code: string;
};

type VerifyEmailOtpResponse = {
    message?: string;
    detail?: string;
};

export const useVerifyEmailOtp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const verifyEmailOtp = async (
        payload: VerifyEmailOtpPayload
    ): Promise<VerifyEmailOtpResponse> => {
        try {
            setLoading(true);
            setError(null);

            console.log("📧 VERIFY EMAIL OTP");
            console.log("Payload:", payload);

            const response =
                await api.post<VerifyEmailOtpResponse>(
                    "/business/verify/email/",
                    payload
                );

            console.log(
                "✅ Email OTP Verified:",
                response.data
            );

            return response.data;
        } catch (err) {
            let message =
                "Failed to verify email OTP";

            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ||
                    err.response?.data?.detail ||
                    err.message;
            }

            console.error(
                "❌ Verify Email OTP Error:",
                message
            );

            setError(message);

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        verifyEmailOtp,
        loading,
        error,
    };
};