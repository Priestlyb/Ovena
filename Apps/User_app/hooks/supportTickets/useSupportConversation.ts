// hooks/supportTickets/useSupportConversation.ts

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { Alert } from "react-native";

import {
    SupportTicket,
    useCustomerSupportTickets,
} from "@/hooks/supportTickets/useCustomerSupportTickets";

import { ChatMessage } from "@/src/types/support";


type CustomerSupportInstance = ReturnType<
    typeof useCustomerSupportTickets
>;


interface UseSupportConversationProps {
    customerSupport: CustomerSupportInstance;
}


export const useSupportConversation = ({
    customerSupport,
}: UseSupportConversationProps) => {

    const {
        getSupportTicketMessages,
    } = customerSupport;


    const [selectedTicket, setSelectedTicket] =
        useState<SupportTicket | null>(null);


    const [messages, setMessages] =
        useState<ChatMessage[]>([]);


    const [loadingMessages, setLoadingMessages] =
        useState(false);


    const prevMessageIdsRef =
        useRef<Set<string | number>>(new Set());


    /* =========================================
       FETCH MESSAGES
    ========================================= */

    const fetchMessages = useCallback(
        async (ticketId: string | number) => {

            try {

                if (messages.length === 0) {
                    setLoadingMessages(true);
                }


                const response =
                    await getSupportTicketMessages(ticketId);


                if (!response.success) {
                    setMessages([]);
                    return;
                }


                const payload: any = response.data;


                let data: any[] = [];


                if (Array.isArray(payload)) {

                    data = payload;

                } else if (
                    Array.isArray(payload?.results?.data)
                ) {

                    data = payload.results.data;

                } else if (
                    Array.isArray(payload?.data)
                ) {

                    data = payload.data;
                }


                const parsed: ChatMessage[] = data.map((msg: any) => ({
                    id: String(msg.id),

                    type: msg.type,

                    text: msg.message ?? msg.text ?? "",

                    timestamp: msg.created_at ?? msg.timestamp,

                    attachments: msg.attachments ?? [],
                }));


                const previousIds =
                    prevMessageIdsRef.current;


                const newMessages =
                    parsed.filter(
                        (message) =>
                            !previousIds.has(message.id)
                    );


                const newAgentMessages =
                    newMessages.filter(
                        (message) =>
                            message.type === "agent"
                    );


                parsed.forEach((message) => {

                    previousIds.add(message.id);

                });


                setMessages(parsed);


            } catch (error) {

                console.log(
                    "[SUPPORT CONVERSATION ERROR]:",
                    error
                );


                setMessages([]);


            } finally {

                setLoadingMessages(false);

            }

        },
        [
            getSupportTicketMessages,
            messages.length,
        ],
    );




    /* =========================================
       SELECT TICKET
    ========================================= */

    const selectTicket = useCallback(
        async (ticket: SupportTicket) => {

            setSelectedTicket(ticket);

            prevMessageIdsRef.current.clear();

            await fetchMessages(ticket.id);

        },
        [
            fetchMessages,
        ],
    );


    /* =========================================
       ADD LOCAL MESSAGE
    ========================================= */

    const addMessage = useCallback(
        (message: ChatMessage) => {

            setMessages((prev) => [
                ...prev,
                message,
            ]);


            prevMessageIdsRef.current.add(
                message.id
            );

        },
        [],
    );


    /* =========================================
       CLEAR CONVERSATION
    ========================================= */

    const clearConversation = useCallback(() => {

        prevMessageIdsRef.current.clear();

        setMessages([]);

        setSelectedTicket(null);

    }, []);


    /* =========================================
       AUTO REFRESH
    ========================================= */

    useEffect(() => {

        if (!selectedTicket) return;


        const interval = setInterval(() => {

            fetchMessages(
                selectedTicket.id
            );

        }, 300000);


        return () =>
            clearInterval(interval);


    }, [
        selectedTicket,
        fetchMessages,
    ]);


    return {

        selectedTicket,

        setSelectedTicket,

        selectTicket,


        messages,

        setMessages,

        addMessage,


        loadingMessages,


        fetchMessages,


        clearConversation,

    };
};