import { useEffect } from "react";
import { useRouter } from "expo-router";
import { getOnboardingStatus } from "@/services/onboardingStatus";
import { useOnboardingStore } from "@/stores/onboardingStore";

export const useRestoreOnboarding = () => {
  const router = useRouter();
  const setOnboarding = useOnboardingStore((s) => s.setOnboarding);

  useEffect(() => {
    const restore = async () => {
      try {
        const data = await getOnboardingStatus();

        setOnboarding(
          data.onboarding_step,
          data.is_onboarding_complete
        );

        if (data.is_onboarding_complete) {
          router.replace("/(tabs)");
          return;
        }

        const stepRoutes: Record<number, string> = {
          1: "/superForm2/checklist",
          2: "/superForm2/business-documents",
          3: "/superForm2/phone-verification",
          4: "/superForm2/profile",
          5: "/superForm2/payments",
          6: "/superForm2/operations",
          7: "/superForm2/menu-items",
          8: "/superForm2/room-menu",
        };

        const route = stepRoutes[data.onboarding_step];

        if (route) {
          router.replace(route);
        }
      } catch (err) {
        console.log("Failed to restore onboarding", err);
      }
    };

    restore();
  }, []);
};