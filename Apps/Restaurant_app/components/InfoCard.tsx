// components/InfoCard.tsx

import React from "react";
import { StyleSheet, View } from "react-native";

import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  showShadow?: boolean;
  icon?: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  showShadow = true,
  icon,
}) => {
  return (
    <View style={[styles.container, showShadow && styles.shadow]}>
      <View style={styles.header}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <Text variant="h4" weight="bold">
          {title}
        </Text>
      </View>

      <Spacer size="md" />

      <View style={styles.content}>{children}</View>
    </View>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
  bold?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  bold = false,
}) => {
  return (
    <View style={styles.row}>
      <Text variant="body" color="secondary" style={styles.label}>
        {label}
      </Text>

      <Text
        variant="body"
        weight={bold ? "bold" : "regular"}
        style={styles.value}
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,

    borderWidth: 1,
    borderColor: "#F2F2F2",
  },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,

    elevation: 6,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    gap: 14,
  },

  row: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    minHeight: 24,
  },

  label: {
    flex: 1,
  },

  value: {
    flex: 1,
    textAlign: "right",
  },
});
