import React from "react";
import { Tabs } from "expo-router";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/context/AuthContext";

export default function TabLayout() {
  const { authStatus } = useAuth();
  const activeColor = "#eb7207dd";
  const inactiveColor = "white";

  if (authStatus === "booting" || authStatus === "otp_signup" || authStatus === "google_signup") {
    return null; 
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginBottom: 5 },
        tabBarStyle: { height: 80, paddingTop: 5, backgroundColor: "#000" },
      }}
    >
      <Tabs.Screen
        name="homepage"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="HomeIcon" color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="OrderIcon" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="HeartIcon" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="ProfileIcon" color={color} />,
        }}
      />
    </Tabs>
  );
}
