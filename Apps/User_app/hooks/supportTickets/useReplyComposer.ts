// hooks/supportTickets/useReplyComposer.ts

import {
    useCallback,
    useState,
} from "react";

import * as ImagePicker from "expo-image-picker";

import { ChatMessage } from "@/src/types/support";


interface UseReplyComposerParams {

    ticketId?: string | number;

    ticketStatus?: "open" | "closed";


    sendSupportTicketMessage: (
        ticketId: string | number,
        payload: {
            message: string;
            attachments: ImagePicker.ImagePickerAsset[];
        }
    ) => Promise<{
        success: boolean;
        error?: string;
    }>;


    fetchMessages: (
        ticketId: string | number
    ) => Promise<void>;


    addLocalMessage?: (
        message: ChatMessage
    ) => void;


    onClosedTicket?: () => void;


    onError?: (
        message: string
    ) => void;

}



export const useReplyComposer = ({
    ticketId,

    ticketStatus = "open",

    sendSupportTicketMessage,

    fetchMessages,

    addLocalMessage,

    onClosedTicket,

    onError,

}: UseReplyComposerParams) => {


    const [attachments, setAttachments] =
        useState<ImagePicker.ImagePickerAsset[]>([]);


    const [inputText, setInputText] =
        useState("");


    const [sending, setSending] =
        useState(false);



    /* =========================================
       CLEAR INPUT
    ========================================= */

    const clear = useCallback(() => {

        setInputText("");

        setAttachments([]);

    }, []);



    /* =========================================
       SEND MESSAGE
    ========================================= */

    const sendMessage = useCallback(
        async () => {


            if (sending) return;


            if (!ticketId) return;



            const text =
                inputText.trim();



            /*
              Allow attachment-only messages
            */
            if (
                !text &&
                attachments.length === 0
            ) {
                return;
            }



            if (ticketStatus === "closed") {

                onClosedTicket?.();

                return;

            }



            const localMessage: ChatMessage = {

                id: Date.now(),

                type: "user",

                text,

                timestamp:
                    new Date().toISOString(),

                attachments:
                    attachments.map(
                        (item) => item.uri
                    ),

            };



            addLocalMessage?.(
                localMessage
            );



            setInputText("");



            try {


                setSending(true);



                const response =
                    await sendSupportTicketMessage(
                        ticketId,
                        {
                            message: text,

                            attachments: attachments,
                        }
                    );



                if (!response.success) {


                    setInputText(text);


                    onError?.(
                        response.error ??
                        "Failed to send message."
                    );


                    return;

                }



                /*
                  Clear attachments after
                  successful upload
                */
                setAttachments([]);



                await fetchMessages(
                    ticketId
                );



            } catch (error) {


                console.log(
                    "[REPLY COMPOSER ERROR]:",
                    error
                );



                setInputText(text);



                onError?.(
                    "Failed to send message."
                );



            } finally {


                setSending(false);


            }


        },
        [
            sending,
            ticketId,
            inputText,
            attachments,
            ticketStatus,
            addLocalMessage,
            sendSupportTicketMessage,
            fetchMessages,
            onClosedTicket,
            onError,
        ]
    );



    return {

        inputText,

        setInputText,


        attachments,

        setAttachments,


        sending,


        sendMessage,


        clear,

    };

};