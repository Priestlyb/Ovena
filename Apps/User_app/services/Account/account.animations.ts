import { Animated, Easing } from "react-native";

export const useAccountAnimations = () => {
    const scaleAnim = new Animated.Value(1);
    const underlineAnim = new Animated.Value(0);

    const animateFocus = () => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1.03,
                duration: 200,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(underlineAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const animateBlur = () => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(underlineAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    };

    return {
        scaleAnim,
        underlineAnim,
        animateFocus,
        animateBlur,
    };
};