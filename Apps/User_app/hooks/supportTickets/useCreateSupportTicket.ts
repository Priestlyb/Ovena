// hooks/supportTickets/useCreateSupportTicket.ts

import { useState } from "react";
import api from "@/services/apiClient";
import axios from "axios";

export const useCreateSupportTicket = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createSupportTicket = async (formData: FormData) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            // Helpful for debugging FormData contents
            console.log("[CREATE SUPPORT TICKET FORM DATA]");
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await api.post(
                "/customer/support/tickets/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    transformRequest: (data) => data,
                }
            );

            setSuccess(true);

            console.log(
                "[CREATE SUPPORT TICKET RESPONSE]:",
                response.data
            );

            return {
                success: true,
                data: response.data,
            };
        } catch (err: any) {
            let message = "Something went wrong";

            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ||
                    err.response?.data?.detail ||
                    err.message;

                console.log(
                    "[CREATE SUPPORT TICKET ERROR RESPONSE]:",
                    err.response?.data
                );

                console.log(
                    "[CREATE SUPPORT TICKET ERROR STATUS]:",
                    err.response?.status
                );

                console.log(
                    "[CREATE SUPPORT TICKET ERROR HEADERS]:",
                    err.response?.headers
                );

                console.log(
                    "[CREATE SUPPORT TICKET REQUEST]:",
                    err.config
                );
            } else {
                console.log(
                    "[CREATE SUPPORT TICKET UNKNOWN ERROR]:",
                    err
                );
            }

            setError(message);

            return {
                success: false,
                error: message,
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        createSupportTicket,
        loading,
        error,
        success,
    };
};