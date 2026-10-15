import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { useTheme } from "@/constants/theme";

type SignupBannerProps = {
  title?: string;
  subtitle?: string;
  image?: any;
  ovenaimage?: any;
  Vegesimage?: any;
};

const DEFAULT_TITLE = `A Few Questions\nto Help Us Create\nYour Perfect Meal`;

const DEFAULT_SUBTITLE =
  "Tell us a little about yourself so we can personalize your experience.";

export default function SignupBanner({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  image = require("@/assets/images/signupBanner.png"),
  ovenaimage = require("@/assets/images/ovenaBanner.png"),
  Vegesimage = require("@/assets/images/Veges.png"),
}: SignupBannerProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const styles = createStyles(theme, width);

  return (
    <View style={styles.banner}>
      {/* -------------------------------------------------
       * Decorative Background
       * ------------------------------------------------- */}

      <View style={styles.decorCircleLarge} />
      <View style={styles.decorCircleSmall} />
      <View style={styles.decorAccent} />

      {/* -------------------------------------------------
       * Header / Logo
       * ------------------------------------------------- */}

      <View style={styles.logoContainer}>
        <Image
          source={ovenaimage}
          style={styles.ovenaBannerImage}
          resizeMode="contain"
        />
      </View>

      {/* -------------------------------------------------
       * Main Content
       *
       * IMPORTANT:
       * This sits above the chef artwork.
       * ------------------------------------------------- */}

      <View style={styles.content}>
        <View style={styles.textCol}>
          <View style={styles.eyebrowContainer}>
            <View style={styles.eyebrowDot} />

            <Text style={styles.eyebrow}>LET'S GET TO KNOW YOU</Text>
          </View>

          <Text style={styles.headline}>{title}</Text>

          <Text style={styles.subtext}>{subtitle}</Text>
        </View>
      </View>

      {/* -------------------------------------------------
       * Chef Artwork
       *
       * The image is anchored to the bottom of the
       * banner but intentionally extends below it.
       *
       * It stays BELOW the text content.
       * ------------------------------------------------- */}

      <Image source={image} style={styles.bannerImage} resizeMode="contain" />

      {/* -------------------------------------------------
       * Vegetable Artwork
       * ------------------------------------------------- */}

      <Image
        source={Vegesimage}
        style={styles.VegesImage}
        resizeMode="contain"
      />

      {/* -------------------------------------------------
       * Bottom Decorative Line
       * ------------------------------------------------- */}

      <View style={styles.bottomAccent} />
    </View>
  );
}

const createStyles = (theme: any, width: number) => {
  const isSmallScreen = width < 375;

  return StyleSheet.create({
    /* -------------------------------------------------
     * Banner
     * ------------------------------------------------- */

    banner: {
      position: "relative",

      /*
       * Allow the chef artwork to extend below
       * the bottom edge of the banner.
       */
      overflow: "visible",

      minHeight: isSmallScreen ? 390 : 430,

      backgroundColor: theme.primary,

      paddingTop: isSmallScreen ? 28 : 34,
      paddingHorizontal: 24,
      paddingBottom: 0,

      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,

      elevation: 5,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.12,
      shadowRadius: 12,

      zIndex: 2,
    },

    /* -------------------------------------------------
     * Decorative Background
     * ------------------------------------------------- */

    decorCircleLarge: {
      position: "absolute",

      width: 260,
      height: 260,

      borderRadius: 130,

      right: -115,
      top: -85,

      backgroundColor: "rgba(255,255,255,0.06)",

      zIndex: 0,
    },

    decorCircleSmall: {
      position: "absolute",

      width: 130,
      height: 130,

      borderRadius: 65,

      left: -75,
      bottom: 45,

      backgroundColor: "rgba(255,255,255,0.05)",

      zIndex: 0,
    },

    decorAccent: {
      position: "absolute",

      width: 90,
      height: 90,

      borderRadius: 45,

      right: 115,
      top: 125,

      backgroundColor: "rgba(255,255,255,0.035)",

      zIndex: 0,
    },

    /* -------------------------------------------------
     * Logo
     * ------------------------------------------------- */

    logoContainer: {
      width: "100%",

      alignItems: "flex-start",

      zIndex: 20,
    },

    ovenaBannerImage: {
      width: isSmallScreen ? 125 : 145,
      height: isSmallScreen ? 70 : 78,
    },

    /* -------------------------------------------------
     * Main Content
     *
     * Higher zIndex than bannerImage.
     *
     * This guarantees that:
     *
     *   Text
     *      ↓
     *   Chef Image
     *
     * instead of the chef covering the text.
     * ------------------------------------------------- */

    content: {
      width: "67%",

      marginTop: isSmallScreen ? 8 : 12,

      zIndex: 20,

      elevation: 20,
    },

    textCol: {
      paddingRight: 4,

      zIndex: 20,
    },

    eyebrowContainer: {
      flexDirection: "row",

      alignItems: "center",

      marginBottom: 10,

      zIndex: 20,
    },

    eyebrowDot: {
      width: 6,
      height: 6,

      borderRadius: 3,

      backgroundColor: "#FFFFFF",

      marginRight: 7,

      opacity: 0.9,
    },

    eyebrow: {
      fontSize: 9,

      fontWeight: "800",

      letterSpacing: 1.1,

      color: "#FFFFFF",

      opacity: 0.78,
    },

    headline: {
      fontSize: isSmallScreen ? 24 : 27,

      fontWeight: "800",

      lineHeight: isSmallScreen ? 31 : 34,

      letterSpacing: -0.5,

      color: "#FFFFFF",

      zIndex: 20,
    },

    /* -------------------------------------------------
     * Subtitle
     *
     * IMPORTANT:
     * Do NOT use zIndex: -1 here.
     *
     * The previous -1 caused the subtitle to fall
     * behind the chef artwork.
     * ------------------------------------------------- */

    subtext: {
      fontSize: 13,

      lineHeight: 19,

      fontWeight: "400",

      color: "#FFFFFF",

      opacity: 0.82,

      marginTop: 12,

      maxWidth: 245,

      zIndex: 20,

      elevation: 20,
    },

    /* -------------------------------------------------
     * Chef Artwork
     * ------------------------------------------------- */

    bannerImage: {
      position: "absolute",

      width: isSmallScreen ? 205 : 235,

      height: isSmallScreen ? 275 : 310,

      right: isSmallScreen ? -22 : -15,

      /*
       * Negative bottom allows the chef to extend
       * outside the banner.
       */
      bottom: isSmallScreen ? -35 : -45,

      /*
       * Below the text content.
       */
      zIndex: 10,

      elevation: 10,
    },

    /* -------------------------------------------------
     * Vegetables
     * ------------------------------------------------- */

    VegesImage: {
      position: "absolute",

      width: isSmallScreen ? 175 : 210,

      height: isSmallScreen ? 100 : 120,

      left: -20,

      bottom: 0,

      zIndex: 4,

      elevation: 4,
    },

    /* -------------------------------------------------
     * Bottom Accent
     * ------------------------------------------------- */

    bottomAccent: {
      position: "absolute",

      width: 52,
      height: 4,

      borderRadius: 2,

      left: 24,
      bottom: 20,

      backgroundColor: "#FFFFFF",

      opacity: 0.85,

      zIndex: 25,

      elevation: 25,
    },
  });
};
