import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
} from "react-native";

import api from "@/services/apiClient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32;

// ✅ Helper
const buildDateRange = (key: string) => {
    const today = new Date();
    const start = new Date();

    if (key === "7d") start.setDate(today.getDate() - 7);
    if (key === "30d") start.setDate(today.getDate() - 30);
    if (key === "12m") start.setMonth(today.getMonth() - 12);

    const format = (date: Date) => date.toISOString().split("T")[0];

    return {
        from_date: format(start),
        to_date: format(today),
    };
};

export const useDashboardScreen = () => {
    const router = useRouter();

    const topRef = useRef<ScrollView>(null);
    const bottomRef = useRef<ScrollView>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [showSales, setShowSales] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState("7d");

    const [topCardIndex, setTopCardIndex] = useState(0);
    const [bottomCardIndex, setBottomCardIndex] = useState(0);

    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loadingDashboard, setLoadingDashboard] = useState(true);

    const [analysisData, setAnalysisData] = useState<any>(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(true);

    const [trendData, setTrendData] = useState<any[]>([]);
    const hasSetTrend = useRef(false);

    const isFirstDashboardLoad = useRef(true);
    const isFirstAnalysisLoad = useRef(true);

    const periods = [
        { key: "today", label: "Today" },
        { key: "7d", label: "7 Days" },
        { key: "30d", label: "30 Days" },
        { key: "12m", label: "12 Months" },
    ];


    const handleToggleOpen = async (value: boolean) => {
        if (updatingStatus) return;

        try {
            setUpdatingStatus(true);

            await api.post("/business/branches/close/all/", {
                is_closed: !value,
            });

            setIsOpen(value);
        } catch (error) {
            console.log("❌ Failed to update branch status:", error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    // =========================
    // DASHBOARD FETCH
    // =========================
    useEffect(() => {
        const fetchDashboardData = async () => {
            // only show skeleton on first load
            if (isFirstDashboardLoad.current) {
                setLoadingDashboard(true);
            }

            try {
                let params: Record<string, any> = {};

                if (selectedPeriod === "today") {
                    params.range = "today";
                } else {
                    const range = buildDateRange(selectedPeriod);
                    params = { range: "custom", ...range };
                }

                const response = await api.get("/business/dashboard/", { params });
                setDashboardData(response.data.data);
            } catch (error) {
                console.log("❌ Failed to fetch dashboard:", error);
            } finally {
                if (isFirstDashboardLoad.current) {
                    setLoadingDashboard(false);
                    isFirstDashboardLoad.current = false;
                }
            }
        };

        fetchDashboardData();
    }, [selectedPeriod]);

    // =========================
    // ANALYSIS FETCH
    // =========================
    useEffect(() => {
        const fetchAnalysis = async () => {
            if (isFirstAnalysisLoad.current) {
                setLoadingAnalysis(true);
            }

            try {
                let params: Record<string, any> = {};

                if (selectedPeriod === "today") {
                    params.range = "today";
                } else {
                    const range = buildDateRange(selectedPeriod);
                    params = { range: "custom", ...range };
                }

                const response = await api.get("/business/analysis/store/", { params });
                const data = response.data.data;

                setAnalysisData(data);

                if (!hasSetTrend.current) {
                    setTrendData(data.trend_revenue || []);
                    hasSetTrend.current = true;
                }
            } catch (error) {
                console.log("❌ Failed to fetch analysis:", error);
            } finally {
                if (isFirstAnalysisLoad.current) {
                    setLoadingAnalysis(false);
                    isFirstAnalysisLoad.current = false;
                }
            }
        };

        fetchAnalysis();
    }, [selectedPeriod]);

    // =========================
    // SCROLL HANDLERS
    // =========================
    const handleTopScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
        setTopCardIndex(index);
    };

    const handleBottomScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
        setBottomCardIndex(index);
    };

    const scrollToBottomCard = (index: number) => {
        bottomRef.current?.scrollTo({
            x: index * CARD_WIDTH,
            animated: true,
        });
        setBottomCardIndex(index);
    };

    return {
        router,

        isOpen,
        setIsOpen: handleToggleOpen,

        showSales,
        setShowSales,

        selectedPeriod,
        setSelectedPeriod,
        periods,

        data: dashboardData,
        loading: loadingDashboard,

        analysis: analysisData,
        loadingAnalysis,
        trendData,

        top: {
            ref: topRef,
            onScroll: handleTopScroll,
            CARD_WIDTH,
            index: topCardIndex,
        },

        bottom: {
            ref: bottomRef,
            onScroll: handleBottomScroll,
            CARD_WIDTH,
            index: bottomCardIndex,
        },

        bottomCardIndex,
        scrollToBottomCard,
    };
};