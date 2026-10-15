// src/types/support.ts

export interface MessageAttachment {
    id?: string;
    file?: string;
    url?: string;
    uri?: string;
    name?: string;
    type?: string;
}

export type ChatMessageType =
    | "system"
    | "bot"
    | "agent"
    | "user";

export interface ChatMessage {
    id: string | number;

    type: ChatMessageType;

    text: string;

    timestamp?: string;

    attachments?: MessageAttachment[] | string[];
}

export type Message = ChatMessage;

export type TicketPriority =
    | "low"
    | "medium"
    | "high";