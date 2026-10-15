// components/support/ReplyComposer.tsx

import React from "react";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/theme";

interface ReplyComposerProps {
  value: string;

  attachments?: ImagePicker.ImagePickerAsset[];

  loading?: boolean;

  disabled?: boolean;

  placeholder?: string;

  onChangeText: (text: string) => void;

  onPickAttachment?: () => void;

  onRemoveAttachment?: (index: number) => void;

  onSend: () => void;
}

export const ReplyComposer = ({
  value,
  attachments = [],
  loading = false,
  disabled = false,
  placeholder = "Type a message...",
  onChangeText,
  onPickAttachment,
  onRemoveAttachment,
  onSend,
}: ReplyComposerProps) => {
  const theme = useTheme();

  const isDisabled =
    disabled ||
    loading ||
    (value.trim().length === 0 && attachments.length === 0);

  return (
    <View
      style={{
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: theme.border,
        backgroundColor: theme.background,
      }}
    >
      {/* =========================
          SELECTED ATTACHMENTS
      ========================== */}

      {attachments.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            marginBottom: 12,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {attachments.map((item, index) => (
            <View
              key={`${item.uri}-${index}`}
              style={{
                width: 70,
                height: 70,
                borderRadius: 10,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                source={{
                  uri: item.uri,
                }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                }}
              />

              <TouchableOpacity
                onPress={() => onRemoveAttachment?.(index)}
                style={{
                  position: "absolute",
                  top: 3,
                  right: 3,
                  backgroundColor: theme.error,
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  ×
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* =========================
          MESSAGE INPUT
      ========================== */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            minHeight: 60,
            maxHeight: 100,
            backgroundColor: theme.surface,
            color: theme.textPrimary,
            padding: 14,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.border,
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          multiline
          editable={!loading && !disabled}
          textAlignVertical="top"
        />

        {/* ATTACH BUTTON */}

        <TouchableOpacity
          onPress={onPickAttachment}
          disabled={disabled || loading}
          style={{
            width: 45,
            height: 45,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 8,
            opacity: disabled || loading ? 0.5 : 1,
          }}
        >
          <IconSymbol name="Paperclip" size={22} color={theme.icon} />
        </TouchableOpacity>

        {/* SEND BUTTON */}

        <TouchableOpacity
          onPress={onSend}
          disabled={isDisabled}
          style={{
            width: 55,
            height: 55,
            borderRadius: 12,
            backgroundColor: theme.primary,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 8,
            opacity: isDisabled ? 0.5 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <IconSymbol name="SendIcon" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
