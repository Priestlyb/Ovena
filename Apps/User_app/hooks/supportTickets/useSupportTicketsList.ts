// hooks/supportTickets/useSupportTicketsList.ts

import { useCallback, useEffect, useState } from "react";

import {
    SupportTicket,
    useCustomerSupportTickets,
} from "@/hooks/supportTickets/useCustomerSupportTickets";


type CustomerSupportInstance = ReturnType<
    typeof useCustomerSupportTickets
>;


export const useSupportTicketsList = (
    customerSupport: CustomerSupportInstance
) => {
    const {
        loading,

        tickets,

        getSupportTickets,
    } = customerSupport;


    const [refreshing, setRefreshing] = useState(false);


    /* =========================================
       FETCH TICKETS
    ========================================= */

    const fetchTickets = useCallback(async () => {
        await getSupportTickets();
    }, [getSupportTickets]);


    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);


    /* =========================================
       PULL TO REFRESH
    ========================================= */

    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(true);

            await fetchTickets();

        } finally {
            setRefreshing(false);
        }
    }, [fetchTickets]);


    /* =========================================
       HELPERS
    ========================================= */

    const getTicketById = useCallback(
        (
            ticketId: string | number
        ): SupportTicket | undefined => {

            return tickets.find(
                (ticket) =>
                    ticket.id.toString() ===
                    ticketId.toString()
            );

        },
        [tickets]
    );


    return {
        loading,

        tickets,

        refreshing,

        fetchTickets,

        onRefresh,

        getTicketById,
    };
};