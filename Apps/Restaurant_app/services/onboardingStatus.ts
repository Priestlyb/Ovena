// services/onboardingStatus.ts

import api from "@/services/apiClient";
import { OnboardingStatus } from "@/types";

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
    if (status !== 404 && status !== 400 && status !== 403) {
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
    if (status !== 404 && status !== 400 && status !== 403) {
      throw err;
    }
  }

  return null;
};

export const getOnboardingStatus = async (): Promise<OnboardingStatus | null> => {
  try {

    const type = await getUserProfileType();

    console.log("[Onboarding] Detected profile type:", type);

    if (type === "businessstaff") {
      console.log("[Onboarding] 🚫 Staff user — skipping onboarding call");
      return null;
    }

    if (!type) {
      console.log("[Onboarding] ❌ No profile type found");
      return null;
    }

    const res = await api.get<OnboardingStatus>(
      "/accounts/onboard/status/"
    );

    return res.data;
  } catch (err: any) {
    const status = err?.response?.status;

    console.log("[Onboarding] Status error:", status);


    if (status === 401 || status === 403) {
      return null;
    }

    console.log(
      "[Onboarding] Unexpected error:",
      err?.response?.data || err.message
    );

    return null;
  }
};