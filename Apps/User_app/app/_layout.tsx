import SafeViewScreen from "@/components/SafeViewScreen";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screens/Otp"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screens/SignUpForm"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="screens/FoodOrderPage"
          options={{ title: "FoodOrderPage", headerShown: false }}
        />

        <Stack.Screen
          name="screens/RoomDetails"
          options={{ title: "RoomDetails", headerShown: false }}
        />

        <Stack.Screen
          name="screens/HotelDetails"
          options={{ title: "HotelDetails", headerShown: false }}
        />
      </Stack>
    </SafeViewScreen>
    </GestureHandlerRootView>
  );
}
