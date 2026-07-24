// components/support/TicketCard.tsx

import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@/components/atoms/Text";

export interface SupportTicket {
  id: string | number;
  category: string;
  subject: string;
  description: string;
  priority: string;
  created_at: string;
  status?: "open" | "closed";
}

interface TicketCardProps {
  ticket: SupportTicket;
  onPress: (ticket: SupportTicket) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "#EF4444";
    case "medium":
      return "#F59E0B";
    case "low":
      return "#10B981";
    default:
      return "#6B7280";
  }
};

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => onPress(ticket)}
    >
      <View style={styles.header}>
        <Text variant="body" weight="semibold">
          {ticket.subject}
        </Text>

        <View
          style={[
            styles.priorityBadge,
            {
              backgroundColor: getPriorityColor(ticket.priority),
            },
          ]}
        >
          <Text variant="caption" style={styles.priorityText}>
            {ticket.priority}
          </Text>
        </View>
      </View>

      <Text variant="caption" color="secondary" style={styles.meta}>
        {ticket.category} • {new Date(ticket.created_at).toLocaleDateString()}
      </Text>

      <Text
        variant="body"
        color="secondary"
        style={styles.description}
        numberOfLines={2}
      >
        {ticket.description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  meta: {
    marginTop: 4,
  },

  description: {
    marginTop: 8,
  },

  priorityBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  priorityText: {
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
});

export default TicketCard;
