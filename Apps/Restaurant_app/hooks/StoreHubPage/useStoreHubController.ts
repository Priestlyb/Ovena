import { Branch, BranchHour } from "@/types/storeHub";
import { useEffect, useState } from "react";

/* ================= WEEK TEMPLATE ================= */
const getWeekTemplate = (): BranchHour[] => {
    return [
        { day: 0, open_time: "09:00:00", close_time: "17:00:00", is_closed: false },
        { day: 1, open_time: "09:00:00", close_time: "17:00:00", is_closed: false },
        { day: 2, open_time: "09:00:00", close_time: "17:00:00", is_closed: false },
        { day: 3, open_time: "09:00:00", close_time: "17:00:00", is_closed: false },
        { day: 4, open_time: "09:00:00", close_time: "17:00:00", is_closed: false },
        { day: 5, open_time: "09:00:00", close_time: "17:00:00", is_closed: false },
        { day: 6, open_time: "09:00:00", close_time: "17:00:00", is_closed: false },
    ];
};

export const useStoreHubController = (
    branches: Branch[],
    apiHours: BranchHour[],
) => {
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

    const [deliveryMethod, setDeliveryMethod] = useState<
        "Instant" | "Scheduled"
    >("Scheduled");

    const [hours, setHours] = useState<BranchHour[]>([]);

    const [preOrderTime, setPreOrderTime] = useState("12:00 AM");
    const [finalOrderTime, setFinalOrderTime] = useState("12:00 PM");

    /* ================= INIT DEFAULT BRANCH ================= */
    useEffect(() => {
        if (branches.length > 0 && !selectedBranch) {
            setSelectedBranch(branches[0]);
        }
    }, [branches]);

    /* ================= SYNC DELIVERY METHOD ================= */
    useEffect(() => {
        if (!selectedBranch) return;

        const method =
            selectedBranch.delivery_method === "instant"
                ? "Instant"
                : "Scheduled";

        setDeliveryMethod(method);
    }, [selectedBranch?.id]);

    /* ================= NORMALIZE API HOURS → FULL WEEK ================= */
    useEffect(() => {
        const template = getWeekTemplate();

        const merged = template.map((day) => {
            const match = apiHours.find((h) => h.day === day.day);

            return match
                ? {
                    ...day,
                    ...match,
                }
                : day;
        });

        setHours(merged);
    }, [apiHours]);

    /* ================= ENSURE INSTANT MODE ALWAYS HAS DATA ================= */
    useEffect(() => {
        if (deliveryMethod === "Instant" && hours.length === 0) {
            setHours(getWeekTemplate());
        }
    }, [deliveryMethod]);

    return {
        selectedBranch,
        setSelectedBranch,

        deliveryMethod,
        setDeliveryMethod,

        hours,
        setHours,

        preOrderTime,
        setPreOrderTime,

        finalOrderTime,
        setFinalOrderTime,
    };
};