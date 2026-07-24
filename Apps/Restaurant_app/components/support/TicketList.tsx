// components/support/TicketList.tsx

import React from "react";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";

import TicketCard from "./TicketCard";

export interface Ticket {
  id: string | number;
  category: string;
  subject: string;
  description: string;
  priority: string;
  created_at: string;
  status?: "open" | "closed";
}

interface TicketListProps {
  tickets: Ticket[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onSelectTicket: (ticket: Ticket) => void;
}

const TicketList = ({
  tickets,
  loading,
  refreshing,
  onRefresh,
  onSelectTicket,
}: TicketListProps) => {
  if (loading) {
    return <ActivityIndicator size="large" color="#FF5920" />;
  }

  return (
    <FlatList
      data={tickets}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TicketCard ticket={item} onPress={() => onSelectTicket(item)} />
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 20,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default React.memo(TicketList);
