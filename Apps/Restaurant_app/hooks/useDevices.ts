import api from "@/services/apiClient";
import { useState } from "react";

export const useDevices = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDevices = async () => {
        try {
            setLoading(true);

            const res = await api.get("/business/staff/list");

            const raw = res.data?.results?.data || [];

            const mapped = raw.map((item: any) => ({
                id: String(item.id),
                name: item.device_name || item.name || "Unknown Device",
                lastActive: item.last_active || "Recently",
                branch_id: item.branch_id
                    ? String(item.branch_id)
                    : undefined,
            }));

            setDevices(mapped);
        } catch (err) {
            console.log("❌ Fetch Devices Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return { devices, loading, fetchDevices };
};