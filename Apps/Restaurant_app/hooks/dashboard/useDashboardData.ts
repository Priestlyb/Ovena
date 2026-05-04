import api from "@/services/apiClient";
import { useEffect, useState } from "react";

const buildDateRange = (key: string) => {
    const today = new Date();
    const start = new Date();

    if (key === "7d") start.setDate(today.getDate() - 7);
    if (key === "30d") start.setDate(today.getDate() - 30);
    if (key === "12m") start.setMonth(today.getMonth() - 12);

    const format = (date: Date) => date.toISOString().split("T")[0];

    return { from_date: format(start), to_date: format(today) };
};

export const useDashboardData = (selectedPeriod: string) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                let params: any = {};

                if (selectedPeriod === "today") {
                    params.range = "today";
                } else {
                    params = { range: "custom", ...buildDateRange(selectedPeriod) };
                }

                const res = await api.get("/business/dashboard/", { params });
                setData(res.data.data);
            } catch (e) {
                console.log("❌ dashboard:", e);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [selectedPeriod]);

    return { data, loading };
};