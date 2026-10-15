import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { useTheme } from "@/constants/theme";

import SignupBanner from "./SignupBanner";

type SignupLayoutProps = {
  children: ReactNode;
  bannerTitle?: string;
};

export default function SignupLayout({
  children,
  bannerTitle,
}: SignupLayoutProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.container}>
          {/* -------------------------------------------------
           * Banner
           *
           * The chef artwork is allowed to overflow below
           * the banner. The form below is layered above it.
           * ------------------------------------------------- */}
          <View style={styles.bannerWrapper}>
            <SignupBanner title={bannerTitle} />
          </View>

          {/* -------------------------------------------------
           * Form
           *
           * Higher zIndex/elevation makes the form visually
           * cover the overflowing chef artwork.
           * ------------------------------------------------- */}
          <View style={styles.formContainer}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    /* -------------------------------------------------
     * Root
     * ------------------------------------------------- */

    flex: {
      flex: 1,
      backgroundColor: theme.primary,
    },

    /* -------------------------------------------------
     * ScrollView
     * ------------------------------------------------- */

    scrollView: {
      flex: 1,
      backgroundColor: theme.primary,
    },

    scrollContent: {
      flexGrow: 1,
      backgroundColor: theme.primary,
    },

    /* -------------------------------------------------
     * Main Container
     * ------------------------------------------------- */

    container: {
      width: "100%",
      backgroundColor: theme.primary,
    },

    /* -------------------------------------------------
     * Banner Wrapper
     * ------------------------------------------------- */

    bannerWrapper: {
      width: "100%",

      position: "relative",

      /*
       * Keep banner behind the form.
       */
      zIndex: 1,

      elevation: 1,
    },

    /* -------------------------------------------------
     * Form Container
     * ------------------------------------------------- */

    formContainer: {
      width: "100%",

      /*
       * This background is important.
       *
       * It physically covers the chef image when the
       * chef extends below the banner.
       */
      backgroundColor: theme.background,

      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,

      paddingHorizontal: 30,
      paddingTop: 25,
      paddingBottom: 50,

      minHeight: 300,

      /*
       * Place the form above the overflowing artwork.
       */
      position: "relative",
      zIndex: 10,

      elevation: 10,
    },
  });
