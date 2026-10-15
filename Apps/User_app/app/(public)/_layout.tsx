import { Stack } from "expo-router";

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="FoodDeliveryChoiceScreen"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="googleSignUpForm"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="otp"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="otpSignUpForm"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ourPoliciesPage"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
