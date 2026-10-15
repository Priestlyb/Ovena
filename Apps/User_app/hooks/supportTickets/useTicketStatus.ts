// hooks/supportTickets/useTicketStatus.ts

import { useEffect, useState } from "react";

import {
    useCustomerSupportTickets,
} from "@/hooks/supportTickets/useCustomerSupportTickets";


type CustomerSupportInstance = ReturnType<
    typeof useCustomerSupportTickets
>;


interface UseTicketStatusParams {

    customerSupport: CustomerSupportInstance;

    ticketId?: string | number;

    initialStatus?: "open" | "closed";

    refreshTickets?: () => Promise<void>;

    onTicketUpdated?: (ticket: any) => void;

    onError?: (message: string) => void;
}


export const useTicketStatus = ({
    customerSupport,

    ticketId,

    initialStatus = "open",

    refreshTickets,

    onTicketUpdated,

    onError,

}: UseTicketStatusParams) => {


    const {
        closeSupportTicket,

        reopenSupportTicket,

        getSupportTicketById,

    } = customerSupport;



    const [ticketStatus, setTicketStatus] =
        useState<"open" | "closed">(
            initialStatus
        );


    const [updatingStatus, setUpdatingStatus] =
        useState(false);



    /*
        Keep status synced when switching tickets
    */

    useEffect(() => {

        setTicketStatus(
            initialStatus
        );

    }, [
        initialStatus,
        ticketId,
    ]);



    /* =========================================
       SET STATUS
    ========================================= */

    const updateStatus = (
        status: "open" | "closed"
    ) => {

        setTicketStatus(status);

    };



    /* =========================================
       REFRESH CURRENT TICKET
    ========================================= */

    const refreshCurrentTicket =
        async () => {

            if (!ticketId) return;


            const response =
                await getSupportTicketById(
                    ticketId
                );


            if (
                !response.success ||
                !response.data
            ) {
                return;
            }


            const updatedTicket =
                response.data;


            setTicketStatus(
                updatedTicket.status || "open"
            );


            onTicketUpdated?.(
                updatedTicket
            );
        };



    /* =========================================
       TOGGLE STATUS
    ========================================= */

    const toggleTicketStatus =
        async () => {

            if (!ticketId) return;


            try {

                setUpdatingStatus(true);


                const response =
                    ticketStatus === "open"

                        ? await closeSupportTicket(
                            ticketId
                        )

                        : await reopenSupportTicket(
                            ticketId
                        );



                if (!response.success) {

                    onError?.(
                        response.error ||
                        "Invalid action for current ticket state."
                    );

                    return;

                }



                await refreshCurrentTicket();


                await refreshTickets?.();



            } catch (error) {

                console.log(
                    "[SUPPORT STATUS ERROR]:",
                    error
                );


                onError?.(
                    "Failed to update ticket."
                );


            } finally {

                setUpdatingStatus(false);

            }

        };



    return {

        ticketStatus,

        updatingStatus,


        setTicketStatus:
            updateStatus,


        refreshCurrentTicket,


        toggleTicketStatus,

    };
};