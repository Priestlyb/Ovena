import { Text, View } from "react-native";

export const DashboardHeader = ({ username, styles }: any) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.welcomeText}>
          Welcome back, {username || "User"}!
        </Text>
      </View>
    </View>
  );
};
