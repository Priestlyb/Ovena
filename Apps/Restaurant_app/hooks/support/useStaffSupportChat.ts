// hooks/support/useSupportChat.ts

import { SupportPriority } from "@/components/support/PrioritySelector";
import api from "@/services/apiClient";
import { Message } from "@/types/support";
import { logAxiosError } from "@/utils/logAxiosError";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

interface SendTicketParams {
    category: string;
    subject: string;
    description: string;
    priority: SupportPriority;
    attachments: ImagePicker.ImagePickerAsset[];

    onSuccess?: () => void;
}

const getTodayLabel = () => {
    return new Date().toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

export const useStaffSupportChat = () => {
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            type: "system",
            text: "{recent_date}",
            timestamp: getTodayLabel(),
            attachments: [],
        },
        {
            id: "2",
            type: "agent",
            text: "Hi! Welcome to Ovena Support. How can we help?",
            timestamp: new Date().toISOString(),
            attachments: [],
        },
    ]);

    const sendTicket = async ({
        category,
        subject,
        description,
        priority,
        attachments,
        onSuccess,
    }: SendTicketParams) => {
        if (!category || !subject.trim() || !description.trim()) {
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            text: description,
            timestamp: new Date().toISOString(),

            attachments: attachments.map((image, index) => ({
                id: `local-${Date.now()}-${index}`,
                file: image.uri,
                original_filename:
                    image.fileName ??
                    image.uri.split("/").pop() ??
                    `attachment-${index}.jpg`,
                content_type: image.mimeType ?? "image/jpeg",
                file_size: image.fileSize ?? 0,
                created_at: new Date().toISOString(),
            })),
        };

        setMessages((prev) => [...prev, userMessage]);

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append("category", category);
            formData.append("subject", subject.trim());
            formData.append("description", description.trim());
            formData.append("priority", priority);

            attachments.forEach((image, index) => {
                formData.append("attachments", {
                    uri: image.uri,
                    name:
                        image.fileName ??
                        `attachment-${index}.jpg`,
                    type:
                        image.mimeType ??
                        "image/jpeg",
                } as any);
            });

            if (__DEV__) {
                console.log(
                    "Support Payload:",
                    JSON.stringify((formData as any)._parts, null, 2)
                );
            }

            await api.post(
                "/business/support/staff/tickets/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    transformRequest: (data) => data,
                }
            );

            setMessages((prev) => [
                ...prev,
                {
                    id: `${Date.now()}-agent`,
                    type: "agent",
                    text:
                        "Your support ticket has been created successfully. Our team will respond shortly.",
                    timestamp: new Date().toISOString(),
                    attachments: [],
                },
            ]);

            onSuccess?.();

        } catch (error: any) {
            logAxiosError(error);

            setMessages((prev) => [
                ...prev,
                {
                    id: `${Date.now()}-error`,
                    type: "agent",
                    text:
                        "Failed to create ticket. Please try again.",
                    timestamp: new Date().toISOString(),
                    attachments: [],
                },
            ]);

        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        messages,
        sendTicket,
    };
};

export default useStaffSupportChat;