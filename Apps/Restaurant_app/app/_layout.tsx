// app/_layout.tsx
import { Stack, useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

import { Phase2Provider } from "@/app/context/Phase2Context";
import api from "@/services/apiClient";
import { getOnboardingStatus } from "@/services/onboardingStatus";
import { useAuthStore } from "@/stores/authStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { getAccessToken } from "@/utils/authStorage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
    if (![400, 403, 404].includes(status)) throw err;
  }

  try {
    const staffRes = await api.get("/accounts/profile/", {
      params: { profile_type: "businessstaff" },
    });

    if (staffRes.data) return "businessstaff";
  } catch (err: any) {
    const status = err?.response?.status;
    if (![400, 403, 404].includes(status)) throw err;
  }

  return null;
};

/* ------------------------
   Onboarding Step
------------------------ */
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

  return { isLoading, token, step, profileType };
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

    // 🧑‍💼 Admin logic
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

  if (isLoading) return null;

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
