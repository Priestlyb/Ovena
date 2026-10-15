import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { homepageStyles as styles } from "@/constants/styles/homepageStyles";
import { JELLOF_IMAGE } from "@/constants/homepage/homepageImages";
import { useTheme } from "@/constants/theme";

type PromoItem = {
  id: string;
  title: string;
  subtitle: string;
  image: any;
  colors: [string, string];
};

const DATA: PromoItem[] = [
  {
    id: "1",
    title: "Grab our exclusive",
    subtitle: "Food Discount now!",
    image: JELLOF_IMAGE,
    colors: ["#D9502E", "#FDBA2D"],
  },
  {
    id: "2",
    title: "Weekend Specials",
    subtitle: "Up to 40% off meals",
    image: JELLOF_IMAGE,
    colors: ["#1D976C", "#93F9B9"],
  },
  {
    id: "3",
    title: "Free Delivery",
    subtitle: "On your first order today",
    image: JELLOF_IMAGE,
    colors: ["#396AFc", "#414355"],
  },
];

/**
 * Infinite loop:
 *
 * [last, A, B, C, first]
 */
const LOOP_DATA = [DATA[DATA.length - 1], ...DATA, DATA[0]];

type Props = {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
};

export default function PromoCard({ fadeAnim, slideAnim }: Props) {
  const theme = useTheme();

  const { width: screenWidth } = useWindowDimensions();

  /**
   * Horizontal spacing around the card.
   */
  const horizontalPadding = 20;

  /**
   * Actual width of each carousel item.
   */
  const itemWidth = screenWidth;

  /**
   * Responsive values.
   */
  const isSmallScreen = screenWidth < 360;
  const isLargeScreen = screenWidth >= 600;

  const imageSize = isSmallScreen ? 145 : isLargeScreen ? 210 : 175;

  const cardHeight = isSmallScreen ? 165 : isLargeScreen ? 210 : 180;

  const titleSize = isSmallScreen ? 14 : isLargeScreen ? 18 : 16;

  const subtitleSize = isSmallScreen ? 17 : isLargeScreen ? 22 : 19;

  const flatListRef = useRef<FlatList<PromoItem>>(null);

  const indexRef = useRef(1);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isMounted = useRef(true);

  const isInteracting = useRef(false);

  const safeScrollToIndex = useCallback((index: number, animated: boolean) => {
    if (!isMounted.current) return;

    try {
      flatListRef.current?.scrollToIndex({
        index,
        animated,
      });
    } catch {
      // Ignore if FlatList hasn't measured yet.
    }
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();

    timerRef.current = setInterval(() => {
      if (!isMounted.current) return;

      if (isInteracting.current) return;

      indexRef.current += 1;

      safeScrollToIndex(indexRef.current, true);
    }, 4000);
  }, [safeScrollToIndex, stopAutoPlay]);

  useEffect(() => {
    isMounted.current = true;

    startAutoPlay();

    return () => {
      isMounted.current = false;

      stopAutoPlay();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [startAutoPlay, stopAutoPlay]);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;

    const index = Math.round(offsetX / itemWidth);

    indexRef.current = index;

    /**
     * User reached the cloned LAST item.
     *
     * [last, A, B, C, first]
     *
     * Move silently back to A.
     */
    if (index === LOOP_DATA.length - 1) {
      const resetIndex = 1;

      indexRef.current = resetIndex;

      timeoutRef.current = setTimeout(() => {
        safeScrollToIndex(resetIndex, false);
      }, 0);
    }

    /**
     * User reached the cloned FIRST item.
     *
     * Move silently back to C.
     */
    else if (index === 0) {
      const resetIndex = DATA.length;

      indexRef.current = resetIndex;

      timeoutRef.current = setTimeout(() => {
        safeScrollToIndex(resetIndex, false);
      }, 0);
    }

    isInteracting.current = false;

    startAutoPlay();
  };

  const renderItem = ({ item }: { item: PromoItem }) => (
    <Animated.View
      style={[
        styles.wrapper,
        {
          width: itemWidth,
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim,
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={item.colors}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.promoCard,
          {
            height: cardHeight,
          },
        ]}
      >
        {/* ================= LEFT CONTENT ================= */}

        <View style={styles.left}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            style={[
              styles.title,
              {
                fontSize: titleSize,
              },
            ]}
          >
            {item.title}
          </Text>

          <Text
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            style={[
              styles.subtitle,
              {
                fontSize: subtitleSize,
                lineHeight: subtitleSize + 5,
              },
            ]}
          >
            {item.subtitle}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.button,
              {
                backgroundColor: theme.background,
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: theme.textPrimary,
                },
              ]}
            >
              Order Now!
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= IMAGE ================= */}

        <Animated.Image
          source={item.image}
          resizeMode="contain"
          style={[
            styles.jellofimage,
            {
              width: imageSize,
              height: imageSize,

              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        />
      </LinearGradient>
    </Animated.View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={LOOP_DATA}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      horizontal
      pagingEnabled
      initialScrollIndex={1}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      getItemLayout={(_, index) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index,
      })}
      onTouchStart={() => {
        isInteracting.current = true;
        stopAutoPlay();
      }}
      onMomentumScrollEnd={handleMomentumEnd}
      onScrollToIndexFailed={() => {
        // Prevent RedBox if item isn't measured yet.
      }}
    />
  );
}
