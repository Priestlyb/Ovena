import React from "react";
import { Tabs } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  const activeColor = "#eb7207dd";
  const inactiveColor = "white";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 5,
        },
        tabBarStyle: {
          height: 80,
          backgroundColor: "#000",
        },
      }}
    >
      <Tabs.Screen
        name="home"
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
            <IconSymbol size={22} name="OrderIcon" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="HeartIcon" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="ProfileIcon" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
