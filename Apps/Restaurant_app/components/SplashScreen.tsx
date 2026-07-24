import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  View,
} from "react-native";

import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),

      Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 12000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
    ]).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* Background SVG */}
      <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FF7B3A" />
            <Stop offset="100%" stopColor="#F65513" />
          </LinearGradient>

          <LinearGradient id="blob" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
          </LinearGradient>
        </Defs>

        <Rect width="100%" height="100%" fill="url(#bg)" />

        <Ellipse
          cx={width * 0.2}
          cy={height * 0.15}
          rx={160}
          ry={110}
          fill="url(#blob)"
        />

        <Ellipse
          cx={width * 0.85}
          cy={height * 0.25}
          rx={130}
          ry={90}
          fill="url(#blob)"
        />

        <Circle
          cx={width * 0.85}
          cy={height * 0.12}
          r="18"
          fill="white"
          opacity={0.15}
        />

        <Circle
          cx={width * 0.12}
          cy={height * 0.72}
          r="10"
          fill="white"
          opacity={0.2}
        />

        <Circle
          cx={width * 0.82}
          cy={height * 0.62}
          r="14"
          fill="white"
          opacity={0.12}
        />

        <Path
          d={`
            M0 ${height - 170}
            Q ${width / 2} ${height - 250}
            ${width} ${height - 150}
            L ${width} ${height}
            L0 ${height}
            Z
          `}
          fill="rgba(255,255,255,0.08)"
        />
      </Svg>

      <Animated.View
        style={[
          styles.glow,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fade,
            transform: [{ scale }],
          },
        ]}
      >
        <Image
          source={require("../assets/images/Resturant_logo.png")}
          style={styles.logo}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F65513",
    justifyContent: "center",
    alignItems: "center",
  },

  glow: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.18)",
  },

  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: width * 0.48,
    height: width * 0.48,
    resizeMode: "contain",
  },
});
