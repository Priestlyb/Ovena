// screens/AccountScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import PageHeader from "../components/PageHeader";
import MenuItem from "../components/MenuItem";
import ScreenWrapper from "../components/ScreenWrapper";

// Sub-screens
import DocumentsScreen from "./DocumentsScreen";
import PaymentScreen from "./PaymentScreen";
import EditInfoScreen from "./EditInfoScreen";
import AppSettingsScreen from "./AppSettingsScreen";

interface AccountScreenProps {
  onBack: () => void;
}

type SubScreen = "Documents" | "Payment" | "EditInfo" | "AppSettings" | null;

const AccountScreen: React.FC<AccountScreenProps> = ({ onBack }) => {
  const [subScreen, setSubScreen] = useState<SubScreen>(null);

  const closeSubScreen = () => setSubScreen(null);

  const renderSubScreen = () => {
    switch (subScreen) {
      case "Documents":   return <DocumentsScreen onBack={closeSubScreen} />;
      case "Payment":     return <PaymentScreen onBack={closeSubScreen} />;
      case "EditInfo":    return <EditInfoScreen onBack={closeSubScreen} />;
      case "AppSettings": return <AppSettingsScreen onBack={closeSubScreen} />;
      default:            return null;
    }
  };

  return (
    <>
      <ScreenWrapper>
        <PageHeader title="Account" onBack={onBack} />

        {/* Vehicle row */}
        <View style={styles.vehicleRow}>
          <View style={styles.vehicleAvatar} />
          <View>
            <Text style={styles.vehicleName}>Vehicle</Text>
            <Text style={styles.vehicleSub}>NIU NQi</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Menu items — each navigates to its sub-screen */}
        <MenuItem
          label="Documents"
          iconName="DocumentIcon"
          showChevron
          onPress={() => setSubScreen("Documents")}
        />
        <MenuItem
          label="Payment"
          iconName="PaymentIcon"
          showChevron
          onPress={() => setSubScreen("Payment")}
        />
        <MenuItem
          label="Edit Information"
          iconName="PencilIcon"
          showChevron
          onPress={() => setSubScreen("EditInfo")}
        />
        <MenuItem
          label="Privacy"
          iconName="LockIcon"
          showChevron
          onPress={() => Alert.alert("Privacy", "Privacy settings coming soon.")}
        />
        <MenuItem
          label="App Settings"
          iconName="SettingsIcon"
          showChevron
          borderBottom={false}
          onPress={() => setSubScreen("AppSettings")}
        />

        {/* Sign out */}
        <View style={styles.signOutWrap}>
          <TouchableOpacity
            style={styles.signOutBtn}
            activeOpacity={0.8}
            onPress={() => Alert.alert("Sign Out", "Are you sure?", [
              { text: "Cancel", style: "cancel" },
              { text: "Sign Out", style: "destructive" },
            ])}
          >
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>

      {/* Sub-screen modal */}
      <Modal
        visible={subScreen !== null}
        animationType="slide"
        onRequestClose={closeSubScreen}
        presentationStyle="fullScreen"
      >
        {renderSubScreen()}
      </Modal>
    </>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  vehicleAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#d4d4d4",
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  vehicleSub: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
  },
  signOutWrap: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  signOutBtn: {
    backgroundColor: "#D44C0C",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  signOutText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});