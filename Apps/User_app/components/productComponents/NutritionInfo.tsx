import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "@/constants/theme";

interface NutritionInfoProps {
  label: string;
  value: string | number;
  unit: string;
}

export const NutritionInfo: React.FC<NutritionInfoProps> = ({
  label,
  value,
  unit,
}) => {
  const theme = useTheme();

  const styles = createStyles(theme);

  return (
    <View style={styles.nutritionItem}>
      <Text style={styles.nutritionValue}>
        {value}
        {unit}
      </Text>

      <Text style={styles.nutritionLabel}>{label}</Text>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    nutritionItem: {
      alignItems: "center",
    },

    nutritionValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: 4,
    },

    nutritionLabel: {
      fontSize: 11,
      color: theme.textSecondary,
    },
  });
