import { useEffect, useRef } from "react";
import { Animated } from "react-native";

type Props = {
  categories?: any[];
  topPicks?: any[];
  recentlyVisited?: any[];
};

export const useHomepageAnimations = ({
  categories = [],
  topPicks = [],
  recentlyVisited = [],
}: Props) => {
  /* =========================
     GLOBAL ANIMATIONS
  ========================= */

  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  /* =========================
     ITEM ANIMATIONS
  ========================= */

  const categoryAnim = useRef<Animated.Value[]>([]);
  const recentlyAnim = useRef<Animated.Value[]>([]);
  const topPicksAnim = useRef<Animated.Value[]>([]);

  /**
   * Never recreate existing Animated.Values.
   * Only append/remove values as needed.
   */
  const syncAnimations = (
    values: React.MutableRefObject<Animated.Value[]>,
    length: number
  ) => {
    // add missing values
    while (values.current.length < length) {
      values.current.push(new Animated.Value(0));
    }

    // remove extras
    if (values.current.length > length) {
      values.current.length = length;
    }
  };

  /* =========================
     KEEP ARRAYS IN SYNC
  ========================= */

  useEffect(() => {
    syncAnimations(categoryAnim, categories.length);
  }, [categories.length]);

  useEffect(() => {
    syncAnimations(recentlyAnim, recentlyVisited.length);
  }, [recentlyVisited.length]);

  useEffect(() => {
    syncAnimations(topPicksAnim, topPicks.length);
  }, [topPicks.length]);

  /* =========================
     PAGE ANIMATION
  ========================= */

  useEffect(() => {
    slideAnim.setValue(30);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* =========================
     CATEGORY ANIMATION
  ========================= */

  useEffect(() => {
    categoryAnim.current.forEach((anim) => anim.setValue(0));

    Animated.stagger(
      100,
      categoryAnim.current.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [categories.length]);

  /* =========================
     RECENTLY VISITED
  ========================= */

  useEffect(() => {
    recentlyAnim.current.forEach((anim) => anim.setValue(0));

    Animated.stagger(
      100,
      recentlyAnim.current.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [recentlyVisited.length]);

  /* =========================
     TOP PICKS
  ========================= */

  useEffect(() => {
    topPicksAnim.current.forEach((anim) => anim.setValue(0));

    Animated.stagger(
      100,
      topPicksAnim.current.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [topPicks.length]);

  return {
    slideAnim,
    fadeAnim,
    scaleAnim,
    categoryAnim: categoryAnim.current,
    recentlyAnim: recentlyAnim.current,
    topPicksAnim: topPicksAnim.current,
  };
};