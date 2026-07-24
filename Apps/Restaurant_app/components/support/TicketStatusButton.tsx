// components/support/TicketStatusButton.tsx

import React from "react";
import { TouchableOpacity } from "react-native";

import { Text } from "@/components/atoms/Text";

export type TicketStatus = "open" | "closed";

interface TicketStatusButtonProps {
  status: TicketStatus;
  loading?: boolean;
  onPress: () => void;
}

const TicketStatusButton = ({
  status,
  loading = false,
  onPress,
}: TicketStatusButtonProps) => {
  const isOpen = status === "open";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={{
        backgroundColor: isOpen ? "#FF5920" : "#10B981",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        opacity: loading ? 0.6 : 1,
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontWeight: "600",
        }}
      >
        {loading ? "..." : isOpen ? "Close" : "Reopen"}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(TicketStatusButton);
