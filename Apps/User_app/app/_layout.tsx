import SafeViewScreen from "@/components/SafeViewScreen";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <SafeViewScreen>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeViewScreen>
  );
}
