// app/screens/CustomerSupportPage.tsx

import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/theme";

import { SupportComposer } from "@/components/support/SupportComposer";
import { SupportHeader } from "@/components/support/SupportHeader";
import { SupportMessages } from "@/components/support/SupportMessages";
import { SupportResponseTime } from "@/components/support/SupportResponseTime";

import { useSupportChat } from "@/hooks/supportTickets/useSupportChat";
import { useSupportForm } from "@/hooks/supportTickets/useSupportForm";

export default function CustomerSupportPage() {
  const router = useRouter();
  const theme = useTheme();

  /* =========================================
     SUPPORT FORM
  ========================================= */

  const {
    category,
    subject,
    description,
    priority,
    attachments,
    setCategory,
    setSubject,
    setDescription,
    setPriority,
    setAttachments,
    resetForm,
  } = useSupportForm();

  /* =========================================
     CHAT
  ========================================= */

  const { messages, loading, sendTicket } = useSupportChat();

  /* =========================================
     SEND
  ========================================= */

  const handleSend = async () => {
    return sendTicket({
      category,
      subject,
      description,
      priority,
      attachments,
      onSuccess: resetForm,
    });
  };

  /* =========================================
     UI
  ========================================= */

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
        paddingTop: Platform.OS === "android" ? 50 : 0,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={{ flex: 1 }}>
          <SupportHeader
            title="Customer Support"
            onBack={() => router.back()}
            rightComponent={
              <TouchableOpacity
                onPress={() => router.push("/(auth)/screens/SupportReports")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconSymbol
                  name="MessageSquareTextIcon"
                  size={22}
                  color={theme.primary}
                />
              </TouchableOpacity>
            }
          />

          <SupportResponseTime />

          <SupportMessages messages={messages} />

          <SupportComposer
            category={category}
            subject={subject}
            description={description}
            priority={priority}
            attachments={attachments}
            loading={loading}
            onCategoryChange={setCategory}
            onSubjectChange={setSubject}
            onDescriptionChange={setDescription}
            onPriorityChange={setPriority}
            onAttachmentsChange={setAttachments}
            onSend={handleSend}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
