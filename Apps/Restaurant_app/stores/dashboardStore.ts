// stores/dashboardStore.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type DashboardCache = {
    dashboardData: any | null;
    analysisData: any | null;
    trendData: any[];
    lastFetched: number;
};

type PeriodKey = "today" | "7d" | "30d" | "12m";

type DashboardStore = {
    cache: Record<PeriodKey, DashboardCache>;

    setDashboardData: (
        period: PeriodKey,
        dashboardData: any
    ) => void;

    setAnalysisData: (
        period: PeriodKey,
        analysisData: any,
        trendData: any[]
    ) => void;

    getDashboardData: (
        period: PeriodKey
    ) => DashboardCache;

    clearCache: () => void;

    isCacheExpired: (
        period: PeriodKey,
        maxAge?: number
    ) => boolean;
};

const emptyCache = (): DashboardCache => ({
    dashboardData: null,
    analysisData: null,
    trendData: [],
    lastFetched: 0,
});

export const useDashboardStore = create<DashboardStore>()(
    persist(
        (set, get) => ({
            cache: {
                today: emptyCache(),
                "7d": emptyCache(),
                "30d": emptyCache(),
                "12m": emptyCache(),
            },

            setDashboardData: (period, dashboardData) =>
                set((state) => ({
                    cache: {
                        ...state.cache,
                        [period]: {
                            ...state.cache[period],
                            dashboardData,
                            lastFetched: Date.now(),
                        },
                    },
                })),

            setAnalysisData: (
                period,
                analysisData,
                trendData
            ) =>
                set((state) => ({
                    cache: {
                        ...state.cache,
                        [period]: {
                            ...state.cache[period],
                            analysisData,
                            trendData,
                            lastFetched: Date.now(),
                        },
                    },
                })),

            getDashboardData: (period) => {
                return get().cache[period];
            },

            clearCache: () =>
                set({
                    cache: {
                        today: emptyCache(),
                        "7d": emptyCache(),
                        "30d": emptyCache(),
                        "12m": emptyCache(),
                    },
                }),

            isCacheExpired: (
                period,
                maxAge = 30 * 60 * 1000
            ) => {
                const cached = get().cache[period];

                if (!cached.lastFetched) {
                    return true;
                }

                return (
                    Date.now() - cached.lastFetched >
                    maxAge
                );
            },
        }),
        {
            name: "dashboard-cache",

            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);