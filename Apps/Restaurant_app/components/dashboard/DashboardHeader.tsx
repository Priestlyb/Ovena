import { ToggleSwitch } from "@/components/ToggleSwitch";
import { Text, View } from "react-native";

export const DashboardHeader = ({
  username,
  isOpen,
  setIsOpen,
  styles,
}: any) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.welcomeText}>
          Welcome back, {username || "User"}!
        </Text>
      </View>
      <ToggleSwitch value={isOpen} onChange={setIsOpen} />
    </View>
  );
};
