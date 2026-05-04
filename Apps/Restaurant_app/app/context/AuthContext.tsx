import React, { createContext, useContext, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { getAccessToken } from "@/utils/authStorage";
import { getOnboardingStatus } from "@/services/onboardingStatus";

type AuthContextType = {
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  type OnboardingRoute =
    | "/superForm2/checklist"
    | "/superForm2/business-documents"
    | "/superForm2/phone-verification"
    | "/superForm2/profile"
    | "/superForm2/payments"
    | "/superForm2/operations"
    | "/superForm2/menu-items"
    | "/superForm2/room-menu";

  const stepRoutes: Record<number, OnboardingRoute> = {
    1: "/superForm2/checklist",
    2: "/superForm2/business-documents",
    3: "/superForm2/phone-verification",
    4: "/superForm2/profile",
    5: "/superForm2/payments",
    6: "/superForm2/operations",
    7: "/superForm2/menu-items",
    8: "/superForm2/room-menu",
  };

  const restoreSession = async () => {
    try {
      const token = await getAccessToken();

      if (!token) {
        router.replace("/");
        return;
      }

      // ✅ Try to get onboarding status
      const status = await getOnboardingStatus();

      if (status?.is_onboarding_complete) {
        router.replace("/(tabs)");
        return;
      }

      const route = stepRoutes[Number(status?.onboarding_step)];

      if (route) {
        router.replace(route);
        return;
      }

      // fallback
      router.replace("/");
    } catch (error) {
      console.log("Restore session failed:", error);

      // ✅ This is where your 403 lands
      // Means new user → start onboarding
      router.replace("/");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
