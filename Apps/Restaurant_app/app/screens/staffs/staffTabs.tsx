import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { IconName, IconSymbol } from "@/components/ui/icon-symbol";

import DashboardTab from "./tabs/dashboardTab";
import FoodTab from "./tabs/foodTab";
import OrderTab from "./tabs/orderTab";
import ProfilePage from "./tabs/profileTab";

const CompanyColor = "#F84E10";
const InactiveColor = "#FFD1C1";

type TabName = "Dashboard" | "Food" | "Order" | "Profile";

type Tab = {
  name: TabName;
  icon: IconName;
  label: string;
};

const tabs: Tab[] = [
  {
    name: "Dashboard",
    icon: "HomeIcon",
    label: "Dashboard",
  },
  {
    name: "Food",
    icon: "FoodIcon",
    label: "Food",
  },
  {
    name: "Order",
    icon: "OrderIcon",
    label: "Order",
  },
  {
    name: "Profile",
    icon: "ProfileIcon",
    label: "Profile",
  },
];

export default function StaffTabs() {
  const [activeTab, setActiveTab] = useState<TabName>("Dashboard");

  const ActiveScreen = useMemo(() => {
    switch (activeTab) {
      case "Food":
        return FoodTab;

      case "Order":
        return OrderTab;

      case "Profile":
        return ProfilePage;

      case "Dashboard":
      default:
        return DashboardTab;
    }
  }, [activeTab]);

  return (
    <View style={styles.container}>
      {/* Active tab screen */}
      <View style={styles.content}>
        <ActiveScreen />
      </View>

      {/* Manual bottom tab bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;

          return (
            <Pressable
              key={tab.name}
              onPress={() => setActiveTab(tab.name)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{
                selected: isActive,
              }}
              accessibilityLabel={tab.label}
            >
              <IconSymbol
                name={tab.icon}
                color={isActive ? "#FFFFFF" : InactiveColor}
                size={24}
              />

              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? "#FFFFFF" : InactiveColor,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
  },

  tabBar: {
    height: 70,
    width: "100%",
    backgroundColor: CompanyColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 5,
    paddingBottom: 5,
  },

  tab: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 12,
    marginTop: 5,
    marginBottom: 2,
  },
});
