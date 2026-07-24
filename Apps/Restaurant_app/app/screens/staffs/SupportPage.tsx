// SupportPage.tsx

import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

import SupportComposer from "@/components/support/SupportComposer";
import SupportHeader from "@/components/support/SupportHeader";
import SupportMessages from "@/components/support/SupportMessages";

import { SUPPORT_CATEGORIES } from "@/data/support";

import useStaffSupportChat from "@/hooks/support/useStaffSupportChat";
import useSupportForm from "@/hooks/support/useSupportForm";

export default function SupportPage() {
  const router = useRouter();

  const {
    category,
    setCategory,

    subject,
    setSubject,

    description,
    setDescription,

    priority,
    setPriority,

    attachments,
    setAttachments,

    imagePickerRef,
    openImagePicker,

    resetForm,
  } = useSupportForm();

  const { loading, messages, sendTicket } = useStaffSupportChat();

  const handleSend = () => {
    sendTicket({
      category,
      subject,
      description,
      priority,
      attachments,
      onSuccess: resetForm,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.container}>
          <SupportHeader
            onBack={() => router.back()}
            onReports={() => router.push("/screens/staffs/SupportReports")}
          />

          <SupportMessages messages={messages} />

          <SupportComposer
            categories={SUPPORT_CATEGORIES}
            category={category}
            onCategoryChange={setCategory}
            subject={subject}
            onSubjectChange={setSubject}
            description={description}
            onDescriptionChange={setDescription}
            priority={priority}
            onPriorityChange={setPriority}
            attachments={attachments}
            onAttachmentsChange={setAttachments}
            imagePickerRef={imagePickerRef}
            loading={loading}
            onOpenImagePicker={openImagePicker}
            onSend={handleSend}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },

  keyboard: {
    flex: 1,
  },

  container: {
    flex: 1,
  },
});
