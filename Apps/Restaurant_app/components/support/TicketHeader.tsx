// components/support/TicketHeader.tsx

import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

import { Text } from "@/components/atoms/Text";
import { Header } from "@/components/molecules/Header";

interface TicketHeaderProps {
  title: string;
  ticketStatus: "open" | "closed";
  updatingStatus: boolean;
  onBack: () => void;
  onToggleStatus: () => void;
}

const TicketHeader = ({
  title,
  ticketStatus,
  updatingStatus,
  onBack,
  onToggleStatus,
}: TicketHeaderProps) => {
  return (
    <Header
      title={title}
      leftIcon={<ArrowLeft size={24} color="#111827" />}
      onLeftIconPress={onBack}
      rightContent={
        <TouchableOpacity
          onPress={onToggleStatus}
          disabled={updatingStatus}
          style={{
            backgroundColor: ticketStatus === "open" ? "#FF5920" : "#10B981",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            opacity: updatingStatus ? 0.6 : 1,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "600",
            }}
          >
            {updatingStatus
              ? "..."
              : ticketStatus === "open"
                ? "Close"
                : "Reopen"}
          </Text>
        </TouchableOpacity>
      }
    />
  );
};

export default React.memo(TicketHeader);
