// components/Support/SupportResponseTime.tsx

import React from "react";
import { View, Text } from "react-native";

import { useTheme } from "@/constants/theme";

export const SupportResponseTime = () => {
  const theme = useTheme();

  return (
    <View style={{ paddingHorizontal: 20, backgroundColor: theme.background }}>
      <Text
        style={{
          textAlign: "center",
          color: theme.textSecondary,
          fontSize: 14,
          lineHeight: 20,
        }}
      >
        Our support team is ready to assist you and will
      </Text>

      <Text
        style={{
          textAlign: "center",
          color: theme.textPrimary,
          fontSize: 14,
          fontWeight: "700",
          marginTop: 4,
          lineHeight: 20,
        }}
      >
        respond as soon as possible.
      </Text>
    </View>
  );
};
