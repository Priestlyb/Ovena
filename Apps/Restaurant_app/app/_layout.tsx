// app/_layout.tsx

import {
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
} from "@react-native-firebase/messaging";
import { Stack, useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

import { Phase2Provider } from "@/app/context/Phase2Context";
import api from "@/services/apiClient";
import {
  registerDeviceForNotifications,
  setupNotifications,
} from "@/services/notificationService";
import { getOnboardingStatus } from "@/services/onboardingStatus";
import { useAuthStore } from "@/stores/authStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { getAccessToken } from "@/utils/authStorage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

/* ------------------------
   Firebase Messaging
------------------------ */

const messaging = getMessaging();

/* ------------------------
   Auth Context
------------------------ */

type AuthContextType = {
  isLoading: boolean;
  token: string | null;
  step: number;
  profileType: "businessadmin" | "businessstaff" | null;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  token: null,
  step: 0,
  profileType: null,
});

export const useAuth = () => useContext(AuthContext);

/* ------------------------
   Detect Profile Type
------------------------ */

const getUserProfileType = async (): Promise<
  "businessadmin" | "businessstaff" | null
> => {
  try {
    const adminRes = await api.get("/accounts/profile/", {
      params: { profile_type: "businessadmin" },
    });

    if (adminRes.data) return "businessadmin";
  } catch (err: any) {
    const status = err?.response?.status;

    if (![400, 403, 404].includes(status)) {
      throw err;
    }
  }

  try {
    const staffRes = await api.get("/accounts/profile/", {
      params: { profile_type: "businessstaff" },
    });

    if (staffRes.data) return "businessstaff";
  } catch (err: any) {
    const status = err?.response?.status;

    if (![400, 403, 404].includes(status)) {
      throw err;
    }
  }

  return null;
};

/* ------------------------
   Onboarding Step
------------------------ */

const getOnboardingRoute = (step: number) => {
  switch (step) {
    case 1:
      return "/superForm";

    case 2:
      return "/screens/business-verification";

    case 3:
      return "/superForm2/menu-items";

    case 4:
      return "/(tabs)";

    default:
      return "/";
  }
};

/* ------------------------
   Restore Session Hook
------------------------ */

const useRestoreSession = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [step, setStep] = useState<number>(0);
  const [profileType, setProfileType] = useState<
    "businessadmin" | "businessstaff" | null
  >(null);

  const { version } = useAuthStore();

  useEffect(() => {
    const restore = async () => {
      try {
        const savedToken = await getAccessToken();

        if (!savedToken) {
          setToken(null);
          setStep(0);
          setProfileType(null);
          return;
        }

        setToken(savedToken);

        // Detect role
        const type = await getUserProfileType();
        setProfileType(type);

        // Staff → skip onboarding
        if (type === "businessstaff") {
          setStep(0);
          return;
        }

        // Unknown → treat as not onboarded
        if (!type) {
          setStep(0);
          return;
        }

        // Admin → fetch onboarding
        const status = await getOnboardingStatus();
        const currentStep = status?.onboarding_step ?? 0;

        console.log("[Onboarding] Step:", currentStep);

        setStep(currentStep);

        useOnboardingStore.getState().setOnboarding(currentStep);
      } catch (error) {
        console.log("[Auth] Restore failed:", error);

        setToken(null);
        setStep(0);
        setProfileType(null);

        useOnboardingStore.getState().reset();
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    restore();
  }, [version]);

  return {
    isLoading,
    token,
    step,
    profileType,
  };
};

/* ------------------------
   Navigation Stack
------------------------ */

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="screens/ResetTransactionPinPage" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

/* ------------------------
   Root Layout
------------------------ */

export default function RootLayout() {
  const router = useRouter();

  const { isLoading, token, step, profileType } = useRestoreSession();

  /* ------------------------
     Firebase Messaging Setup
  ------------------------ */

  useEffect(() => {
    /**
     * Do not initialize FCM until the authenticated
     * session has been restored.
     */
    if (isLoading || !token) {
      return;
    }

    let unsubscribeTokenRefresh: (() => void) | undefined;

    const setupAuthenticatedNotifications = async () => {
      try {
        /**
         * Complete FCM setup:
         *
         * 1. Check notification preference.
         * 2. Request permission if needed.
         * 3. Retrieve FCM token.
         * 4. Register token with backend.
         */
        const result = await setupNotifications();

        console.log("[Notifications] Setup result:", result);

        /**
         * Listen for Firebase token changes.
         *
         * When Firebase rotates the token, immediately
         * send the new token to the backend.
         */
        unsubscribeTokenRefresh = onTokenRefresh(
          messaging,
          async (newToken) => {
            console.log("[Notifications] FCM token refreshed:", newToken);

            const registered = await registerDeviceForNotifications(newToken);

            console.log(
              "[Notifications] Refreshed token registration:",
              registered,
            );
          },
        );
      } catch (error) {
        console.log("[Notifications] Authenticated FCM setup failed:", error);
      }
    };

    setupAuthenticatedNotifications();

    /* ------------------------
       Foreground Messages
    ------------------------ */

    const unsubscribeForeground = onMessage(
      messaging,
      async (remoteMessage) => {
        console.log(
          "[Notifications] Foreground notification received:",
          remoteMessage,
        );

        const title =
          remoteMessage.notification?.title ||
          (typeof remoteMessage.data?.title === "string"
            ? remoteMessage.data.title
            : undefined) ||
          "Ovena Restaurant";

        const body =
          remoteMessage.notification?.body ||
          (typeof remoteMessage.data?.body === "string"
            ? remoteMessage.data.body
            : undefined) ||
          "You have a new notification.";

        Toast.show({
          type: "info",
          text1: title,
          text2: body,
          position: "top",
          topOffset: 50,
        });

        /*
         * If this is an order notification, we will later
         * invalidate the appropriate React Query order keys
         * once we confirm the existing order query architecture.
         */
      },
    );

    /* ------------------------
       Notification Opened From Background
    ------------------------ */

    const unsubscribeNotificationOpened = onNotificationOpenedApp(
      messaging,
      (remoteMessage) => {
        console.log(
          "[Notifications] Notification opened from background:",
          remoteMessage,
        );

        /*
         * Navigation will be added after we confirm
         * the payload structure and order-detail route.
         */
      },
    );

    /* ------------------------
       Notification Opened From Quit State
    ------------------------ */

    getInitialNotification(messaging)
      .then((remoteMessage) => {
        if (!remoteMessage) {
          return;
        }

        console.log("[Notifications] Initial notification:", remoteMessage);

        /*
         * Navigation will be added after we confirm
         * the payload structure and order-detail route.
         */
      })
      .catch((error) => {
        console.log("[Notifications] Initial notification error:", error);
      });

    return () => {
      unsubscribeForeground();
      unsubscribeNotificationOpened();
      unsubscribeTokenRefresh?.();
    };
  }, [isLoading, token]);

  /* ------------------------
     Role-based Navigation Guard
  ------------------------ */

  useEffect(() => {
    if (isLoading) return;

    // Not logged in
    if (!token) {
      router.replace("/");
      return;
    }

    // Staff → go to staff app
    if (profileType === "businessstaff") {
      router.replace("/screens/staffs/staffTabs");
      return;
    }

    // Admin logic
    if (profileType === "businessadmin") {
      if (step === 0) {
        router.replace("/superForm");
        return;
      }

      if (step > 0 && step < 3) {
        const route = getOnboardingRoute(step);
        router.replace(route);
        return;
      }

      // Completed onboarding
      router.replace("/(tabs)");
      return;
    }

    // Unknown fallback
    router.replace("/");
  }, [isLoading, token, step, profileType]);

  if (isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          isLoading,
          token,
          step,
          profileType,
        }}
      >
        <Phase2Provider>
          <Toast position="top" topOffset={50} />

          <RootLayoutNav />
        </Phase2Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
