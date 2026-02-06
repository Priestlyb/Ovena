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
        <Stack.Screen name="superForm2" />
        <Stack.Screen name="screens/setUpCheckList" />
        <Stack.Screen name="screens/businessDocuments" />


    </Stack>
    </>
}


export default function RootLayout() {
  return <RootLayoutNav />;
}