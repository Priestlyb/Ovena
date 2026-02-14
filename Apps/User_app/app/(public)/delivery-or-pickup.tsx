import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import Svg, { Path, Text as SvgText, TextPath } from "react-native-svg";
import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");

export default function FoodDeliveryChoiceScreen() {
  const { authStatus } = useAuth();

  // Animations
  const leftOptionX = useRef(new Animated.Value(-200)).current;
  const rightOptionX = useRef(new Animated.Value(200)).current;
  const optionScale = useRef(new Animated.Value(0.6)).current;

  const logoY = useRef(new Animated.Value(-150)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(40)).current;

  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.spring(leftOptionX, { toValue: 0, useNativeDriver: true, damping: 10 }),
      Animated.spring(rightOptionX, { toValue: 0, useNativeDriver: true, damping: 10 }),
      Animated.spring(optionScale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(logoY, { toValue: 0, useNativeDriver: true, damping: 8 }),
      Animated.spring(logoScale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(textOpacity, { toValue: 1, duration: 900, delay: 600, useNativeDriver: true }),
      Animated.timing(textY, { toValue: 0, duration: 900, delay: 600, easing: Easing.out(Easing.exp), useNativeDriver: true }),
    ]).start();

    // Floating loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // ✅ Navigation handler
  const handleOptionPress = () => {
    if (authStatus === "authenticated") {
      router.replace("/(tabs)/homepage"); // go straight to homepage if logged in
    } else {
      router.replace("/login"); // otherwise go to login
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsRow}>
        {/* Pick-up */}
        <Animated.View
          style={{ transform: [{ translateX: leftOptionX }, { scale: optionScale }, { translateY: floatAnim }] }}
        >
          <TouchableOpacity style={styles.option} onPress={handleOptionPress}>
            <Svg width={120} height={100} viewBox="20 -30 120 60">
              <Path id="pickupCurve" d="M 10 50 A 50 50 0 0 1 110 50" fill="transparent" />
              <SvgText fill="#E53935" fontSize={27} fontWeight="700">
                <TextPath href="#pickupCurve" startOffset="30%" textAnchor="middle">
                  Pick-up
                </TextPath>
              </SvgText>
            </Svg>
            <Image source={require("../../assets/images/Pickup.png")} style={styles.optionImageRight} />
          </TouchableOpacity>
        </Animated.View>

        {/* Delivery */}
        <Animated.View
          style={{ transform: [{ translateX: rightOptionX }, { scale: optionScale }, { translateY: floatAnim }] }}
        >
          <TouchableOpacity style={styles.option} onPress={handleOptionPress}>
            <Svg width={145} height={100} viewBox="38 -4 80 25">
              <Path id="deliveryCurve" d="M 10 50 A 50 50 0 0 1 110 50" fill="transparent" />
              <SvgText fill="#E53935" fontSize={17} fontWeight="700" transform="rotate(-80 80 30)">
                <TextPath href="#deliveryCurve" startOffset="60%" textAnchor="middle">
                  Delivery
                </TextPath>
              </SvgText>
            </Svg>
            <View style={styles.optionImageCover}>
              <Image source={require("../../assets/images/Delivery.png")} style={styles.optionImageLeft} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Logo and Text */}
      <Animated.View style={[styles.logoWrapper, { transform: [{ translateY: logoY }, { scale: logoScale }] }]}>
        <Image source={require("../../assets/images/DeliveryOrPickUpLogo.png")} style={styles.logo} />
        <Animated.View style={{ alignItems: "center", marginTop: 10, opacity: textOpacity, transform: [{ translateY: textY }] }}>
          <Svg width={350} height={300} viewBox="55 55 90 150">
            <Path id="bottomCurve" d="M 20 20 A 130 100 0 0 0 280 20" fill="transparent" />
            <SvgText fill="#D9502E" fontSize={28} fontWeight="800" letterSpacing={1}>
              <TextPath href="#bottomCurve" startOffset="27%" textAnchor="middle">
                Food Delivery
              </TextPath>
            </SvgText>
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4D34F", alignItems: "center", justifyContent: "center" },
  logoWrapper: { alignItems: "center" },
  logo: { width: 150, height: 150, resizeMode: "contain" },
  optionsRow: { flexDirection: "row", gap: 100, marginTop: 10 },
  option: { alignItems: "center" },
  optionImageCover: { transform: [{ rotate: "-180deg" }] },
  optionImageRight: {
    width: width * 0.28,
    height: width * 0.28,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 100,
    shadowColor: "#000000",
    shadowOffset: { width: 10, height: -3 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  optionImageLeft: {
    width: width * 0.28,
    height: width * 0.28,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 100,
    shadowColor: "#000000",
    shadowOffset: { width: 10, height: -3 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
    transform: [{ rotate: "-90deg" }],
  },
});
