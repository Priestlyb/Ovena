// screens/AccountScreen.tsx
import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Alert, SafeAreaView, StatusBar, ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { IconSymbol } from "../components/ui/icon-symbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppData } from "../context/appDataContext";

// Sub-screens
import DocumentsScreen  from "./DocumentsScreen";
import PaymentScreen    from "./PaymentScreen";
import EditInfoScreen   from "./EditInfoScreen";
import AppSettingsScreen from "./AppSettingsScreen";
import ScreenWrapper from "../components/ScreenWrapper";

// ── Types ─────────────────────────────────────────────────────────────────────

type RootStackParamList = {
  Login_SignUp: undefined;
  SignIn:       undefined;
  HomeScreen:   undefined;
};

type AccountNavProp = NativeStackNavigationProp<RootStackParamList>;

interface AccountScreenProps {
  onBack: () => void;
  disconnectSockets?: () => void; // from HomeScreen's useDriverWebSocket instance
}

type SubScreen = "Documents" | "Payment" | "EditInfo" | "AppSettings" | null;

interface MenuItemProps {
  label: string;
  iconName: string;
  onPress: () => void;
  borderBottom?: boolean;
}

// Auth tokens cleared on logout. The app-data cache itself is cleared via
// AppDataContext's clearCache() below, rather than duplicating its cache
// key here — that way this list can't silently go stale if the context
// ever changes what/how it caches.
const STORAGE_KEYS_TO_CLEAR = [
  "accessToken",
  "refreshToken",
];

// ── Component ─────────────────────────────────────────────────────────────────

const AccountScreen: React.FC<AccountScreenProps> = ({ onBack, disconnectSockets }) => {
  
  const { colors }      = useTheme();
  const navigation      = useNavigation<AccountNavProp>();
  const { clearCache }  = useAppData();

  const [subScreen, setSubScreen]       = useState<SubScreen>(null);
  const [signingOut, setSigningOut]     = useState(false);

  const closeSubScreen = () => setSubScreen(null);

  // ── Logout ────────────────────────────────────────────────────────────────

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: performSignOut,
        },
      ]
    );
  };

  const performSignOut = async () => {
    setSigningOut(true);
    try {
      // 1. Kill both channels immediately — don't wait on unmount to do it
      disconnectSockets?.();

      // 2. Wipe stored auth tokens
      await AsyncStorage.multiRemove(STORAGE_KEYS_TO_CLEAR);

      // 3. Wipe the cached app data (disk + in-memory) so the next person
      //    signed in on this device never sees a flash of this user's data
      await clearCache();

      // 4. Reset navigation stack
      navigation.reset({ index: 0, routes: [{ name: "Login_SignUp" }] });
    } catch (err: any) {
      setSigningOut(false);
      Alert.alert("Sign Out Failed", err.message ?? "Something went wrong. Please try again.");
    }
  };

  // ── Sub-screen rendering ──────────────────────────────────────────────────

  const renderSubScreen = () => {
    switch (subScreen) {
      case "Documents":   return <DocumentsScreen   onBack={closeSubScreen} />;
      case "Payment":     return <PaymentScreen     onBack={closeSubScreen} />;
      case "EditInfo":    return <EditInfoScreen     onBack={closeSubScreen} />;
      case "AppSettings": return <AppSettingsScreen  onBack={closeSubScreen} />;
      default:            return null;
    }
  };

  const MenuItem = ({ label, iconName, onPress, borderBottom = true }: MenuItemProps) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        { borderBottomColor: colors.separatorColor },
        borderBottom ? { borderBottomWidth: StyleSheet.hairlineWidth } : { borderBottomWidth: 0 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: colors.inputBg }]}>
        <IconSymbol name={iconName as any} size={20} color={colors.iconColor} />
      </View>
      <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{label}</Text>
      <IconSymbol name="ChevronForwardIcon" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <>
      <ScreenWrapper >
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.background} />

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.separatorColor }]}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={signingOut}
          >
            <IconSymbol name="ArrowBack" size={22} color={colors.iconColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Account</Text>
          <View style={styles.backBtn} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Vehicle row */}
          <View style={styles.vehicleRow}>
            <View style={[styles.vehicleAvatar, { backgroundColor: colors.cardSecondary }]} />
            <View>
              <Text style={[styles.vehicleName, { color: colors.textPrimary }]}>Vehicle</Text>
              <Text style={[styles.vehicleSub, { color: colors.textSecondary }]}>NIU NQi</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.separatorColor }]} />

          {/* Menu */}
          <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
            <MenuItem label="Documents"        iconName="DocumentIcon" onPress={() => setSubScreen("Documents")} />
            <MenuItem label="Payment"          iconName="PaymentIcon"  onPress={() => setSubScreen("Payment")} />
            <MenuItem label="Edit Information" iconName="PencilIcon"   onPress={() => setSubScreen("EditInfo")} />
            <MenuItem label="Privacy"          iconName="LockIcon"     onPress={() => Alert.alert("Privacy", "Privacy settings coming soon.")} />
            <MenuItem label="App Settings"     iconName="SettingsIcon" onPress={() => setSubScreen("AppSettings")} borderBottom={false} />
          </View>

          {/* Sign out */}
          <View style={styles.signOutWrap}>
            <TouchableOpacity
              style={[
                styles.signOutBtn,
                { backgroundColor: colors.accentOrange },
                signingOut && styles.btnDisabled,
              ]}
              activeOpacity={0.8}
              onPress={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signOutText}>Sign out</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Sub-screen modal */}
      <Modal
        visible={subScreen !== null}
        animationType="slide"
        onRequestClose={closeSubScreen}
        presentationStyle="fullScreen"
      >
        {renderSubScreen()}
      </Modal>
      </ScreenWrapper>
    </>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn:     { width: 36 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  vehicleAvatar: { width: 52, height: 52, borderRadius: 26 },
  vehicleName:   { fontSize: 18, fontWeight: "700" },
  vehicleSub:    { fontSize: 14, marginTop: 2 },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  menuSection: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 12,
    gap: 14,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel:    { flex: 1, fontSize: 16, fontWeight: "500" },
  signOutWrap:  { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 40 },
  signOutBtn:   { borderRadius: 50, paddingVertical: 16, alignItems: "center" },
  btnDisabled:  { opacity: 0.6 },
  signOutText:  { color: "#fff", fontSize: 17, fontWeight: "700" },
});