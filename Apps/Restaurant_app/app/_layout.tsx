// app/_layout.tsx - Root layout with all routes
import { Stack } from "expo-router";

function RootLayoutNav() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            {/* Main Routes */}
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="superForm" />
            <Stack.Screen name="superForm2" />

            {/* SuperForm2 Routes (Router-based navigation) */}
            <Stack.Screen name="superForm2/checklist" />
            <Stack.Screen name="superForm2/business-documents" />
            <Stack.Screen name="superForm2/phone-verification" />
            <Stack.Screen name="superForm2/phone-otp" />
            <Stack.Screen name="superForm2/profile" />
            <Stack.Screen name="superForm2/payments" />
            <Stack.Screen name="superForm2/operations" />
            <Stack.Screen name="superForm2/menu-items" />
            <Stack.Screen name="superForm2/room-menu" />

            {/* Legacy Screens Routes */}
            <Stack.Screen name="screens/setUpCheckList" />
            <Stack.Screen name="screens/businessDocuments" />
            <Stack.Screen name="screens/emailVerification" />
            <Stack.Screen name="screens/locationPage" />
            <Stack.Screen name="screens/StoreHubPage" />

            <Stack.Screen name="screens/passwordCreation" />
            <Stack.Screen name="screens/profile" />
            <Stack.Screen name="screens/resetPassword" />
            <Stack.Screen name="screens/storeDetails" />
            <Stack.Screen name="screens/yourDetails" />

            {/* New Pages Routes */}
            <Stack.Screen name="screens/LoginPage" />
            <Stack.Screen name="screens/ManageUsersPage" />
            <Stack.Screen name="screens/NotificationsPage" />
            <Stack.Screen name="screens/ResetTransactionPinPage" />
            <Stack.Screen name="screens/StoreAnalyticsPage" />
            <Stack.Screen name="screens/YourFinancesPage" />
            <Stack.Screen name="screens/SupportPage" />
        </Stack>
    );
}

export default function RootLayout() {
    return <RootLayoutNav />;
}