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
        <Stack.Screen
          name="delivery-or-pickup"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="screens/FoodOrderPage"
          options={{ title: "FoodOrderPage", headerShown: false }}
        />
      </Stack>
    </SafeViewScreen>
  );
}
