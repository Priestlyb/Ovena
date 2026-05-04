// utils/getUserProfileType.ts
import api from "@/services/apiClient";

export const getUserProfileType = async (): Promise<
  "businessadmin" | "businessstaff" | null
> => {
  try {
    // Try admin first
    const adminRes = await api.get("/accounts/profile/", {
      params: { profile_type: "businessadmin" },
    });

    if (adminRes.data) return "businessadmin";
  } catch (err: any) {
    if (err?.response?.status !== 404 && err?.response?.status !== 400) {
      throw err; // real error
    }
  }

  try {
    // Try staff
    const staffRes = await api.get("/accounts/profile/", {
      params: { profile_type: "businessstaff" },
    });

    if (staffRes.data) return "businessstaff";
  } catch (err: any) {
    if (err?.response?.status !== 404 && err?.response?.status !== 400) {
      throw err;
    }
  }

  return null;
};