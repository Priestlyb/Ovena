import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";

import { useTheme } from "@/constants/theme";

const { width } = Dimensions.get("window");

const ads = [
  { text: "🍔 Craving something delicious?", color: "#F97316" },
  { text: "⚡ Fresh meals delivered in minutes", color: "#22C55E" },
  { text: "🎉 Save more with today's special offers", color: "#EC4899" },
  { text: "🔥 Trending restaurants near you", color: "#EF4444" },
  { text: "🥘 Your next favorite meal awaits", color: "#8B5CF6" },
  { text: "🚚 Delivery fees from ₦0 on selected stores", color: "#06B6D4" },
  { text: "💯 Fresh, fast, and affordable", color: "#10B981" },
  { text: "⭐ Rated 4.5★ and above", color: "#EAB308" },
];

const loopAds = [...ads, ...ads];
const STEP = width;

export default function StickyAdBanner() {
  const theme = useTheme();

  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const negativeTranslateX = useMemo(
    () => Animated.multiply(translateX, -1),
    [translateX],
  );

  const indexRef = useRef(0);
  const mountedRef = useRef(true);

  const fadeOutRef = useRef<Animated.CompositeAnimation | null>(null);
  const fadeInRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    const interval = setInterval(() => {
      if (!mountedRef.current) return;

      indexRef.current += 1;

      fadeOutRef.current = Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      });

      fadeOutRef.current.start(({ finished }) => {
        if (!finished || !mountedRef.current) return;

        translateX.setValue(indexRef.current * STEP);

        fadeInRef.current = Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        });

        fadeInRef.current.start();

        if (indexRef.current >= ads.length) {
          indexRef.current = 0;
          translateX.setValue(0);
        }
      });
    }, 5000);

    return () => {
      mountedRef.current = false;

      clearInterval(interval);

      fadeOutRef.current?.stop();
      fadeInRef.current?.stop();
    };
  }, [opacity, translateX]);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.row,
          {
            transform: [{ translateX: negativeTranslateX }],
            opacity,
          },
        ]}
      >
        {loopAds.map((item, index) => (
          <View
            key={index}
            style={[
              styles.bannerItem,
              {
                backgroundColor: item.color,
              },
            ]}
          >
            <Text style={styles.text}>{item.text}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    zIndex: 999,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
  },

  bannerItem: {
    width,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
