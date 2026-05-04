import { Tabs } from "expo-router";
import React from "react";
import { Home, Coffee } from "lucide-react-native"; // correct icons

export default function ProductsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF5722',
        tabBarInactiveTintColor: 'rgba(0,0,0,0.4)',
        tabBarIndicatorStyle: {
          backgroundColor: '#FF5722',
          height: 3,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: '#FFF',
        },
        tabBarIconStyle: { marginBottom: -5 },
      }}
    >
      <Tabs.Screen
        name="food"
        options={{
          title: "Food",
          tabBarIcon: ({ color, size }) => <Coffee color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: "Rooms",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}