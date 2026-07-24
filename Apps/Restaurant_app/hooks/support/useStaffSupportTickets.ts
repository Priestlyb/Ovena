// hooks/support/useSupportTickets.ts

import api from "@/services/apiClient";
import { useCallback, useEffect, useState } from "react";

export interface Ticket {
    id: string | number;
    category: string;
    subject: string;
    description: string;
    priority: string;
    created_at: string;
    status?: "open" | "closed";
}

export const useSupportTickets = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    /**
     * Fetch all tickets
     */
    const fetchTickets = useCallback(async () => {
        try {
            setLoadingTickets(true);

            const res = await api.get("/business/support/staff/tickets/");

            setTickets(res.data?.results || res.data || []);
        } catch (error) {
            console.error("Fetch Tickets:", error);
        } finally {
            setLoadingTickets(false);
        }
    }, []);

    /**
     * Initial load
     */
    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    /**
     * Pull-to-refresh
     */
    const refreshTickets = useCallback(async () => {
        setRefreshing(true);

        try {
            await fetchTickets();
        } finally {
            setRefreshing(false);
        }
    }, [fetchTickets]);

    /**
     * Select ticket
     */
    const selectTicket = useCallback((ticket: Ticket) => {
        setSelectedTicket(ticket);
    }, []);

    /**
     * Clear selection
     */
    const clearSelectedTicket = useCallback(() => {
        setSelectedTicket(null);
    }, []);

    return {
        // Ticket list
        tickets,
        loadingTickets,
        refreshing,

        // Actions
        fetchTickets,
        refreshTickets,

        // Selected ticket
        selectedTicket,
        selectTicket,
        setSelectedTicket,
        clearSelectedTicket,
    };
};

export default useSupportTickets;