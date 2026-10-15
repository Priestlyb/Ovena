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
    const [selectedPeriod, setSelectedPeriod] = useState("today");

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
    };
}