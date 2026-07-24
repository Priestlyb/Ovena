// screens/SupportReports.tsx

import React from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";

import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import { Spacer } from "@/components/atoms/Spacer";
import { Header } from "@/components/molecules/Header";

import SupportMessages from "@/components/support/SupportMessages";
import TicketChatComposer from "@/components/support/TicketChatComposer";
import TicketHeader from "@/components/support/TicketHeader";
import TicketList from "@/components/support/TicketList";

import useStaffSupportMessages from "@/hooks/support/useStaffSupportMessages";
import useStaffSupportTickets from "@/hooks/support/useStaffSupportTickets";
import useStaffTicketStatus from "@/hooks/support/useStaffTicketStatus";

export default function SupportReportsScreen() {
  const router = useRouter();

  /**
   * -----------------------------------
   * Ticket List
   * -----------------------------------
   */
  const {
    tickets,
    loadingTickets,
    refreshing,
    refreshTickets,
    selectedTicket,
    selectTicket,
  } = useStaffSupportTickets();

  /**
   * -----------------------------------
   * Ticket Status
   * -----------------------------------
   */
  const { ticketStatus, updatingStatus, toggleStatus } = useStaffTicketStatus({
    ticketId: selectedTicket?.id,
    initialStatus: selectedTicket?.status ?? "open",
    onRefreshTickets: refreshTickets,
  });

  /**
   * -----------------------------------
   * Ticket Messages
   * -----------------------------------
   */
  const {
    messages,
    loadingMessages,

    inputText,
    setInputText,

    attachments,
    setAttachments,
    openImagePicker,

    sending,
    sendMessage,
  } = useStaffSupportMessages({
    ticketId: selectedTicket?.id,
    ticketStatus,
  });

  /**
   * ===================================
   * Ticket List
   * ===================================
   */
  if (!selectedTicket) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#F9FAFB",
          paddingTop: 50,
        }}
      >
        <Header
          title="Support Tickets"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={() => router.back()}
        />

        <Spacer size="md" />

        <TicketList
          tickets={tickets}
          loading={loadingTickets}
          refreshing={refreshing}
          onRefresh={refreshTickets}
          onSelectTicket={selectTicket}
        />
      </SafeAreaView>
    );
  }

  /**
   * ===================================
   * Chat
   * ===================================
   */
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingTop: 50,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TicketHeader
          title={selectedTicket.subject}
          ticketStatus={ticketStatus}
          updatingStatus={updatingStatus}
          onBack={() => selectTicket(null as any)}
          onToggleStatus={toggleStatus}
        />

        {loadingMessages ? (
          <TicketList
            tickets={[]}
            loading
            refreshing={false}
            onRefresh={() => {}}
            onSelectTicket={() => {}}
          />
        ) : (
          <>
            <SupportMessages messages={messages} />

            <TicketChatComposer
              value={inputText}
              onChangeText={setInputText}
              onSend={sendMessage}
              loading={sending}
              disabled={ticketStatus === "closed"}
              placeholder={
                ticketStatus === "closed"
                  ? "Ticket is closed"
                  : "Type a message..."
              }
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              onPressAttachment={openImagePicker}
            />
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
