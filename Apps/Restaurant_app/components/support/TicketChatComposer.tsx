// components/support/TicketChatComposer.tsx

import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ImagePickerField from "@/components/support/ImagePickerField";
import { IconSymbol } from "@/components/ui/icon-symbol";

import { Send } from "lucide-react-native";

interface TicketChatComposerProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;

  attachments: ImagePicker.ImagePickerAsset[];
  onAttachmentsChange: (images: ImagePicker.ImagePickerAsset[]) => void;

  loading?: boolean;
  disabled?: boolean;

  placeholder?: string;

  onPressAttachment?: () => void;
}

const TicketChatComposer = ({
  value,
  onChangeText,
  onSend,

  attachments,
  onAttachmentsChange,

  loading = false,
  disabled = false,

  placeholder = "Type a message...",

  onPressAttachment,
}: TicketChatComposerProps) => {
  const canSend =
    (value.trim().length > 0 || attachments.length > 0) &&
    !disabled &&
    !loading;

  return (
    <View style={styles.container}>
      <ImagePickerField
        value={attachments}
        onChange={onAttachmentsChange}
        showPickerButton={false}
        disabled={disabled || loading}
      />

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          editable={!disabled && !loading}
          multiline
        />

        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={onPressAttachment}
          disabled={disabled || loading}
        >
          <IconSymbol name="AddCircleIcon" size={26} color="#000000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              opacity: canSend ? 1 : 0.5,
            },
          ]}
          disabled={!canSend}
          onPress={onSend}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Send size={18} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(TicketChatComposer);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: "#F9FAFB",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  input: {
    flex: 1,
    minHeight: 52,
    maxHeight: 120,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    textAlignVertical: "top",
  },

  attachmentButton: {
    padding: 10,
    marginLeft: 6,
  },

  sendButton: {
    backgroundColor: "#FF5920",
    padding: 10,
    borderRadius: 10,
    marginLeft: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
