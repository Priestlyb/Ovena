import { Stack } from "expo-router";

function RootLayoutNav() {
    return <>
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
        <Stack.Screen name="index" />
        <Stack.Screen name="superForm" />

    </Stack>
    </>
}


export default function RootLayout() {
  return <RootLayoutNav />;
}