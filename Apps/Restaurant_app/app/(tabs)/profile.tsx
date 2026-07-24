// ProfilePage.tsx

import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";

import { LogoutButton } from "@/components/profile/LogoutButton";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileMenuSection } from "@/components/profile/ProfileMenuSection";

import { createProfileMenuConfig } from "@/constants/profile-menu-config";

import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { useLogout } from "@/hooks/useLogout";

export default function ProfilePage() {
  const router = useRouter();

  const { profile, profileLoading } = useBusinessProfile();

  const { logout, isLoggingOut } = useLogout();

  const { accountSettings, storeSettings, appSettings } =
    createProfileMenuConfig(router);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          image={profile.business_image}
          onEdit={() => router.push("/screens/BusinessImagesScreen")}
        />

        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <Spacer size="lg" />

          <ProfileInfo
            loading={profileLoading}
            logo={profile.business_logo}
            name={profile.name}
            email={profile.email}
          />

          <Spacer size="xl" />

          <ProfileMenuSection
            title="Account Settings"
            items={accountSettings}
          />

          <ProfileMenuSection title="Store Settings" items={storeSettings} />

          <ProfileMenuSection title="App Settings" items={appSettings} />

          <Spacer size="lg" />

          <LogoutButton loading={isLoggingOut} onPress={logout} />

          <Spacer size="sm" />

          <Text variant="caption" color="secondary" align="center">
            v2.0.3(v699)
          </Text>

          <Spacer size="xxl" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
