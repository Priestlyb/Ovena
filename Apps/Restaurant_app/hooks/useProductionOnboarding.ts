import { useEffect, useState } from "react";
import { getOnboardingStatus } from "@/services/onboardingStatusService";
import { FormStep } from "@/stores/onboardingStore";
import { OnboardingStatusResponse } from "@/types/onboarding";

export const useProductionOnboarding = () => {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<FormStep>(FormStep.AdminDetails);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status: OnboardingStatusResponse =
          await getOnboardingStatus();

        if (status.is_onboarding_complete) {
          // You should navigate to dashboard here instead
          setStep(FormStep.AdminDetails);
          return;
        }

        // Ensure step is valid enum
        if (Object.values(FormStep).includes(status.onboarding_step)) {
          setStep(status.onboarding_step as FormStep);
        } else {
          setStep(FormStep.AdminDetails);
        }
      } catch (error) {
        setStep(FormStep.AdminDetails);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  return { loading, step };
};