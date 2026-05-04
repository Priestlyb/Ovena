import { useRef, useState } from "react";
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

export const useCarousel = () => {
    const ref = useRef<ScrollView>(null);
    const [index, setIndex] = useState(0);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const i = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
        setIndex(i);
    };

    const scrollTo = (i: number) => {
        ref.current?.scrollTo({ x: i * CARD_WIDTH, animated: true });
        setIndex(i);
    };

    return { ref, index, onScroll, scrollTo, CARD_WIDTH };
};