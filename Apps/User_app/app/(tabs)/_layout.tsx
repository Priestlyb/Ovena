// app/(tabs)/_layout.tsx
import { Tabs, Redirect } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  const activeColor = "#eb7207dd";
  const inactiveColor = "white";

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
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="HomeIcon" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={22}
              name="OrderIcon"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
