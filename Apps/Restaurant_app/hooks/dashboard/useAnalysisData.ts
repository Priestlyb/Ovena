import api from "@/services/apiClient";
import { useEffect, useRef, useState } from "react";

export const useAnalysisData = (selectedPeriod: string) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [trendData, setTrendData] = useState<any[]>([]);
    const hasSetTrend = useRef(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                let params: any = {};

                if (selectedPeriod === "today") {
                    params.range = "today";
                } else {
                    const today = new Date();
                    const start = new Date();

                    if (selectedPeriod === "7d") start.setDate(today.getDate() - 7);
                    if (selectedPeriod === "30d") start.setDate(today.getDate() - 30);
                    if (selectedPeriod === "12m") start.setMonth(today.getMonth() - 12);

                    const format = (d: Date) => d.toISOString().split("T")[0];

                    params = {
                        range: "custom",
                        from_date: format(start),
                        to_date: format(today),
                    };
                }

                const res = await api.get("/business/analysis/store/", { params });
                const d = res.data.data;

                setData(d);

                if (!hasSetTrend.current) {
                    setTrendData(d.trend_revenue || []);
                    hasSetTrend.current = true;
                }
            } catch (e) {
                console.log("❌ analysis:", e);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [selectedPeriod]);

    return { data, loading, trendData };
};