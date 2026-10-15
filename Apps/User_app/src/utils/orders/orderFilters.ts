// utils/orders/orderFilters.ts

export const isUpcomingOrder = (status: string) => {
    const normalized = status?.toLowerCase?.() || "pending";

    return (
        normalized !== "completed" &&
        normalized !== "cancelled"
    );
};

export const isHistoryOrder = (status: string) => {
    const normalized = status?.toLowerCase?.() || "";

    return (
        normalized === "completed" ||
        normalized === "cancelled"
    );
};

export const filterByStatus = (
    orders: any[],
    type: "Upcoming" | "History",
) => {
    if (!Array.isArray(orders)) return [];

    return orders.filter((item) => {
        if (type === "Upcoming") {
            return isUpcomingOrder(item?.status);
        }

        return isHistoryOrder(item?.status);
    });
};