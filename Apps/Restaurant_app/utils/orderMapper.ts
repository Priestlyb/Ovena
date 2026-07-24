import { Order } from "@/data/mockOrders";

export const mapBackendStatus = (status: string) => {
    switch (status) {
        case "pending":
        case "payment_pending":
            return "incoming";

        case "preparing":
            return "preparing";

        case "ready":
            return "ready";

        case "completed":
            return "completed";

        case "cancelled":
            return "rejected";

        default:
            return "incoming";
    }
};

export const mapActiveOrder = (o: any): Order => ({
    id: String(o.id),
    order_id: o.order_number,
    item_name: o.orderer__name || `Order #${o.id}`,
    price: o.last_event_metadata?.amount || 0,
    created_at: o.created_at,
    status: mapBackendStatus(o.status),
    type: "food",
    customer_name: o.orderer__name || "Customer",
    customer_phone: "N/A",
});