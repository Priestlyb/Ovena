import { Header } from "@/components/molecules/Header";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

import TermsTab from "@/components/policies/TermsTab";
import PrivacyTab from "@/components/policies/PrivacyTab";

const { width } = Dimensions.get("window");

/**
 * ✅ Tab Config (SCALABLE)
 */
const TABS = [
  {
    key: "terms",
    label: "Terms & Conditions",
    component: TermsTab,
  },
  {
    key: "privacy",
    label: "Privacy Policy",
    component: PrivacyTab,
  },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const PoliciesPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("terms");

  /**
   * ✅ Find active tab dynamically
   */
  const activeTabConfig = TABS.find((tab) => tab.key === activeTab);
  const ActiveComponent = activeTabConfig?.component;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Our Policies"
        leftIcon={<ArrowLeft size={24} />}
        onLeftIconPress={() => router.back()}
      />

      {/* ✅ Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ Indicator */}
      <View style={styles.indicatorWrapper}>
        <View
          style={[
            styles.indicator,
            {
              width: width / TABS.length,
              transform: [
                {
                  translateX:
                    (width / TABS.length) *
                    TABS.findIndex((tab) => tab.key === activeTab),
                },
              ],
            },
          ]}
        />
      </View>

      {/* ✅ Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {ActiveComponent ? <ActiveComponent /> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PoliciesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 55,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tab: {
    flex: 1, // ✅ better than width / 2 (auto scales)
    alignItems: "center",
    paddingVertical: 14,
  },
  tabText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  activeText: {
    color: "#000",
    fontWeight: "600",
  },
  indicatorWrapper: {
    height: 2,
    width: "100%",
    backgroundColor: "#eee",
  },
  indicator: {
    height: 2,
    backgroundColor: "#FF5920",
  },
  content: {
    padding: 16,
  },
});