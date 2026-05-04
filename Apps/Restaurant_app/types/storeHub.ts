// types/storeHub.ts

export interface Branch {
    id: number;
    name: string;
    address: string;
    delivery_method: "instant" | "scheduled";
    final_order_time: string | null;
    pre_order_open_period: string | null;
    created_at: string;
    location: {
        latitude: number;
        longitude: number;
    };
}

export interface BranchHour {
    day: number;
    open_time: string;
    close_time: string;
    is_closed: boolean;
}