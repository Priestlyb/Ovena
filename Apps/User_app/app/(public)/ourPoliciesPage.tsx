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
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme, ThemeColors } from "@/constants/theme";

const { width } = Dimensions.get("window");

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

  const theme = useTheme();
  const styles = createStyles(theme);

  const [activeTab, setActiveTab] = useState<TabKey>("terms");

  const activeTabConfig = TABS.find((tab) => tab.key === activeTab);
  const ActiveComponent = activeTabConfig?.component;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol name="ArrowLeftIcon" size={22} color={theme.icon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Our Policies</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Tabs */}
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

      {/* Indicator */}
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

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {ActiveComponent ? <ActiveComponent /> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PoliciesPage;

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 60,
    },

    header: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 50,
      marginBottom: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },

    backButton: {
      padding: 10,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 50,
      backgroundColor: theme.surface,
    },

    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 24,
      fontWeight: "bold",
      color: theme.textPrimary,
    },

    headerSpacer: {
      width: 42,
    },

    tabContainer: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
    },

    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 14,
    },

    tabText: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: "500",
    },

    activeText: {
      color: theme.textPrimary,
      fontWeight: "600",
    },

    indicatorWrapper: {
      height: 2,
      width: "100%",
      backgroundColor: theme.border,
    },

    indicator: {
      height: 2,
      backgroundColor: theme.primary,
    },

    content: {
      padding: 16,
      backgroundColor: theme.background,
    },
  });
