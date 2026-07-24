import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface GoogleLoadingProps {
  visible: boolean;
  message?: string;
}

const GoogleLoading: React.FC<GoogleLoadingProps> = ({
  visible,
  message = "Searching addresses...",
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#FF6B35" />

      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default GoogleLoading;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 12,

    backgroundColor: "#FFFFFF",

    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,

    borderColor: "#E5E7EB",
  },

  text: {
    marginLeft: 10,

    fontSize: 14,

    color: "#6B7280",
  },
});
