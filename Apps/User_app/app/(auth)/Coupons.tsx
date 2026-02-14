import { View, Text, StyleSheet } from "react-native";

export default function Coupons() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Coupons</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
});
