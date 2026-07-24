import { useSubscribePlan } from "@/hooks/subscriptions/useSubscribePlan";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

export default function PaymentScreen() {
  const router = useRouter();

  const hasNavigated = useRef(false);

  const { subscribePlan } = useSubscribePlan();

  const { paymentUrl, planId } = useLocalSearchParams<{
    paymentUrl: string;
    planId: string;
  }>();

  const handleNavigationStateChange = async (navState: any) => {
    const url = navState?.url;

    console.log("WEBVIEW URL");
    console.log(url);

    if (!url || hasNavigated.current) return;

    // Success URLs
    if (
      url.includes("success") ||
      url.includes("reference=") ||
      url.includes("trxref=")
    ) {
      hasNavigated.current = true;

      console.log("CARD AUTHORIZATION SUCCESS");

      try {
        console.log("SUBSCRIBING TO PLAN");

        const response = await subscribePlan({
          plan_id: Number(planId),
        });

        console.log("SUBSCRIPTION SUCCESS");
        console.log(JSON.stringify(response, null, 2));

        router.replace("/superForm2/menu-items");
      } catch (error) {
        console.log("SUBSCRIPTION FAILED");
        console.log(error);

        hasNavigated.current = false;
      }

      return;
    }

    // Cancel URLs
    if (
      url.includes("cancel") ||
      url.includes("cancelled") ||
      url.includes("failed")
    ) {
      hasNavigated.current = true;

      console.log("PAYMENT CANCELLED");

      router.back();

      return;
    }
  };

  if (!paymentUrl) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FF5920" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: paymentUrl }}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        onNavigationStateChange={handleNavigationStateChange}
        renderLoading={() => (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#FF5920" />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 65,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
