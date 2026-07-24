// constants/profile-menu-config.ts

import { IconName } from "@/components/ui/icon-symbol";

export interface ProfileMenuItem {
  icon: IconName;
  label: string;
  onPress: () => void;
}

export interface ProfileMenuConfig {
  accountSettings: ProfileMenuItem[];
  storeSettings: ProfileMenuItem[];
  appSettings: ProfileMenuItem[];
}

export const createProfileMenuConfig = (
  router: any
): ProfileMenuConfig => ({
  accountSettings: [
    {
      icon: "UserOutlineIcon",
      label: "Your Details",
      onPress: () => router.push("/screens/yourDetails"),
    },
    {
      icon: "StoreClockIcon",
      label: "Store Details",
      onPress: () => router.push("/screens/storeDetails"),
    },
    {
      icon: "LockClosedOutline",
      label: "Change password",
      onPress: () => router.push("/screens/changePassword"),
    },
  ],

  storeSettings: [
    {
      icon: "WalletIcon",
      label: "Payment Details",
      onPress: () => router.push("/screens/paymentDetails"),
    },
    {
      icon: "PrivateConnectivityIcon",
      label: "Store Analytics",
      onPress: () => router.push("/screens/StoreAnalyticsPage"),
    },
    {
      icon: "WalletIcon",
      label: "Your Finances",
      onPress: () => router.push("/screens/YourFinancesPage"),
    },
    {
      icon: "SettingsIcon",
      label: "Store Hub",
      onPress: () => router.push("/screens/StoreHubPage"),
    },
    {
      icon: "UserGroupIcon",
      label: "Manage users",
      onPress: () => router.push("/screens/ManageUsersPage"),
    },
  ],

  appSettings: [
    {
      icon: "Chaticon",
      label: "Support",
      onPress: () =>
        router.push("/screens/SupportPage"),
    },
    {
      icon: "ShieldIcon",
      label: "Privacy",
      onPress: () => router.push("/screens/ourPoliciesPage"),
    },
    {
      icon: "BellIcon",
      label: "Notifications",
      onPress: () => router.push("/screens/NotificationsPage"),
    },
    {
      icon: "KeyIcon",
      label: "Reset PIN",
      onPress: () =>
        router.push("/screens/ResetTransactionPinPage"),
    },
  ],
});