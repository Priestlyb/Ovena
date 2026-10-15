import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export default function CutleryScreen({ value, onValueChange }: Props) {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons
        name="silverware-fork-knife"
        size={24}
        color="#fff"
        style={styles.icon}
      />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Need cutlery?</Text>

          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{
              false: "#E5E7EB",
              true: "#F8CFC4",
            }}
            thumbColor={value ? "#FFBC44" : "#FFFFFF"}
          />
        </View>

        <Text style={styles.description}>
          Only ask for cutlery when you need it to help us minimize waste.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9502E",
    borderRadius: 16,
    padding: 16,
    marginVertical: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  content: {
    flex: 1,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  icon: {
    marginTop: 2,
    marginRight: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#fff",
    paddingRight: 20,
  },
});
