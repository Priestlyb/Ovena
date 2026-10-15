import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import type { IconName } from "@/components/ui/icon-symbol";

import { useTheme, ThemeColors } from "@/constants/theme";

interface MenuItemProps {
  iconName: IconName;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  iconName,
  label,
  onPress,
  disabled = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      style={[styles.menuItem, disabled && styles.menuItemDisabled]}
    >
      <View style={styles.menuItemLeft}>
        <IconSymbol
          name={iconName}
          size={20}
          color={disabled ? theme.textSecondary : theme.icon}
        />

        <Text
          style={[
            styles.menuItemLabel,
            disabled && styles.menuItemLabelDisabled,
          ]}
        >
          {label}
        </Text>
      </View>

      <IconSymbol
        name="ChevronForwardIcon"
        size={20}
        color={disabled ? theme.textSecondary : theme.textSecondary}
      />
    </TouchableOpacity>
  );
};

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
    },

    menuItemDisabled: {
      opacity: 0.45,
    },

    menuItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },

    menuItemLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.textPrimary,
    },

    menuItemLabelDisabled: {
      color: theme.textSecondary,
    },
  });

export default MenuItem;
