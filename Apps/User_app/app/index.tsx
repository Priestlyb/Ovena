import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { authStatus } = useAuth();

  if (authStatus === "booting") return null;

  if (authStatus === "authenticated") {
    return <Redirect href="/(auth)/(tabs)/homepage" />;
  }

  return <Redirect href="/delivery-or-pickup" />;
}
