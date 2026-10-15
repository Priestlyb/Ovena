// screen/SupportReports.tsx

import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { useTheme } from "@/constants/theme";
import { createStyles } from "@/constants/styles/support";

import { useSupportReports } from "@/hooks/supportTickets/useSupportReports";

import { SupportHeader } from "@/components/support/SupportHeader";
import { SupportConversation } from "@/components/support/SupportConversation";
import { SupportTicketCard } from "@/components/support/SupportTicketCard";

const SupportReportsScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  const {
    /* =========================
       TICKET LIST
    ========================== */

    loading,

    tickets,

    refreshing,

    onRefresh,

    /* =========================
       CONVERSATION
    ========================== */

    selectedTicket,

    selectTicket,

    clearSelectedTicket,

    messages,

    loadingMessages,

    /* =========================
       COMPOSER
    ========================== */

    inputText,

    setInputText,

    attachments,

    setAttachments,

    sending,

    sendMessage,

    /* =========================
       STATUS
    ========================== */

    ticketStatus,

    updatingStatus,

    toggleTicketStatus,
  } = useSupportReports();

  const handlePickAttachment = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        console.log("Media permission denied");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      setAttachments((prev) => [...prev, ...result.assets]);
    } catch (error) {
      console.log("[PICK ATTACHMENT ERROR]", error);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  if (selectedTicket) {
    return (
      <SafeAreaView style={styles.container}>
        <SupportConversation
          title={selectedTicket.subject}
          messages={messages}
          input={inputText}
          attachments={attachments}
          loadingMessages={loadingMessages}
          sending={sending}
          inputDisabled={ticketStatus === "closed"}
          placeholder={
            ticketStatus === "closed" ? "Ticket is closed" : "Type a message..."
          }
          onBack={clearSelectedTicket}
          onInputChange={setInputText}
          onPickAttachment={handlePickAttachment}
          onRemoveAttachment={handleRemoveAttachment}
          onSend={sendMessage}
          rightComponent={
            <TouchableOpacity
              onPress={toggleTicketStatus}
              disabled={updatingStatus}
              style={{
                backgroundColor:
                  ticketStatus === "open" ? theme.primary : theme.success,
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SupportHeader title="Support Tickets" onBack={() => router.back()} />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{
            marginTop: 20,
          }}
        />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            padding: 16,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
              progressBackgroundColor={theme.background}
            />
          }
          renderItem={({ item }) => (
            <SupportTicketCard ticket={item} onPress={selectTicket} />
          )}
          ListEmptyComponent={
            <View
              style={{
                marginTop: 100,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme.textSecondary,
                }}
              >
                No support tickets found
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default SupportReportsScreen;
