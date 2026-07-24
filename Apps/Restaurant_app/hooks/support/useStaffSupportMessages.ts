// hooks/support/useSupportMessages.ts

import api from "@/services/apiClient";
import { Message } from "@/types/support";

import * as ImagePicker from "expo-image-picker";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { Alert } from "react-native";

interface UseSupportMessagesProps {
    ticketId?: string | number;
    ticketStatus?: "open" | "closed";
}

export const useStaffSupportMessages = ({
    ticketId,
    ticketStatus = "open",
}: UseSupportMessagesProps) => {
    /**
     * -------------------------------
     * Messages
     * -------------------------------
     */

    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    /**
     * -------------------------------
     * Composer
     * -------------------------------
     */

    const [inputText, setInputText] = useState("");

    const [attachments, setAttachments] = useState<
        ImagePicker.ImagePickerAsset[]
    >([]);

    const [sending, setSending] = useState(false);

    /**
     * Prevent duplicate reply alerts.
     */

    const previousIds = useRef<Set<string | number>>(new Set());

    /**
     * -------------------------------
     * Image Picker
     * -------------------------------
     */

    const openImagePicker = useCallback(async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                "Permission Required",
                "Please allow access to your photo library."
            );

            return;
        }

        const remaining = 5 - attachments.length;

        if (remaining <= 0) {
            Alert.alert(
                "Maximum reached",
                "You can attach up to 5 images."
            );

            return;
        }

        const result =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                selectionLimit: remaining,
                quality: 0.8,
            });

        if (result.canceled) return;

        setAttachments((prev) =>
            [...prev, ...result.assets].slice(0, 5)
        );
    }, [attachments.length]);

    /**
     * -------------------------------
     * Fetch Messages
     * -------------------------------
     */

    const fetchMessages = useCallback(async () => {
        if (!ticketId) return;

        try {
            if (messages.length === 0) {
                setLoadingMessages(true);
            }

            const res = await api.get(
                `/business/support/staff/tickets/${ticketId}/messages/`
            );

            console.log("Messages Response:");
            console.log(JSON.stringify(res.data, null, 2));

            let data: any[] = [];

            if (Array.isArray(res.data)) {
                data = res.data;
            } else if (Array.isArray(res.data?.results?.data)) {
                data = res.data.results.data;
            }

            const parsed: Message[] = data.map((msg: any) => ({
                id: String(msg.id),

                type:
                    msg.sender_type === "business_admin" ||
                        msg.sender_type === "business_staff"
                        ? "user"
                        : msg.sender_type === "support"
                            ? "agent"
                            : "system",

                text: msg.message,

                timestamp: msg.created_at,

                attachments: Array.isArray(msg.attachments)
                    ? msg.attachments.map((attachment: any) => ({
                        id: String(attachment.id),
                        file: attachment.file,
                        original_filename: attachment.original_filename,
                        content_type: attachment.content_type,
                        file_size: attachment.file_size,
                        created_at: attachment.created_at,
                    }))
                    : [],
            }));

            const newMessages = parsed.filter(
                (message) =>
                    !previousIds.current.has(message.id)
            );

            parsed.forEach((message) =>
                previousIds.current.add(message.id)
            );

            setMessages(parsed);
        } catch (error) {
            console.error(
                "Fetch Messages:",
                error
            );

            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    }, [ticketId, messages.length]);

    /**
     * -------------------------------
     * Ticket Changed
     * -------------------------------
     */

    useEffect(() => {
        if (!ticketId) {
            setMessages([]);
            setAttachments([]);
            previousIds.current.clear();

            return;
        }

        previousIds.current.clear();

        fetchMessages();
    }, [ticketId, fetchMessages]);

    /**
     * -------------------------------
     * Poll Every 5 Minutes
     * -------------------------------
     */

    useEffect(() => {
        if (!ticketId) return;

        const interval = setInterval(
            fetchMessages,
            300000
        );

        return () => clearInterval(interval);
    }, [ticketId, fetchMessages]);

    /**
   * Send message
   */
    const sendMessage = useCallback(async () => {
        if (!ticketId) return;

        const text = inputText.trim();

        if (!text && attachments.length === 0) {
            return;
        }

        if (ticketStatus === "closed") {
            Alert.alert(
                "Closed Ticket",
                "Reopen the ticket before sending messages."
            );
            return;
        }

        const optimisticMessage: Message = {
            id: String(Date.now()),
            type: "user",
            text:
                text ||
                `📎 ${attachments.length} attachment${attachments.length > 1 ? "s" : ""
                }`,
            timestamp: new Date().toISOString(),

            attachments: attachments.map((asset, index) => ({
                id: `local-${Date.now()}-${index}`,
                file: asset.uri,
                original_filename:
                    asset.fileName ??
                    asset.uri.split("/").pop() ??
                    `image-${index}.jpg`,
                content_type: asset.mimeType ?? "image/jpeg",
                file_size: asset.fileSize ?? 0,
                created_at: new Date().toISOString(),
            })),
        };

        setMessages((prev) => [...prev, optimisticMessage]);

        setInputText("");
        setAttachments([]);

        setSending(true);

        try {
            const formData = new FormData();

            formData.append("message", text);

            attachments.forEach((image, index) => {
                const extension =
                    image.uri.split(".").pop()?.toLowerCase() || "jpg";

                formData.append("attachments", {
                    uri: image.uri,
                    name:
                        image.fileName ??
                        `attachment-${index}.${extension}`,
                    type: image.mimeType ?? `image/${extension}`,
                } as any);
            });

            await api.post(
                `/business/support/staff/tickets/${ticketId}/messages/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            await fetchMessages();
        } catch (error) {
            console.error("Send Message:", error);

            Alert.alert(
                "Failed",
                "Unable to send your message."
            );
        } finally {
            setSending(false);
        }
    }, [
        ticketId,
        inputText,
        attachments,
        ticketStatus,
        fetchMessages,
    ]);

    return {
        messages,
        loadingMessages,

        inputText,
        setInputText,

        attachments,
        setAttachments,

        ImagePicker,
        openImagePicker,

        sending,

        fetchMessages,
        sendMessage,

        setMessages,
    };
};

export default useStaffSupportMessages;