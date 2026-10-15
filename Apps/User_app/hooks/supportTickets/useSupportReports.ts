// hooks/supportTickets/useSupportReports.ts

import { useCallback } from "react";
import { Alert } from "react-native";

import {
    SupportTicket,
    useCustomerSupportTickets,
} from "@/hooks/supportTickets/useCustomerSupportTickets";

import { useSupportConversation } from "@/hooks/supportTickets/useSupportConversation";
import { useReplyComposer } from "@/hooks/supportTickets/useReplyComposer";
import { useSupportTicketsList } from "@/hooks/supportTickets/useSupportTicketsList";
import { useTicketStatus } from "@/hooks/supportTickets/useTicketStatus";


export const useSupportReports = () => {


    /* =========================================
       SINGLE SUPPORT INSTANCE
    ========================================= */

    const customerSupport =
        useCustomerSupportTickets();



    /* =========================================
       TICKET LIST
    ========================================= */

    const ticketList =
        useSupportTicketsList(
            customerSupport
        );



    /* =========================================
       CONVERSATION
    ========================================= */

    const conversation =
        useSupportConversation({
            customerSupport,
        });



    /* =========================================
       SELECT TICKET
    ========================================= */

    const selectTicket = useCallback(
        async (
            ticket: SupportTicket
        ) => {

            await conversation.selectTicket(
                ticket
            );

        },
        [
            conversation,
        ]
    );



    const clearSelectedTicket =
        useCallback(() => {

            conversation.clearConversation();

        }, [
            conversation,
        ]);



    /* =========================================
       TICKET STATUS
    ========================================= */

    const ticketStatus =
        useTicketStatus({

            customerSupport,


            ticketId:
                conversation.selectedTicket?.id,


            initialStatus:
                (
                    conversation.selectedTicket
                        ?.status as
                    "open" | "closed"
                ) ?? "open",


            refreshTickets:
                ticketList.fetchTickets,


            onTicketUpdated:
                (ticket) => {

                    conversation.setSelectedTicket(
                        ticket
                    );

                },


            onError:
                (message) => {

                    Alert.alert(
                        "Action Failed",
                        message
                    );

                },

        });



    /* =========================================
       REPLY COMPOSER
    ========================================= */

    const replyComposer =
        useReplyComposer({

            ticketId:
                conversation.selectedTicket?.id,


            ticketStatus:
                ticketStatus.ticketStatus,


            sendSupportTicketMessage:
                customerSupport.sendSupportTicketMessage,


            fetchMessages:
                conversation.fetchMessages,


            addLocalMessage:
                conversation.addMessage,


            onClosedTicket:
                () => {

                    Alert.alert(
                        "Closed Ticket",
                        "Reopen the ticket before sending another message."
                    );

                },


            onError:
                (message) => {

                    Alert.alert(
                        "Error",
                        message
                    );

                },

        });



    /* =========================================
       RETURN
    ========================================= */

    return {

        /* ===============================
           Ticket List
        =============================== */

        loading:
            ticketList.loading,


        tickets:
            ticketList.tickets,


        refreshing:
            ticketList.refreshing,


        fetchTickets:
            ticketList.fetchTickets,


        onRefresh:
            ticketList.onRefresh,



        /* ===============================
           Conversation
        =============================== */

        selectedTicket:
            conversation.selectedTicket,


        setSelectedTicket:
            conversation.setSelectedTicket,


        messages:
            conversation.messages,


        loadingMessages:
            conversation.loadingMessages,


        selectTicket,


        clearSelectedTicket,


        fetchMessages:
            conversation.fetchMessages,



        /* ===============================
           Reply Composer
        =============================== */

        inputText:
            replyComposer.inputText,


        setInputText:
            replyComposer.setInputText,


        attachments:
            replyComposer.attachments,


        setAttachments:
            replyComposer.setAttachments,


        sending:
            replyComposer.sending,


        sendMessage:
            replyComposer.sendMessage,



        /* ===============================
           Ticket Status
        =============================== */

        ticketStatus:
            ticketStatus.ticketStatus,


        updatingStatus:
            ticketStatus.updatingStatus,


        setTicketStatus:
            ticketStatus.setTicketStatus,


        refreshCurrentTicket:
            ticketStatus.refreshCurrentTicket,


        toggleTicketStatus:
            ticketStatus.toggleTicketStatus,

    };
};