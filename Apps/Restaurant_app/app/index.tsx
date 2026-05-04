import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/app/_layout";
import SplashScreen from "@/components/SplashScreen";
import { useOnboardingStore } from "@/stores/onboardingStore";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();

  const { token, profileType, isLoading } = useAuth();
  const { step, completed } = useOnboardingStore();

  const [showSplash, setShowSplash] = useState(true);

  const getOnboardingRoute = (step: number) => {
    switch (step) {
      case 1:
        return "/superForm2";
      case 2:
        return "/superForm2/menu-items";
      case 3:
        return "/(tabs)";
      default:
        return "/";
    }
  };

  // ⏱ Show splash every time screen loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800); // adjust timing if needed

    return () => clearTimeout(timer);
  }, []);

  // ✅ Always show splash first
  if (showSplash) {
    return <SplashScreen />;
  }

  // ⏳ Still show loader while restoring session
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Content */}
      <View style={styles.content}>
        <Image
          style={styles.logo}
          source={require("../assets/images/Resturant_logo 1.png")}
        />

        <Text style={styles.text1}>Grow your Restaurant with Ovena</Text>

        <Text style={styles.text2}>
          Upload your menus, reach new customers, and boost your sales - all in
          one app
        </Text>

        <TouchableOpacity
          style={styles.upload}
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
          <Text style={styles.textupload}>Upload Menu</Text>
        </TouchableOpacity>

        <Pressable onPress={() => router.push("/screens/Loginpage")}>
          <Text style={styles.login}>Login to Account</Text>
        </Pressable>
      </View>

      {/* Bottom Image */}
      <View style={styles.homeImageCover}>
        <Image
          style={styles.homeImage}
          source={require("../assets/images/Restaurant_homeImage.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF5920",
    justifyContent: "space-between",
    alignItems: "center",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF5920",
  },

  content: {
    alignItems: "center",
    width: "100%",
    paddingTop: height * 0.08,
    paddingHorizontal: width * 0.08,
  },

  logo: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: "contain",
    marginBottom: height * 0.02,
  },

  text1: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: width * 0.05,
    textAlign: "center",
    marginBottom: 10,
  },

  text2: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: width * 0.035,
    textAlign: "center",
    marginBottom: height * 0.03,
  },

  upload: {
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: height * 0.015,
    marginBottom: 15,
  },

  textupload: {
    fontSize: width * 0.045,
    fontWeight: "600",
    textAlign: "center",
  },

  login: {
    color: "#ffffff",
    fontWeight: "600",
    marginTop: 10,
    fontSize: width * 0.035,
  },

  homeImageCover: {
    position: "absolute",
    bottom: 0,
    height: height * 0.35,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF5920",
  },

  homeImage: {
    position: "absolute",
    left: 0,
    bottom: -25,
    width: "85%",
    resizeMode: "contain",
  },
});
