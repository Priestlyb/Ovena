import axios from "axios";
import { useEffect, useRef, useState } from "react";

import api from "@/services/apiClient";

type SendEmailOtpPayload = {
    email: string;
};

type SendEmailOtpResponse = {
    message?: string;
    detail?: string;
};

const COOLDOWN_SECONDS = 45;

export const useSendEmailOtp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [remainingTime, setRemainingTime] = useState(0);

    const lastRequestTime = useRef<number | null>(null);

    useEffect(() => {
        if (remainingTime <= 0) return;

        const interval = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTime]);

    const sendEmailOtp = async (
        payload: SendEmailOtpPayload
    ): Promise<SendEmailOtpResponse> => {
        const now = Date.now();

        if (lastRequestTime.current) {
            const secondsSinceLastRequest = Math.floor(
                (now - lastRequestTime.current) / 1000
            );

            const remaining =
                COOLDOWN_SECONDS - secondsSinceLastRequest;

            if (remaining > 0) {
                const message = `Please wait ${remaining}s before requesting another OTP.`;

                setError(message);
                setRemainingTime(remaining);

                throw new Error(message);
            }
        }

        try {
            setLoading(true);
            setError(null);

            console.log("📧 SEND EMAIL OTP");
            console.log("Payload:", payload);

            const response = await api.post<SendEmailOtpResponse>(
                "/business/send/email/",
                payload
            );

            console.log("✅ OTP Sent:", response.data);

            lastRequestTime.current = Date.now();
            setRemainingTime(COOLDOWN_SECONDS);

            return response.data;
        } catch (err) {
            let message = "Failed to send email OTP";

            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ||
                    err.response?.data?.detail ||
                    err.message;
            }

            console.error("❌ Send Email OTP Error:", message);
            setError(message);

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        sendEmailOtp,
        loading,
        error,
        remainingTime,
        canResend: remainingTime === 0,
    };
};