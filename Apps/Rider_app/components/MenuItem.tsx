// components/MenuItem.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

interface MenuItemProps {
  label: string;
  iconName?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
  borderBottom?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  label,
  iconName,
  onPress,
  showChevron = false,
  rightElement,
  borderBottom = true,
}) => {
  return (
    <TouchableOpacity
      style={[styles.row, borderBottom && styles.border]}
      onPress={onPress}
      activeOpacity={0.65}
    >
      {iconName && (
        <View style={styles.iconWrap}>
          <IconSymbol name={iconName} size={22} color="#111" />
        </View>
      )}
      <Text style={styles.label}>{label}</Text>
      <View style={styles.right}>
        {rightElement ?? null}
        {showChevron && (
          <IconSymbol name="ChevronRightIcon" size={18} color="#aaa" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MenuItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconWrap: {
    width: 36,
    alignItems: "center",
    marginRight: 14,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: "#111",
    fontWeight: "400",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});