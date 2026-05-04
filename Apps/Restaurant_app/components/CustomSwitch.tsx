// components/CustomSwitch.tsx
import React from "react";
import { Platform, StyleSheet, Switch, Text, View } from "react-native";

interface Props {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export const CustomSwitch: React.FC<Props> = ({
  label,
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E0E0E0", true: "#FF8C42" }}
        thumbColor={
          Platform.OS === "android" ? (value ? "#fff" : "#FF8C42") : undefined
        }
        ios_backgroundColor="#E0E0E0"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});
