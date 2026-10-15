// hooks/supportTickets/useSupportChat.ts

import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { useCreateSupportTicket } from "@/hooks/supportTickets/useCreateSupportTicket";
import { Message, TicketPriority } from "@/src/types/support";

interface SendTicketParams {
    category: string;
    subject: string;
    description: string;
    priority: TicketPriority;
    attachments?: ImagePicker.ImagePickerAsset[];
    onSuccess?: () => void;
}

export const useSupportChat = () => {
    const { createSupportTicket, loading } = useCreateSupportTicket();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            type: "system",
            text: "{recent_date}",
            timestamp: new Date().toLocaleDateString(),
        },
        {
            id: "2",
            type: "bot",
            text: "Hi! Welcome to Ovena Support. How can we help?",
        },
    ]);

    const addMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
    };

    const sendTicket = async ({
        category,
        subject,
        description,
        priority,
        attachments = [],
        onSuccess,
    }: SendTicketParams) => {
        if (!category || !subject.trim() || !description.trim()) {
            return;
        }

        // Immediately show the user's message
        addMessage({
            id: Date.now().toString(),
            type: "user",
            text: description.trim(),
        });

        // Build multipart/form-data payload
        const formData = new FormData();

        formData.append("category", category);
        formData.append("subject", subject.trim());
        formData.append("description", description.trim());
        formData.append("priority", priority);

        attachments.forEach((file, index) => {
            const extension =
                file.mimeType?.split("/")[1] ??
                file.fileName?.split(".").pop() ??
                "jpg";

            formData.append("attachments", {
                uri: file.uri,
                name:
                    file.fileName ??
                    `attachment-${index}.${extension}`,
                type: file.mimeType ?? "image/jpeg",
            } as any);
        });

        const response = await createSupportTicket(formData);

        if (response.success) {
            addMessage({
                id: `${Date.now()}-bot`,
                type: "bot",
                text:
                    "Your support ticket has been created successfully. Our team will respond shortly.",
            });

            onSuccess?.();
        } else {
            addMessage({
                id: `${Date.now()}-error`,
                type: "bot",
                text:
                    response.error ??
                    "Failed to create support ticket.",
            });
        }

        return response;
    };

    return {
        messages,
        loading,
        sendTicket,
        addMessage,
    };
};