// NotificationsPage.tsx - Manage notification settings
import { styles } from "@/constants/styles";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

// Atomic Components
import { Divider } from "@/components/atoms/Divider";
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";

// Molecule Components
import { Header } from "@/components/molecules/Header";

// Existing Components
import { ToggleSwitch } from "@/components/ToggleSwitch";

export default function NotificationsPage() {
  const router = useRouter();
  const [repeatedNotifications, setRepeatedNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header
          title="Notifications"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={() => router.back()}
        />

        <Spacer size="lg" />

        <View style={{ paddingHorizontal: 20 }}>
          {/* Section Title */}
          <Text variant="h4" weight="semibold">
            Manage Notifications
          </Text>

          <Spacer size="sm" />
          <Divider />
          <Spacer size="lg" />

          {/* Notification Toggle */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text variant="body" color="primary">
              Turn on repeated notifications
            </Text>

            <ToggleSwitch
              value={repeatedNotifications}
              onChange={setRepeatedNotifications}
            />
          </View>
        </View>

        <Spacer size="xxl" />
      </ScrollView>
    </SafeAreaView>
  );
}
