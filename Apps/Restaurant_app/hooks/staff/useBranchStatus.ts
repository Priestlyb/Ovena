// hooks/Business/useBranchStatus.ts

import api from "@/services/apiClient";
import { useEffect, useState } from "react";

export interface FeedbackState {
    visible: boolean;
    variant: "success" | "error" | "warning" | "info";
    message: string;
}

export default function useBranchStatus() {
    const [isOpen, setIsOpen] = useState(false);
    const [branchDay, setBranchDay] = useState<number | null>(null);
    const [updating, setUpdating] = useState(false);

    const [feedback, setFeedback] = useState<FeedbackState>({
        visible: false,
        variant: "info",
        message: "",
    });

    useEffect(() => {
        const fetchBranchStatus = async () => {
            try {
                const response = await api.get("/business/branches/close/");

                const isClosed = response.data?.is_closed;
                const day = response.data?.day;

                setIsOpen(!isClosed);
                setBranchDay(day);
            } catch (error) {
                console.error("Branch status fetch error:", error);
            }
        };

        fetchBranchStatus();
    }, []);

    const toggleBranch = async (value: boolean) => {
        if (updating || branchDay === null) return;

        setIsOpen(value);
        setUpdating(true);

        try {
            await api.patch("/business/branches/close/", {
                day: branchDay,
                is_closed: !value,
                open_time: "20:41:32.036Z",
                close_time: "20:41:32.036Z",
            });

            setFeedback({
                visible: true,
                variant: "success",
                message: value
                    ? "Branch is now OPEN"
                    : "Branch is now CLOSED",
            });
        } catch (error) {
            console.error("Toggle update error:", error);

            setIsOpen(!value);

            setFeedback({
                visible: true,
                variant: "error",
                message: "Failed to update branch status. Try again.",
            });
        } finally {
            setUpdating(false);
        }
    };

    return {
        isOpen,
        updating,
        feedback,
        setFeedback,
        toggleBranch,
    };
}