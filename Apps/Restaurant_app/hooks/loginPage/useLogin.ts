import api from "@/services/apiClient";
import { saveAuth } from "@/utils/authStorage";
import { useRouter } from "expo-router";
import { useState } from "react";

type Variant = "success" | "error" | "warning" | "info";

type LoginErrors = {
    phone?: string;
    email?: string;
    password?: string;
    otp?: string;
    username?: string;
    general?: string;
};

type Result = {
    success: boolean;
    errors?: LoginErrors;
};

export const useLogin = (
    deviceId: string,
    showFeedback: (message: string, variant?: Variant) => void
) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // ----------------------
    // PHONE HELPERS (PRODUCTION GRADE)
    // ----------------------

    const normalizeNigerianPhone = (phone: string) => {
        if (!phone) return "";

        let cleaned = phone.replace(/[\s-()]/g, "");

        // 00 international format → +234
        if (cleaned.startsWith("00")) {
            cleaned = "+" + cleaned.slice(2);
        }

        // 234 without +
        if (cleaned.startsWith("234") && !cleaned.startsWith("+")) {
            cleaned = "+" + cleaned;
        }

        // local format 0XXXXXXXXXX → +234XXXXXXXXXX
        if (cleaned.startsWith("0")) {
            cleaned = "+234" + cleaned.slice(1);
        }

        return cleaned;
    };

    const isValidPhone = (phone: string) => {
        const normalized = normalizeNigerianPhone(phone);

        // Strict Nigerian mobile numbers only
        // 070, 080, 081, 090, 091 prefixes (after +234)
        const regex = /^\+234(70|80|81|90|91)\d{8}$/;

        return regex.test(normalized);
    };

    const getNormalizedPhone = (phone: string) => {
        return normalizeNigerianPhone(phone);
    };

    const isValidPassword = (password: string) => {
        return password.length >= 6;
    };

    // ----------------------
    // API ERROR PARSER
    // ----------------------

    const parseApiErrors = (err: any): LoginErrors => {
        const data = err?.response?.data;
        const errors: LoginErrors = {};

        if (!data) {
            return { general: "Something went wrong. Please try again." };
        }

        if (typeof data === "string") {
            const cleanMessage = data
                .replace(/<[^>]*>/g, "")
                .replace(/\s+/g, " ")
                .trim();

            return {
                general:
                    cleanMessage.slice(0, 150) ||
                    "Server error occurred",
            };
        }

        if (data?.error) {
            errors.general = data.error;
        }

        if (data?.detail) {
            errors.general = data.detail;
        }

        if (data?.phone_number) {
            errors.phone = "Invalid phone number";
        }

        if (data?.password) {
            errors.password = "Invalid password";
        }

        if (data?.otp) {
            errors.otp = "Invalid OTP";
        }

        if (data?.username) {
            errors.username = "Invalid username";
        }

        if (!errors.general) {
            errors.general = "Something went wrong. Please try again.";
        }

        return errors;
    };

    // ----------------------
    // ADMIN / VENDOR LOGIN
    // ----------------------

    const handleLogin = async (
        phone: string,
        password: string,
        loginAs: "admin" | "vendor"
    ): Promise<Result> => {
        const errors: LoginErrors = {};

        if (!phone) {
            errors.phone = "Phone number is required";
        } else if (!isValidPhone(phone)) {
            errors.phone = "Phone number is invalid";
        }

        if (!password) {
            errors.password = "Password is required";
        } else if (!isValidPassword(password)) {
            errors.password = "Password must be at least 6 characters";
        }

        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        setLoading(true);

        try {
            const endpoint =
                loginAs === "admin"
                    ? "/accounts/business/admin-login/"
                    : "/accounts/vendor-login/";

            const res = await api.post(endpoint, {
                phone_number: getNormalizedPhone(phone),
                password,
            });

            await saveAuth(res.data.access, res.data.refresh);

            showFeedback("Login successful", "success");
            router.replace("/(tabs)");

            return { success: true };
        } catch (err: any) {
            const apiErrors = parseApiErrors(err);
            showFeedback(apiErrors.general || "Login failed", "error");

            return { success: false, errors: apiErrors };
        } finally {
            setLoading(false);
        }
    };

    // ----------------------
    // STAFF LOGIN
    // ----------------------

    const handleStaffLogin = async (): Promise<Result> => {
        if (!deviceId) {
            return {
                success: false,
                errors: { general: "Device ID not found" },
            };
        }

        setLoading(true);

        try {
            const res = await api.post("/accounts/staff-login/", {
                device_id: deviceId,
            });

            if (res.data?.access) {
                await saveAuth(res.data.access, res.data.refresh);

                showFeedback("Login successful", "success");
                router.replace("/screens/staffs/staffTabs");

                return { success: true };
            }

            return {
                success: false,
                errors: { general: "Device not approved" },
            };
        } catch (err: any) {
            const apiErrors = parseApiErrors(err);

            showFeedback(apiErrors.general || "Login failed", "error");

            return { success: false, errors: apiErrors };
        } finally {
            setLoading(false);
        }
    };

    // ----------------------
    // VENDOR APPROVAL
    // ----------------------

    const handleVendorApproval = async (
        otp: string,
        phone: string,
        username: string
    ): Promise<Result> => {
        const errors: LoginErrors = {};

        if (!otp) errors.otp = "OTP is required";

        if (!phone) {
            errors.phone = "Phone number is required";
        } else if (!isValidPhone(phone)) {
            errors.phone = "Phone number is invalid";
        }

        if (!username) errors.username = "Username is required";

        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        setLoading(true);

        try {
            const payload = {
                otp,
                device_id: deviceId,
                phone_number: getNormalizedPhone(phone),
                username,
            };

            console.log("📤 Payload:", JSON.stringify(payload, null, 2));

            const res = await api.post("/accounts/linked/approval/", payload);

            await saveAuth(res.data.access, res.data.refresh);

            showFeedback("Device approved successfully", "success");
            router.replace("/screens/staffs/staffTabs");

            return { success: true };
        } catch (err: any) {
            const apiErrors = parseApiErrors(err);

            showFeedback(
                apiErrors.general || "OTP is invalid or has expired.",
                "error"
            );

            return { success: false, errors: apiErrors };
        } finally {
            setLoading(false);
        }
    };

    // ----------------------
    // RESET PASSWORD
    // ----------------------

    const handleResetPassword = async (
        email: string
    ): Promise<Result> => {
        const errors: LoginErrors = {};

        if (!email.trim()) {
            errors.email = "Email is required";
        }

        if (Object.keys(errors).length > 0) {
            return {
                success: false,
                errors,
            };
        }

        setLoading(true);

        try {
            console.log("[PASSWORD RESET] Sending OTP...");
            console.log("[PASSWORD RESET] Email:", email.trim());

            const response = await api.post("/accounts/password-reset/send/", {
                email: email.trim(),
            });

            console.log("[PASSWORD RESET] Success:", response.data);

            showFeedback(
                "OTP sent successfully",
                "success"
            );

            return {
                success: true,
            };
        } catch (err: any) {
            console.log("========== PASSWORD RESET ERROR ==========");
            console.log("Message:", err?.message);
            console.log("Code:", err?.code);
            console.log("Status:", err?.response?.status);
            console.log("Response:", err?.response?.data);
            console.log("Full Error:", err);
            console.log("=========================================");

            const apiErrors: LoginErrors =
                parseApiErrors(err) ?? {};

            showFeedback(
                apiErrors.general ?? "Failed to send OTP",
                "error"
            );

            return {
                success: false,
                errors: apiErrors,
            };
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmReset = async (
        email: string,
        otp: string,
        newPassword: string
    ): Promise<Result> => {
        const errors: LoginErrors = {};

        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            errors.email = "Email is invalid";
        }

        if (!otp.trim()) {
            errors.otp = "OTP is required";
        }

        if (!newPassword) {
            errors.password = "New password is required";
        } else if (!isValidPassword(newPassword)) {
            errors.password = "Password must be at least 6 characters";
        }

        if (Object.keys(errors).length > 0) {
            return {
                success: false,
                errors,
            };
        }

        setLoading(true);

        try {
            await api.post("/accounts/password-reset/", {
                email: email.trim(),
                otp_code: otp.trim(),
                new_password: newPassword,
            });

            showFeedback(
                "Password reset successful",
                "success"
            );

            return {
                success: true,
            };
        } catch (err: any) {
            const apiErrors = parseApiErrors(err);

            showFeedback(
                apiErrors.general || "Password reset failed",
                "error"
            );

            return {
                success: false,
                errors: apiErrors,
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handleLogin,
        handleStaffLogin,
        handleVendorApproval,
        handleResetPassword,
        handleConfirmReset
    };
};