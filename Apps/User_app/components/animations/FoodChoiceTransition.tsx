import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LottieView from "lottie-react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type TransitionType = "pickup" | "delivery";

interface FoodChoiceTransitionProps {
  type: TransitionType;
  onFinish: () => void;
}

const FoodChoiceTransition = ({
  type,
  onFinish,
}: FoodChoiceTransitionProps) => {
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const contentOpacity = useRef(new Animated.Value(0)).current;

  const contentScale = useRef(new Animated.Value(0.85)).current;

  const riderTranslateX = useRef(
    new Animated.Value(SCREEN_WIDTH + 250),
  ).current;

  const pickupTranslateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  const pickupScale = useRef(new Animated.Value(0.8)).current;

  const pickupRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let navigationTimer: ReturnType<typeof setTimeout> | undefined;

    /* ======================================================
       INITIAL APPEARANCE
    ====================================================== */

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.spring(contentScale, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();

    /* ======================================================
       DELIVERY
    ====================================================== */

    if (type === "delivery") {
      Animated.sequence([
        Animated.delay(220),

        Animated.timing(riderTranslateX, {
          toValue: -SCREEN_WIDTH - 300,
          duration: 2800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigationTimer = setTimeout(() => {
          onFinish();
        }, 100);
      });
    }

    /* ======================================================
       PICKUP
    ====================================================== */

    if (type === "pickup") {
      Animated.sequence([
        Animated.delay(180),

        Animated.parallel([
          Animated.timing(pickupTranslateX, {
            toValue: 0,
            duration: 850,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),

          Animated.spring(pickupScale, {
            toValue: 1,
            friction: 7,
            tension: 80,
            useNativeDriver: true,
          }),
        ]),

        Animated.delay(250),

        Animated.parallel([
          Animated.spring(pickupScale, {
            toValue: 1.08,
            friction: 5,
            tension: 120,
            useNativeDriver: true,
          }),

          Animated.sequence([
            Animated.timing(pickupRotation, {
              toValue: 1,
              duration: 120,
              useNativeDriver: true,
            }),

            Animated.timing(pickupRotation, {
              toValue: -1,
              duration: 120,
              useNativeDriver: true,
            }),

            Animated.timing(pickupRotation, {
              toValue: 0,
              duration: 120,
              useNativeDriver: true,
            }),
          ]),
        ]),

        Animated.spring(pickupScale, {
          toValue: 1,
          friction: 5,
          tension: 120,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigationTimer = setTimeout(() => {
          onFinish();
        }, 150);
      });
    }

    return () => {
      if (navigationTimer) {
        clearTimeout(navigationTimer);
      }
    };
  }, [
    type,
    onFinish,
    overlayOpacity,
    contentOpacity,
    contentScale,
    riderTranslateX,
    pickupTranslateX,
    pickupScale,
    pickupRotation,
  ]);

  const pickupRotate = pickupRotation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-3deg", "0deg", "3deg"],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: overlayOpacity,
        },
      ]}
    >
      <View style={styles.background}>
        {/* ==================================================
            BACKGROUND GLOW
        ================================================== */}

        <View style={styles.glowLarge} />

        <View style={styles.glowSmall} />

        <View style={styles.glowBottom} />

        {/* ==================================================
            TOP STATUS
        ================================================== */}

        <Animated.View
          style={[
            styles.statusContainer,
            {
              opacity: contentOpacity,
              transform: [
                {
                  scale: contentScale,
                },
              ],
            },
          ]}
        >
          <View style={styles.statusDot} />

          <Text style={styles.statusText}>
            {type === "delivery" ? "DELIVERY ACTIVATED" : "PICK-UP ACTIVATED"}
          </Text>
        </Animated.View>

        {/* ==================================================
            MAIN MESSAGE
        ================================================== */}

        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
              transform: [
                {
                  scale: contentScale,
                },
              ],
            },
          ]}
        >
          <Text style={styles.emoji}>{type === "delivery" ? "🛵" : "🛍️"}</Text>

          <Text style={styles.title}>
            {type === "delivery" ? "On the way." : "Almost ready."}
          </Text>

          <Text style={styles.subtitle}>
            {type === "delivery"
              ? "Your favourite food is coming to you."
              : "Your favourite food is waiting for you."}
          </Text>

          {/* Progress indicator */}
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </Animated.View>

        {/* ==================================================
            DELIVERY RIDER
        ================================================== */}

        {type === "delivery" && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.riderContainer,
              {
                transform: [
                  {
                    translateX: riderTranslateX,
                  },
                ],
              },
            ]}
          >
            <LottieView
              source={require("@/assets/animations/delivery-rider.json")}
              autoPlay
              loop={false}
              speed={0.5}
              style={styles.rider}
            />
          </Animated.View>
        )}

        {/* ==================================================
            PICKUP CUSTOMER
        ================================================== */}

        {type === "pickup" && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pickupContainer,
              {
                transform: [
                  {
                    translateX: pickupTranslateX,
                  },
                  {
                    scale: pickupScale,
                  },
                  {
                    rotate: pickupRotate,
                  },
                ],
              },
            ]}
          >
            <LottieView
              source={require("@/assets/animations/food-pickup.json")}
              autoPlay
              loop={false}
              style={styles.pickup}
            />
          </Animated.View>
        )}

        {/* ==================================================
            BOTTOM BRANDING
        ================================================== */}

        <View style={styles.bottomContainer}>
          <Text style={styles.brand}>OVENA</Text>

          <Text style={styles.bottomText}>Tap it. Track it. Taste it.</Text>
        </View>
      </View>
    </Animated.View>
  );
};

/* ======================================================
   STYLES
====================================================== */

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    zIndex: 9999,

    elevation: 9999,
  },

  background: {
    flex: 1,

    backgroundColor: "#FFD56A",

    alignItems: "center",

    justifyContent: "center",

    overflow: "hidden",
  },

  /* ======================================================
     BACKGROUND GLOW
  ====================================================== */

  glowLarge: {
    position: "absolute",

    width: SCREEN_WIDTH * 1.25,
    height: SCREEN_WIDTH * 1.25,

    borderRadius: SCREEN_WIDTH,

    backgroundColor: "rgba(255,255,255,0.10)",

    top: -SCREEN_WIDTH * 0.55,
    right: -SCREEN_WIDTH * 0.45,
  },

  glowSmall: {
    position: "absolute",

    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,

    borderRadius: SCREEN_WIDTH,

    backgroundColor: "rgba(217,80,46,0.08)",

    top: SCREEN_HEIGHT * 0.28,
    left: -SCREEN_WIDTH * 0.38,
  },

  glowBottom: {
    position: "absolute",

    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.85,

    borderRadius: SCREEN_WIDTH,

    backgroundColor: "rgba(255,255,255,0.08)",

    bottom: -SCREEN_WIDTH * 0.5,
    right: -SCREEN_WIDTH * 0.35,
  },

  /* ======================================================
     STATUS
  ====================================================== */

  statusContainer: {
    position: "absolute",

    top: 70,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 30,

    backgroundColor: "rgba(255,255,255,0.28)",

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.4)",
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: 10,

    backgroundColor: "#D9502E",

    marginRight: 7,
  },

  statusText: {
    color: "#6A442B",

    fontSize: 9,

    fontWeight: "800",

    letterSpacing: 1.5,
  },

  /* ======================================================
     MAIN CONTENT
  ====================================================== */

  content: {
    position: "absolute",

    top: SCREEN_HEIGHT * 0.22,

    width: "100%",

    alignItems: "center",

    zIndex: 5,
  },

  emoji: {
    fontSize: 55,

    marginBottom: 12,
  },

  title: {
    color: "#432312",

    fontSize: 40,

    fontWeight: "900",

    letterSpacing: -1.5,

    textAlign: "center",
  },

  subtitle: {
    color: "#6A442B",

    fontSize: 13,

    fontWeight: "500",

    textAlign: "center",

    lineHeight: 20,

    marginTop: 7,

    paddingHorizontal: 40,
  },

  /* ======================================================
     PROGRESS
  ====================================================== */

  progressTrack: {
    width: 90,

    height: 4,

    borderRadius: 10,

    backgroundColor: "rgba(106,68,43,0.15)",

    overflow: "hidden",

    marginTop: 24,
  },

  progressFill: {
    width: "65%",

    height: "100%",

    borderRadius: 10,

    backgroundColor: "#D9502E",
  },

  /* ======================================================
     DELIVERY RIDER
  ====================================================== */

  riderContainer: {
    position: "absolute",

    bottom: SCREEN_HEIGHT * 0.17,

    left: 0,

    width: SCREEN_WIDTH + 250,

    alignItems: "center",

    zIndex: 20,
  },

  rider: {
    width: 260,

    height: 260,
  },

  /* ======================================================
     PICKUP CUSTOMER
  ====================================================== */

  pickupContainer: {
    position: "absolute",

    bottom: SCREEN_HEIGHT * 0.16,

    left: 0,

    width: SCREEN_WIDTH,

    alignItems: "center",

    zIndex: 20,
  },

  pickup: {
    width: 280,

    height: 280,
  },

  /* ======================================================
     BOTTOM BRANDING
  ====================================================== */

  bottomContainer: {
    position: "absolute",

    bottom: 55,

    alignItems: "center",
  },

  brand: {
    color: "#D9502E",

    fontSize: 13,

    fontWeight: "900",

    letterSpacing: 5,

    marginBottom: 5,
  },

  bottomText: {
    color: "#795238",

    fontSize: 10,

    fontWeight: "500",

    letterSpacing: 0.3,
  },
});

export default FoodChoiceTransition;
