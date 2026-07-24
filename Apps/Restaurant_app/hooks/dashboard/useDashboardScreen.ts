import { useDashboardStore } from "@/stores/dashboardStore";
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

type PeriodKey = "today" | "7d" | "30d" | "12m";

// =========================
// Helper
// =========================
const buildDateRange = (key: PeriodKey) => {
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

    const [showSales, setShowSales] = useState(true);

    const [selectedPeriod, setSelectedPeriod] =
        useState<PeriodKey>("7d");

    const [topCardIndex, setTopCardIndex] = useState(0);
    const [bottomCardIndex, setBottomCardIndex] = useState(0);

    const [loadingDashboard, setLoadingDashboard] =
        useState(true);

    const [loadingAnalysis, setLoadingAnalysis] =
        useState(true);

    const {
        getDashboardData,
        setDashboardData,
        setAnalysisData,
        isCacheExpired,
    } = useDashboardStore();

    const cached = getDashboardData(selectedPeriod);

    const dashboardData = cached.dashboardData;
    const analysisData = cached.analysisData;
    const trendData = cached.trendData;

    const periods = [
        { key: "today", label: "Today" },
        { key: "7d", label: "7 Days" },
        { key: "30d", label: "30 Days" },
        { key: "12m", label: "12 Months" },
    ];

    const getParams = () => {
        if (selectedPeriod === "today") {
            return { range: "today" };
        }

        return {
            range: "custom",
            ...buildDateRange(selectedPeriod),
        };
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            const expired = isCacheExpired(selectedPeriod);

            // Show cached data immediately
            if (dashboardData) {
                setLoadingDashboard(false);

                // Cache still valid
                if (!expired) {
                    return;
                }

                // Otherwise continue to refresh silently
            } else {
                setLoadingDashboard(true);
            }

            try {
                const response = await api.get(
                    "/business/dashboard/",
                    {
                        params: getParams(),
                    }
                );

                setDashboardData(
                    selectedPeriod,
                    response.data.data
                );
            } catch (error) {
                console.log(
                    "❌ Failed to fetch dashboard:",
                    error
                );
            } finally {
                setLoadingDashboard(false);
            }
        };

        const fetchAnalysis = async () => {
            const expired = isCacheExpired(selectedPeriod);

            // Show cached data immediately
            if (analysisData) {
                setLoadingAnalysis(false);

                if (!expired) {
                    return;
                }
            } else {
                setLoadingAnalysis(true);
            }

            try {
                const response = await api.get(
                    "/business/analysis/store/",
                    {
                        params: getParams(),
                    }
                );

                const data = response.data.data;

                setAnalysisData(
                    selectedPeriod,
                    data,
                    data.trend_revenue ?? []
                );
            } catch (error) {
                console.log(
                    "❌ Failed to fetch analysis:",
                    error
                );
            } finally {
                setLoadingAnalysis(false);
            }
        };

        fetchDashboardData();
        fetchAnalysis();
    }, [
        selectedPeriod,
        dashboardData,
        analysisData,
        isCacheExpired,
        setDashboardData,
        setAnalysisData,
    ]);

    // =========================
    // Scroll Handlers
    // =========================

    const handleTopScroll = (
        e: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const index = Math.round(
            e.nativeEvent.contentOffset.x / CARD_WIDTH
        );

        setTopCardIndex(index);
    };

    const handleBottomScroll = (
        e: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const index = Math.round(
            e.nativeEvent.contentOffset.x / CARD_WIDTH
        );

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