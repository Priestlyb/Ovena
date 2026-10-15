import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { ChatMessage } from "@/src/types/support";

import { useTheme } from "@/constants/theme";

import { SupportHeader } from "@/components/support/SupportHeader";
import { SupportMessages } from "@/components/support/SupportMessages";
import { ReplyComposer } from "@/components/support/ReplyComposer";

interface SupportConversationProps {
  title: string;

  messages: ChatMessage[];

  input: string;

  /**
   * Selected image attachments
   */
  attachments?: ImagePicker.ImagePickerAsset[];

  loadingMessages?: boolean;

  sending?: boolean;

  inputDisabled?: boolean;

  placeholder?: string;

  rightComponent?: ReactNode;

  onBack: () => void;

  onInputChange: (text: string) => void;

  onPickAttachment?: () => void;

  onRemoveAttachment?: (index: number) => void;

  onSend: () => Promise<void>;
}

export const SupportConversation = ({
  title,
  messages,
  input,
  attachments = [],
  loadingMessages = false,
  sending = false,
  inputDisabled = false,
  placeholder = "Type a message...",
  rightComponent,
  onBack,
  onInputChange,
  onPickAttachment,
  onRemoveAttachment,
  onSend,
}: SupportConversationProps) => {
  const theme = useTheme();

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SupportHeader
        title={title}
        onBack={onBack}
        rightComponent={rightComponent}
      />

      {loadingMessages ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <>
          <SupportMessages messages={messages} autoScroll />

          <ReplyComposer
            value={input}
            attachments={attachments}
            loading={sending}
            disabled={inputDisabled}
            placeholder={placeholder}
            onChangeText={onInputChange}
            onPickAttachment={onPickAttachment}
            onRemoveAttachment={onRemoveAttachment}
            onSend={onSend}
          />
        </>
      )}
    </KeyboardAvoidingView>
  );
};
