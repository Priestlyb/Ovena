// hooks/Dashboard/useDashboardCarousel.ts

import { useRef, useState } from "react";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
} from "react-native";

import { CARD_WIDTH } from "@/constants/staffDashboardTab.styles";

export default function useDashboardCarousel() {
    const scrollViewRef = useRef<ScrollView>(null);

    const [showSales, setShowSales] = useState(true);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState("Today");

    const getData = (period: string) => {
        switch (period) {
            case "Today":
                return { revenue: 12000, orders: 8, shipments: 5 };

            case "7 Days":
                return { revenue: 45000, orders: 30, shipments: 18 };

            case "30 Days":
                return { revenue: 120000, orders: 75, shipments: 50 };

            case "12 Months":
                return { revenue: 850000, orders: 420, shipments: 310 };

            default:
                return { revenue: 0, orders: 0, shipments: 0 };
        }
    };

    const data = getData(selectedPeriod);

    const handleScroll = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / CARD_WIDTH);

        setCurrentCardIndex(index);
    };

    const scrollToCard = (index: number) => {
        scrollViewRef.current?.scrollTo({
            x: index * CARD_WIDTH,
            animated: true,
        });

        setCurrentCardIndex(index);
    };

    return {
        scrollViewRef,
        showSales,
        setShowSales,
        currentCardIndex,
        selectedPeriod,
        setSelectedPeriod,
        handleScroll,
        scrollToCard,
        data,
    };
}