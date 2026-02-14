// screens/TermsScreen.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const TermsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.text}>
          Welcome to the Ovena Rider App. By using this app, you agree to the following terms and conditions:
        </Text>
        <Text style={styles.text}>
          1. Riders must comply with all traffic and safety laws.{"\n"}
          2. Earnings are based on deliveries completed.{"\n"}
          3. The company reserves the right to modify schedules and policies.{"\n"}
          4. Personal data will be handled according to our privacy policy.{"\n"}
          5. Any violation may result in suspension or termination of account.
        </Text>
        <Text style={styles.text}>Thank you for using Ovena Rider App!</Text>
      </ScrollView>
    </View>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  content: { paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 15, lineHeight: 22 },
});
