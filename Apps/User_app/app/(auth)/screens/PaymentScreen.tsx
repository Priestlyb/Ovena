import React, { useRef } from "react";

import {
  View,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useCartStore } from "@/src/store/cartStore";

import { useTheme } from "@/constants/theme";

export default function PaymentScreen() {
  const router = useRouter();

  const theme = useTheme();

  const styles = createStyles(theme);

  const hasNavigated = useRef(false);

  const clearBranch = useCartStore((state) => state.clearBranch);

  const { paymentUrl, orderId, branchId } = useLocalSearchParams<{
    paymentUrl: string;
    orderId: string;
    branchId: string;
  }>();

  const BASE_URL = "https://ovena-backend-production.up.railway.app";

  const SUCCESS_URL = `${BASE_URL}/payment-success/`;

  const FAILED_URL = `${BASE_URL}/payment-failed/`;

  const PROCESSING_URL = `${BASE_URL}/payment-processing/`;

  const ERROR_URL = `${BASE_URL}/payment-error/`;

  const navigateOnce = (callback: () => void) => {
    if (hasNavigated.current) {
      return;
    }

    hasNavigated.current = true;

    callback();
  };

  const navigateToSuccess = () => {
    navigateOnce(() => {
      if (branchId) {
        clearBranch(Number(branchId));
      }

      router.replace({
        pathname: "/screens/OrderSuccess",

        params: {
          orderId,
        },
      });
    });
  };

  const navigateToFailed = () => {
    navigateOnce(() => {
      router.replace({
        pathname: "/screens/PaymentFailed",

        params: {
          orderId,
        },
      });
    });
  };

  const navigateToError = () => {
    navigateOnce(() => {
      router.replace({
        pathname: "/screens/PaymentError",

        params: {
          orderId,
        },
      });
    });
  };

  const handlePaymentNavigation = (url: string) => {
    if (url.startsWith(SUCCESS_URL)) {
      navigateToSuccess();

      return true;
    }

    if (url.startsWith(FAILED_URL)) {
      console.log("[PAYMENT FAILED]");

      navigateToFailed();

      return true;
    }

    if (url.startsWith(ERROR_URL)) {
      console.log("[PAYMENT ERROR]");

      navigateToError();

      return true;
    }

    if (url.startsWith(PROCESSING_URL)) {
      console.log("[PAYMENT PROCESSING]");

      return false;
    }

    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{
          uri: paymentUrl,
        }}

        javaScriptEnabled

        domStorageEnabled

        startInLoadingState

        onNavigationStateChange={(navState) => {
          handlePaymentNavigation(navState.url);

          console.log(navState);
        }}

        onShouldStartLoadWithRequest={(request) => {
          if (handlePaymentNavigation(request.url)) {
            return false;
          }

          return true;
        }}

        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor: theme.background,

      paddingTop: 75,
    },

    loader: {
      flex: 1,

      justifyContent: "center",

      alignItems: "center",

      backgroundColor: theme.background,
    },
  });
