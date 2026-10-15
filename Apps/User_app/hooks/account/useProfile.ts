import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/services/Account/account.service";
import { useAuth } from "@/context/AuthContext";

export const useProfile = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {

      if (!accessToken) {
        throw new Error("No authentication token found");
      }

      const { response, data } = await fetchProfile(accessToken);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch profile");
      }

      return data;
    },
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
  });
};