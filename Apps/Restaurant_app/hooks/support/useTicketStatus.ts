// hooks/support/useTicketStatus.ts

import api from "@/services/apiClient";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export type TicketStatus = "open" | "closed";

interface UseTicketStatusParams {
    ticketId?: string | number;
    initialStatus?: TicketStatus;

    onStatusChanged?: (status: TicketStatus) => void;
    onRefreshTickets?: () => Promise<void> | void;
}

export const useTicketStatus = ({
    ticketId,
    initialStatus = "open",
    onStatusChanged,
    onRefreshTickets,
}: UseTicketStatusParams) => {
    const [ticketStatus, setTicketStatus] =
        useState<TicketStatus>(initialStatus);

    const [updatingStatus, setUpdatingStatus] =
        useState(false);

    /**
     * Keep local state synchronized whenever the
     * selected ticket changes.
     */
    useEffect(() => {
        setTicketStatus(initialStatus);
    }, [initialStatus]);

    /**
     * Manually sync status.
     */
    const syncStatus = useCallback(
        (status: TicketStatus) => {
            setTicketStatus(status);
        },
        []
    );

    /**
     * Close / Reopen ticket.
     */
    const toggleStatus = useCallback(async () => {
        if (!ticketId) return;

        setUpdatingStatus(true);

        try {
            if (ticketStatus === "open") {
                await api.post(
                    `/business/support/tickets/${ticketId}/close/`
                );
            } else {
                await api.post(
                    `/business/support/tickets/${ticketId}/reopen/`
                );
            }

            const res = await api.get(
                `/business/support/tickets/${ticketId}/`
            );

            const latestStatus: TicketStatus =
                res.data?.status ?? "open";

            setTicketStatus(latestStatus);

            onStatusChanged?.(latestStatus);

            if (onRefreshTickets) {
                await onRefreshTickets();
            }
        } catch (error: any) {
            console.error("Toggle Ticket Status:", error);

            Alert.alert(
                "Action Failed",
                error?.response?.data?.detail ??
                "Unable to update ticket status."
            );
        } finally {
            setUpdatingStatus(false);
        }
    }, [
        ticketId,
        ticketStatus,
        onStatusChanged,
        onRefreshTickets,
    ]);

    return {
        ticketStatus,
        updatingStatus,

        syncStatus,
        toggleStatus,
    };
};

export default useTicketStatus;