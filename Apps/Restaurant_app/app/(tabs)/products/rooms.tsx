import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RoomsScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="bed-outline" size={70} color="#F84E10" />
      <Text style={styles.title}>Coming Soon!!!</Text>
      <Text style={styles.sub}>
        Rooms management will be available here.
      </Text>
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
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  sub: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
});