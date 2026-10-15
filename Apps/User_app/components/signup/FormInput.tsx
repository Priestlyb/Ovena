import React from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";

import { useTheme } from "@/constants/theme";
import { IconSymbol, IconName } from "@/components/ui/icon-symbol";

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: IconName;
  [key: string]: any;
};

export default function FormInput({
  label,
  value,
  onChangeText,
  icon,
  ...props
}: Props) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View>
      <View style={styles.labelRow}>
        {icon && (
          <IconSymbol
            name={icon}
            size={18}
            color={theme.primary}
            style={styles.labelIcon}
          />
        )}
        <Text style={styles.label}>{label}</Text>
      </View>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholderTextColor={theme.textSecondary}
        selectionColor={theme.primary}
        cursorColor={theme.primary}
        {...props}
      />
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    labelRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 25,
    },

    labelIcon: {
      marginRight: 8,
    },

    label: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
    },

    input: {
      borderWidth: 1.5,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      color: theme.textPrimary,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 18,
      marginTop: 10,
      fontSize: 15,
    },
  });
