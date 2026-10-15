// components/support/SupportTicketCard.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useTheme } from "@/constants/theme";

import { SupportTicket } from "@/hooks/supportTickets/useCustomerSupportTickets";

interface SupportTicketCardProps {
  ticket: SupportTicket;
  onPress: (ticket: SupportTicket) => void;
}

const getPriorityColor = (
  priority: string,
  theme: ReturnType<typeof useTheme>,
) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return theme.error;

    case "medium":
      return theme.warning;

    case "low":
      return theme.success;

    default:
      return theme.textSecondary;
  }
};

export const SupportTicketCard = ({
  ticket,
  onPress,
}: SupportTicketCardProps) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onPress(ticket)}
      activeOpacity={0.8}
      style={{
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: "600",
            color: theme.textPrimary,
            marginRight: 12,
          }}
          numberOfLines={1}
        >
          {ticket.subject}
        </Text>

        <View
          style={{
            backgroundColor: getPriorityColor(ticket.priority, theme),
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 10,
              fontWeight: "600",
              textTransform: "capitalize",
            }}
          >
            {ticket.priority}
          </Text>
        </View>
      </View>

      {/* Meta */}
      <Text
        style={{
          marginTop: 4,
          fontSize: 12,
          color: theme.textSecondary,
          textTransform: "capitalize",
        }}
      >
        {ticket.category} •{" "}
        {ticket.created_at
          ? new Date(ticket.created_at).toLocaleDateString()
          : ""}
      </Text>

      {/* Description */}
      <Text
        style={{
          marginTop: 8,
          fontSize: 14,
          color: theme.textPrimary,
        }}
        numberOfLines={3}
      >
        {ticket.description}
      </Text>
    </TouchableOpacity>
  );
};
