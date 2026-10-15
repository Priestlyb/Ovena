// hooks/supportTicket/useCustomerSupportTickets.ts

import { useCallback, useState } from "react";
import api from "@/services/apiClient";
import * as ImagePicker from "expo-image-picker";

/* =========================================
   TYPES
========================================= */

export type SupportTicketPriority =
    | "low"
    | "medium"
    | "high";

export type SupportTicketStatus =
    | "open"
    | "closed"
    | "pending"
    | "resolved";

export interface SupportTicket {
    id: string;
    category: string;
    subject: string;
    description?: string;
    priority: SupportTicketPriority;
    status?: SupportTicketStatus;
    created_at?: string;
    updated_at?: string;
}

export interface SupportTicketAttachment {
    id: string;
    file: string;
    file_name?: string;
    file_type?: string;
    created_at?: string;
}

export interface SupportTicketMessage {
    id: string;
    type: "user" | "agent" | "system";
    text: string;
    timestamp?: string;
    sender_type?: string;
    sender_id?: number | string;
    attachments: SupportTicketAttachment[];
}

/* =========================================
   HOOK
========================================= */

export const useCustomerSupportTickets = () => {
    const [loading, setLoading] = useState(false);

    const [tickets, setTickets] = useState<SupportTicket[]>([]);

    const [selectedTicket, setSelectedTicket] =
        useState<SupportTicket | null>(null);

    const [messages, setMessages] =
        useState<SupportTicketMessage[]>([]);

    const [error, setError] =
        useState<string | null>(null);


    /* =========================================
       GET ALL TICKETS
    ========================================= */

    const getSupportTickets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(
                "/customer/support/tickets/"
            );


            const data =
                response.data?.results ??
                response.data?.data ??
                [];

            setTickets(data);

            return {
                success: true,
                data,
            };

        } catch (err: any) {
            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.message ||
                "Failed to fetch support tickets";

            console.log(
                "[GET SUPPORT TICKETS ERROR]:",
                err?.response?.data || err
            );

            setError(message);

            return {
                success: false,
                error: message,
            };

        } finally {
            setLoading(false);
        }
    }, []);



    /* =========================================
       GET SINGLE TICKET
    ========================================= */

    const getSupportTicketById = useCallback(
        async (
            ticketId: number | string
        ) => {
            try {
                setLoading(true);
                setError(null);

                console.log(
                    `[GET SUPPORT TICKET] ID -> ${ticketId}`
                );

                const response = await api.get(
                    `/customer/support/tickets/${ticketId}/`
                );

                const data =
                    response.data?.data ??
                    response.data;

                setSelectedTicket(data);

                return {
                    success: true,
                    data,
                };

            } catch (err: any) {
                const message =
                    err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to fetch support ticket";

                console.log(
                    "[GET SUPPORT TICKET ERROR]:",
                    err?.response?.data || err
                );

                setError(message);

                return {
                    success: false,
                    error: message,
                };

            } finally {
                setLoading(false);
            }
        },
        []
    );



    /* =========================================
       GET TICKET MESSAGES
    ========================================= */

    const getSupportTicketMessages = useCallback(
        async (ticketId: number | string) => {
            try {
                setLoading(true);
                setError(null);

                //console.log(
                //     `[GET SUPPORT TICKET MESSAGES] ID -> ${ticketId}`
                // );

                const response = await api.get(
                    `/customer/support/tickets/${ticketId}/messages/`
                );

                const payload = response.data;

                let data: any[] = [];

                if (Array.isArray(payload?.data)) {
                    data = payload.data;
                } else if (Array.isArray(payload?.results)) {
                    data = payload.results;
                } else if (Array.isArray(payload?.results?.data)) {
                    data = payload.results.data;
                }

                const parsed: SupportTicketMessage[] = data.map((msg: any) => ({
                    id: String(msg.id),

                    type:
                        msg.sender_type === "support"
                            ? "agent"
                            : msg.sender_type === "customer"
                                ? "user"
                                : "system",

                    text: msg.message,

                    timestamp: msg.created_at,

                    sender_type: msg.sender_type,
                    sender_id: msg.sender_id,

                    attachments: (msg.attachments ?? []).map((attachment: any) => ({
                        id: attachment.id,
                        file: attachment.file,
                        file_name: attachment.original_filename,
                        file_type: attachment.content_type,
                        created_at: attachment.created_at,
                    })),
                }));

                //console.log(
                //  "[GET SUPPORT TICKET MESSAGES DATA]",
                //  JSON.stringify(parsed, null, 2)
                // );

                setMessages(parsed);

                return {
                    success: true,
                    data: parsed,
                };
            } catch (err: any) {
                const message =
                    err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to fetch support ticket messages";

                console.log(
                    "[GET SUPPORT TICKET MESSAGES ERROR]:",
                    err?.response?.data || err
                );

                setError(message);

                return {
                    success: false,
                    error: message,
                };
            } finally {
                setLoading(false);
            }
        },
        []
    );



    /* =========================================
   SEND MESSAGE
========================================= */

    const sendSupportTicketMessage = useCallback(
        async (
            ticketId: number | string,
            payload: {
                message: string;
                attachments?: ImagePicker.ImagePickerAsset[];
            }
        ) => {
            try {
                setLoading(true);
                setError(null);

                console.log(
                    "[SEND SUPPORT MESSAGE PAYLOAD]",
                    payload
                );

                const formData = new FormData();

                /*
                 * MESSAGE
                 */
                formData.append(
                    "message",
                    payload.message
                );

                /*
                 * ATTACHMENTS
                 */
                if (
                    payload.attachments &&
                    payload.attachments.length > 0
                ) {
                    payload.attachments.forEach(
                        (file, index) => {
                            const filename =
                                file.fileName ??
                                `attachment-${index}.jpg`;

                            const fileType =
                                file.mimeType ??
                                "image/jpeg";

                            const fileData = {
                                uri: file.uri,
                                name: filename,
                                type: fileType,
                            };

                            console.log(
                                "[ADDING FILE]",
                                {
                                    field: "attachments",
                                    ...fileData,
                                }
                            );

                            formData.append(
                                "attachments",
                                fileData as any
                            );
                        }
                    );
                }

                const response = await api.post(
                    `/customer/support/tickets/${ticketId}/messages/`,
                    formData,
                    {
                        headers: {
                            Accept: "application/json",
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );

                //console.log(
                // "[SEND SUPPORT MESSAGE RESPONSE]",
                //  response.data
                // );

                return {
                    success: true,
                    data:
                        response.data?.data ??
                        response.data,
                };
            } catch (err: any) {
                const message =
                    err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to send support message";

                console.log(
                    "[SEND SUPPORT MESSAGE ERROR]",
                    err?.response?.data || err
                );

                setError(message);

                return {
                    success: false,
                    error: message,
                };
            } finally {
                setLoading(false);
            }
        },
        []
    );



    /* =========================================
       REOPEN TICKET
    ========================================= */

    const reopenSupportTicket = useCallback(
        async (
            ticketId: number | string
        ) => {

            try {
                setLoading(true);
                setError(null);


                const response = await api.post(
                    `/customer/support/tickets/${ticketId}/reopen/`
                );


                return {
                    success: true,
                    data:
                        response.data?.data ??
                        response.data,
                };


            } catch (err: any) {

                const message =
                    err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to reopen support ticket";


                setError(message);


                return {
                    success: false,
                    error: message,
                };


            } finally {
                setLoading(false);
            }

        },
        []
    );



    /* =========================================
       CLOSE TICKET
    ========================================= */

    const closeSupportTicket = useCallback(
        async (
            ticketId: number | string
        ) => {

            try {
                setLoading(true);
                setError(null);


                const response = await api.post(
                    `/customer/support/tickets/${ticketId}/close/`
                );


                return {
                    success: true,
                    data:
                        response.data?.data ??
                        response.data,
                };


            } catch (err: any) {

                const message =
                    err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to close support ticket";


                setError(message);


                return {
                    success: false,
                    error: message,
                };


            } finally {
                setLoading(false);
            }

        },
        []
    );



    return {
        loading,
        error,

        tickets,
        selectedTicket,
        messages,

        setSelectedTicket,
        setMessages,

        getSupportTickets,
        getSupportTicketById,
        getSupportTicketMessages,

        sendSupportTicketMessage,

        reopenSupportTicket,
        closeSupportTicket,
    };
};