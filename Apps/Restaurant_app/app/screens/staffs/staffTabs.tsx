// StaffTabs.tsx
import * as React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ProfilePage from "./tabs/profileTab";
import FoodTab from "./tabs/foodTab";
import { IconName, IconSymbol } from "@/components/ui/icon-symbol";
import OrderTab from "./tabs/orderTab";
import DashboardTab from "./tabs/dashboardTab";

const CompanyColor = "#F84E10";

const Tab = createBottomTabNavigator();

export default function StaffTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: CompanyColor,
          height: 70,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#FFD1C1",
        tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
        tabBarIcon: ({ color }) => {
          let iconName: IconName;

          if (route.name === "Dashboard") iconName = "HomeIcon";
          else if (route.name === "Food")
            iconName = "FoodIcon";
          else if (route.name === "Order") iconName = "OrderIcon";
          else if (route.name === "Profile") iconName = "ProfileIcon";
          else iconName = "HomeIcon";

          return <IconSymbol name={iconName} color={color} size={24} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardTab} />
      <Tab.Screen name="Food" component={FoodTab} />
      <Tab.Screen name="Order" component={OrderTab} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
