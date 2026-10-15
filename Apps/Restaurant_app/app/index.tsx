import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { useAuth } from "@/app/_layout";
import SplashScreen from "@/components/SplashScreen";
import { useOnboardingStore } from "@/stores/onboardingStore";

export default function Index() {
  const router = useRouter();

  const { width } = useWindowDimensions();

  const { token, profileType, isLoading } = useAuth();
  const { step, completed } = useOnboardingStore();

  const [showSplash, setShowSplash] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const imageAnim = useRef(new Animated.Value(20)).current;
  const imageScale = useRef(new Animated.Value(0.92)).current;

  const isSmall = width < 360;
  const isTablet = width >= 768;

  const responsive = {
    logoSize: isTablet ? 150 : isSmall ? 105 : 125,

    titleFont: isTablet ? 34 : isSmall ? 22 : 28,

    bodyFont: isTablet ? 18 : isSmall ? 14 : 16,

    buttonFont: isTablet ? 18 : 16,

    loginFont: isTablet ? 16 : 15,

    horizontalPadding: isTablet ? 60 : 28,

    topPadding: isTablet ? 48 : 32,
  };

  const getOnboardingRoute = (step: number) => {
    switch (step) {
      case 1:
        return "/superForm2";
      case 2:
        return "/superForm2/menu-items";
      case 3:
        return "/screens/business-verification";
      case 4:
        return "/(tabs)";
      default:
        return "/";
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),

        Animated.spring(imageAnim, {
          toValue: 0,
          friction: 7,
          tension: 45,
          useNativeDriver: true,
        }),

        Animated.spring(imageScale, {
          toValue: 1,
          friction: 7,
          tension: 45,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Background Decorations */}
        <View style={styles.orangeBlob} />
        <View style={styles.peachBlob} />

        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
        <View style={styles.bgCircle3} />

        <View style={styles.orangeBlob1} />
        <View style={styles.orangeBlob2} />

        <View style={styles.whiteGlow1} />
        <View style={styles.whiteGlow2} />

        <View style={styles.screen}>
          {/* Content */}
          <Animated.View
            style={[
              styles.content,
              {
                paddingHorizontal: responsive.horizontalPadding,
                paddingTop: responsive.topPadding,
              },
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim,
                  },
                ],
              },
            ]}
          >
            <Image
              source={require("../assets/images/Resturant_logo.png")}
              style={[
                styles.logo,
                {
                  width: responsive.logoSize,
                  height: responsive.logoSize,
                },
              ]}
            />

            <Text
              style={[
                styles.title,
                {
                  fontSize: responsive.titleFont,
                },
              ]}
            >
              Grow your Restaurant with Ovena
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: responsive.bodyFont,
                },
              ]}
            >
              Upload your menus, reach new customers, and boost your sales — all
              in one app.
            </Text>

            <TouchableOpacity
              style={styles.uploadButton}
              activeOpacity={0.85}
              onPress={() => {
                if (token && profileType === "businessadmin") {
                  if (!completed && step > 0) {
                    router.push(getOnboardingRoute(step));
                    return;
                  }
                }

                router.push("/screens/adminDetails");
              }}
            >
              <Text
                style={[
                  styles.uploadText,
                  {
                    fontSize: responsive.buttonFont,
                  },
                ]}
              >
                Upload Menu
              </Text>
            </TouchableOpacity>

            <Pressable onPress={() => router.push("/screens/Loginpage")}>
              <Text
                style={[
                  styles.loginText,
                  {
                    fontSize: responsive.loginFont,
                  },
                ]}
              >
                Already have an account?{"  "}
                <Text style={styles.loginLink}>Login</Text>
              </Text>
            </Pressable>
          </Animated.View>

          {/* Bottom Illustration */}
          <View style={styles.imageSection}>
            <Animated.Image
              source={require("../assets/images/Restaurant_homeImage.png")}
              style={[
                styles.homeImage,
                {
                  transform: [
                    {
                      translateY: imageAnim,
                    },
                    {
                      scale: imageScale,
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* =======================================================
     BACKGROUND DECORATION
  ======================================================= */

  orangeBlob: {
    position: "absolute",
    top: -120,
    right: -90,

    width: 280,
    height: 280,
    borderRadius: 140,

    backgroundColor: "rgba(255,255,255,0.10)",
  },

  peachBlob: {
    position: "absolute",
    bottom: 220,
    left: -80,

    width: 220,
    height: 220,
    borderRadius: 110,

    backgroundColor: "rgba(255,255,255,0.06)",
  },

  bgCircle1: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,

    top: -140,
    right: -120,

    backgroundColor: "rgba(255,255,255,0.08)",
  },

  bgCircle2: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,

    top: 140,
    left: -100,

    backgroundColor: "rgba(255,255,255,0.05)",
  },

  bgCircle3: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,

    bottom: 250,
    right: -40,

    backgroundColor: "rgba(255,255,255,0.06)",
  },

  orangeBlob1: {
    position: "absolute",

    width: 180,
    height: 180,

    borderRadius: 90,

    top: 240,
    right: -80,

    backgroundColor: "rgba(255,140,70,0.30)",

    transform: [
      {
        rotate: "25deg",
      },
    ],
  },

  orangeBlob2: {
    position: "absolute",

    width: 260,
    height: 260,

    borderRadius: 130,

    bottom: 110,
    left: -120,

    backgroundColor: "rgba(255,170,120,0.16)",

    transform: [
      {
        rotate: "-18deg",
      },
    ],
  },

  whiteGlow1: {
    position: "absolute",

    width: 120,
    height: 120,

    borderRadius: 60,

    top: 110,
    right: 55,

    backgroundColor: "rgba(255,255,255,0.14)",
  },

  whiteGlow2: {
    position: "absolute",

    width: 70,
    height: 70,

    borderRadius: 35,

    bottom: 340,
    left: 70,

    backgroundColor: "rgba(255,255,255,0.10)",
  },

  container: {
    flex: 1,
    backgroundColor: "#FF5920",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF5920",
  },

  scrollContent: {
    flexGrow: 1,
  },

  screen: {
    flex: 1,
    paddingTop: 10,
    minHeight: "100%",
    justifyContent: "space-between",
  },

  content: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    alignItems: "center",
    paddingBottom: 25,
  },

  logo: {
    resizeMode: "contain",
    marginBottom: 28,
  },

  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 16,
    maxWidth: 420,
  },

  subtitle: {
    color: "#FFF5F2",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 380,
    marginBottom: 36,
  },

  uploadButton: {
    width: "100%",
    maxWidth: 360,
    height: 58,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 6,
  },

  uploadText: {
    color: "#000000",
    fontWeight: "700",
  },

  loginText: {
    marginTop: 20,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "500",
  },

  loginLink: {
    color: "#FFFFFF",
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  imageSection: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  homeImage: {
    width: "100%",
    position: "relative",
    maxWidth: 650,
    aspectRatio: 1.08,
    resizeMode: "contain",
  },
});
