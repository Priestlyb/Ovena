import "react-native-reanimated";
import "@/src/lib/googleAuth";

import React, { useEffect } from "react";
import { Stack, usePathname, useRouter } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useFonts } from "expo-font";

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
} from "@expo-google-fonts/roboto";

import { Anton_400Regular } from "@expo-google-fonts/anton";

import { KaushanScript_400Regular } from "@expo-google-fonts/kaushan-script";

import * as SplashScreen from "expo-splash-screen";

import {
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
} from "@react-native-firebase/messaging";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { DeliveryMethodProvider } from "@/context/DeliveryMethodContext";
import { ThemeProvider } from "@/context/ThemeContext";

import {
  getNotificationsEnabled,
  registerDeviceForNotifications,
  saveNotificationToken,
} from "@/services/notificationService";

import { notificationKeys } from "@/hooks/useNotifications";

/* =========================================================
   SPLASH SCREEN
========================================================= */

SplashScreen.preventAutoHideAsync();

/* =========================================================
   QUERY CLIENT
========================================================= */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    /* =========================
       POPPINS
    ========================= */

    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,

    /* =========================
       ROBOTO
    ========================= */

    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_700Bold_Italic,

    /* =========================
       OTHER FONTS
    ========================= */

    Anton_400Regular,
    KaushanScript_400Regular,
  });

  /* =======================================================
     HIDE SPLASH SCREEN WHEN FONTS ARE READY
  ======================================================= */

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  /* =======================================================
     WAIT FOR FONTS
  ======================================================= */

  if (!fontsLoaded) {
    return null;
  }

  /* =======================================================
     APP
  ======================================================= */

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <DeliveryMethodProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                />

                <AuthRouteGuard />

                <NotificationInitializer />
              </DeliveryMethodProvider>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>

        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

/* =========================================================
   NOTIFICATION INITIALIZER
========================================================= */

/* =========================================================
   NOTIFICATION INITIALIZER
========================================================= */

function NotificationInitializer() {
  const { authStatus } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const messagingInstance = getMessaging();

    /* =====================================================
       FOREGROUND NOTIFICATIONS
    ===================================================== */

    const unsubscribeForeground = onMessage(
      messagingInstance,
      async (remoteMessage) => {
        if (!isMounted) {
          return;
        }

        try {
          console.log(
            "[Notifications] Foreground notification received:",
            remoteMessage,
          );

          /*
           * Refresh the notification inbox immediately.
           */
          await queryClient.invalidateQueries({
            queryKey: notificationKeys.all,
          });

          /*
           * Firebase notification values are strings.
           * Data values can have broader types, so convert
           * them safely before passing them to Toast.
           */
          const notificationTitle = remoteMessage.notification?.title;

          const notificationBody = remoteMessage.notification?.body;

          const dataTitle = remoteMessage.data?.title;

          const dataBody = remoteMessage.data?.body;

          const title =
            typeof notificationTitle === "string"
              ? notificationTitle
              : typeof dataTitle === "string"
                ? dataTitle
                : "Ovena";

          const body =
            typeof notificationBody === "string"
              ? notificationBody
              : typeof dataBody === "string"
                ? dataBody
                : "You have a new notification.";

          /*
           * Firebase does not automatically display a system
           * notification while the app is in the foreground.
           *
           * For now, show an in-app Toast.
           */
          Toast.show({
            type: "info",
            text1: title,
            text2: body,
          });
        } catch (error) {
          console.error(
            "[Notifications] Foreground notification handling failed:",
            error,
          );
        }
      },
    );

    /* =====================================================
       TOKEN REFRESH
    ===================================================== */

    const unsubscribeTokenRefresh = onTokenRefresh(
      messagingInstance,
      async (token) => {
        try {
          if (!isMounted) {
            return;
          }

          console.log("[Notifications] FCM token refreshed:", token);

          /*
           * Do not register the token with the backend unless
           * the user is authenticated.
           */
          if (authStatus !== "authenticated") {
            console.log(
              "[Notifications] Token refreshed while user is not authenticated.",
            );

            return;
          }

          /*
           * Only keep/register a refreshed Firebase token
           * when notifications have been explicitly enabled.
           */
          const notificationsEnabled = await getNotificationsEnabled();

          if (notificationsEnabled !== true) {
            console.log(
              "[Notifications] Token refreshed while notifications are disabled.",
            );

            return;
          }

          /*
           * Save the latest token locally.
           */
          await saveNotificationToken(token);

          /*
           * Register the refreshed token with the backend.
           */
          const registered = await registerDeviceForNotifications(token);

          if (registered) {
            console.log(
              "[Notifications] Refreshed FCM token registered successfully.",
            );
          } else {
            console.warn(
              "[Notifications] Failed to register refreshed FCM token.",
            );
          }
        } catch (error) {
          console.error(
            "[Notifications] Token refresh handling failed:",
            error,
          );
        }
      },
    );

    /* =====================================================
       NOTIFICATION OPENED FROM BACKGROUND
    ===================================================== */

    const unsubscribeNotificationOpened = onNotificationOpenedApp(
      messagingInstance,
      async (remoteMessage) => {
        try {
          console.log(
            "[Notifications] Notification opened from background:",
            remoteMessage,
          );

          /*
           * Refresh the notification inbox.
           */
          await queryClient.invalidateQueries({
            queryKey: notificationKeys.all,
          });

          /*
           * Notification navigation can be added here once
           * the backend payload structure is finalized.
           */
        } catch (error) {
          console.error(
            "[Notifications] Background notification handling failed:",
            error,
          );
        }
      },
    );

    /* =====================================================
       NOTIFICATION OPENED FROM QUIT STATE
    ===================================================== */

    const handleInitialNotification = async () => {
      try {
        const remoteMessage = await getInitialNotification(messagingInstance);

        if (!remoteMessage || !isMounted) {
          return;
        }

        console.log(
          "[Notifications] App opened from notification:",
          remoteMessage,
        );

        /*
         * Give Expo Router time to finish mounting the
         * application before updating notification state.
         */
        setTimeout(async () => {
          if (!isMounted) {
            return;
          }

          try {
            await queryClient.invalidateQueries({
              queryKey: notificationKeys.all,
            });

            /*
             * Notification navigation can be added here once
             * the backend payload structure is finalized.
             */
          } catch (error) {
            console.error(
              "[Notifications] Initial notification query refresh failed:",
              error,
            );
          }
        }, 300);
      } catch (error) {
        console.error(
          "[Notifications] Initial notification handling failed:",
          error,
        );
      }
    };

    handleInitialNotification();

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      isMounted = false;

      unsubscribeForeground();
      unsubscribeTokenRefresh();
      unsubscribeNotificationOpened();
    };
  }, [authStatus]);

  return null;
}

/* =========================================================
   AUTH ROUTE GUARD
========================================================= */

function AuthRouteGuard() {
  const { authStatus, guestUsage } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  /* =======================================================
     ROUTES
  ======================================================= */

  const isLogin = pathname === "/login";

  const isOtp = pathname === "/otp";

  const isOtpSignup = pathname === "/otpSignUpForm";

  const isGoogleSignup = pathname === "/googleSignUpForm";

  const isPolicies = pathname === "/ourPoliciesPage";

  const isDelivery = pathname === "/FoodDeliveryChoiceScreen";

  const isAuthScreen = isLogin || isOtp || isOtpSignup || isGoogleSignup;

  const isPublicRoute =
    isLogin ||
    isOtp ||
    isOtpSignup ||
    isGoogleSignup ||
    isPolicies ||
    isDelivery;

  /* =======================================================
     ROUTING
  ======================================================= */

  useEffect(() => {
    /* =====================================================
       UNAUTHENTICATED
    ===================================================== */

    if (authStatus === "unauthenticated") {
      if (isPublicRoute) {
        return;
      }

      router.replace("/FoodDeliveryChoiceScreen");

      return;
    }

    /* =====================================================
       OTP SIGNUP
    ===================================================== */

    if (authStatus === "otp_signup") {
      if (isOtpSignup) {
        return;
      }

      router.replace("/otpSignUpForm");

      return;
    }

    /* =====================================================
       GOOGLE SIGNUP
    ===================================================== */

    if (authStatus === "google_signup") {
      if (isGoogleSignup) {
        return;
      }

      router.replace("/googleSignUpForm");

      return;
    }

    /* =====================================================
       GUEST
    ===================================================== */

    if (authStatus === "guest") {
      if (isAuthScreen) {
        router.replace("/home");

        return;
      }

      if (guestUsage >= 4) {
        return;
      }

      return;
    }

    /* =====================================================
       AUTHENTICATED
    ===================================================== */

    if (authStatus === "authenticated") {
      if (isAuthScreen) {
        router.replace("/home");

        return;
      }

      return;
    }
  }, [
    authStatus,
    guestUsage,
    pathname,
    router,
    isPublicRoute,
    isOtpSignup,
    isGoogleSignup,
    isAuthScreen,
  ]);

  return null;
}
