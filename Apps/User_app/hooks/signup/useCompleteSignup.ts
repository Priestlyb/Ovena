import { useState } from "react";
import Toast from "react-native-toast-message";

import {
    formatBirthDate,
    formatPhone,
    trimOptional,
    validatePhone,
} from "@/src/utils/signup";

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

type CompleteSignupParams = {
    accessToken: string;

    fullName?: string;
    address?: string;
    phoneNumber: string;
    referral?: string;

    latitude: number | null;
    longitude: number | null;

    day: number;
    month: number;
    year: number;

    onSuccess: () => Promise<void> | void;
};

export function useCompleteSignup({
    accessToken,

    fullName,
    address,
    phoneNumber,
    referral,

    latitude,
    longitude,

    day,
    month,
    year,

    onSuccess,
}: CompleteSignupParams) {
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (loading) return;

        try {
            if (!accessToken) {
                throw new Error("Authentication session expired");
            }

            const validation = validatePhone(phoneNumber);

            if (!validation.valid) {
                throw new Error(validation.message);
            }

            if (!fullName?.trim()) {
                throw new Error("Full name is required");
            }

            if (!address?.trim()) {
                throw new Error("Address is required");
            }

            if (latitude == null || longitude == null) {
                throw new Error("Unable to determine your location");
            }

            const payload = {
                full_name: trimOptional(fullName),
                address: trimOptional(address),
                phone_number: formatPhone(phoneNumber),

                birth_date: formatBirthDate(
                    year,
                    month,
                    day
                ),

                referral_code: trimOptional(referral),

                lat: latitude,
                long: longitude,
            };

            console.log("[COMPLETE SIGNUP PAYLOAD]");
            console.log(payload);

            setLoading(true);

            const controller = new AbortController();

            const timeout = setTimeout(() => {
                controller.abort();
            }, 15000);

            const response = await fetch(
                `${BASE_URL}/accounts/register-user/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal,
                }
            );

            clearTimeout(timeout);

            const data = await response.json();

            console.log("[COMPLETE SIGNUP RESPONSE]");
            console.log(data);

            if (!response.ok) {
                throw new Error(
                    data?.phone_number?.[0] ||
                    data?.full_name?.[0] ||
                    data?.address?.[0] ||
                    data?.detail ||
                    data?.non_field_errors?.[0] ||
                    "Signup failed"
                );
            }

            await onSuccess();

            Toast.show({
                type: "success",
                text1: "Account Created 🎉",
                text2: "Welcome to Ovena!",
            });
        } catch (err: any) {
            console.log("[COMPLETE SIGNUP ERROR]", err);

            if (err.name === "AbortError") {
                Toast.show({
                    type: "error",
                    text1: "Network Timeout",
                    text2: "Please try again",
                });

                return;
            }

            Toast.show({
                type: "error",
                text1: "Signup Failed",
                text2: err.message || "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        submit,
    };
}