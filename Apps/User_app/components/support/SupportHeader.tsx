// components/support/SupportHeader.tsx

import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/theme";

interface SupportHeaderProps {
  title: string;
  onBack: () => void;
  rightComponent?: ReactNode;
}

export const SupportHeader = ({
  title,
  onBack,
  rightComponent,
}: SupportHeaderProps) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 25,
        backgroundColor: theme.background,
      }}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={onBack}
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.surface,
          borderRadius: 50,
        }}
      >
        <IconSymbol name="ArrowLeftIcon" size={20} color={theme.textPrimary} />
      </TouchableOpacity>

      {/* Title */}
      <Text
        style={{
          flex: 1,
          marginHorizontal: 16,
          fontSize: 20,
          fontWeight: "700",
          color: theme.textPrimary,
          textAlign: "center",
        }}
        numberOfLines={1}
      >
        {title}
      </Text>

      {/* Right Slot */}
      <View
        style={{
          minWidth: 44,
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {rightComponent}
      </View>
    </View>
  );
};
