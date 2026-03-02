// components/SettingsRow.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  borderBottom?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  borderBottom = true,
}) => (
  <TouchableOpacity
    style={[styles.row, borderBottom && styles.border]}
    onPress={onPress}
    activeOpacity={onPress ? 0.65 : 1}
  >
    <View style={styles.iconWrap}>{icon}</View>
    <View style={styles.textBlock}>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  </TouchableOpacity>
);

export default SettingsRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 18,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  iconWrap: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: { flex: 1 },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
});