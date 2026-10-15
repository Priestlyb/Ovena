// components/Support/SupportComposer.tsx

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { IconSymbol } from "@/components/ui/icon-symbol";
import ImagePickerField from "@/components/support/ImagePickerField";
import { SUPPORT_CATEGORIES } from "@/constants/support";
import { TicketPriority } from "@/src/types/support";
import { useTheme } from "@/constants/theme";

interface SupportComposerProps {
  category: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  attachments: ImagePicker.ImagePickerAsset[];
  loading: boolean;

  onCategoryChange: (category: string) => void;
  onSubjectChange: (subject: string) => void;
  onDescriptionChange: (description: string) => void;
  onPriorityChange: (priority: TicketPriority) => void;
  onAttachmentsChange: (attachments: ImagePicker.ImagePickerAsset[]) => void;
  onSend: () => void;
}

const PRIORITIES: TicketPriority[] = ["low", "medium", "high"];

export const SupportComposer = ({
  category,
  subject,
  description,
  priority,
  attachments,
  loading,
  onCategoryChange,
  onSubjectChange,
  onDescriptionChange,
  onPriorityChange,
  onAttachmentsChange,
  onSend,
}: SupportComposerProps) => {
  const theme = useTheme();

  const disabled =
    loading || !category || !subject.trim() || !description.trim();

  return (
    <View
      style={{
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: theme.border,
        backgroundColor: theme.background,
      }}
    >
      {/* Category */}
      <Text
        style={{
          marginBottom: 8,
          fontSize: 14,
          fontWeight: "600",
          color: theme.textPrimary,
        }}
      >
        Category
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 12 }}
      >
        {SUPPORT_CATEGORIES.map((item) => {
          const selected = category === item;

          return (
            <TouchableOpacity
              key={item}
              onPress={() => onCategoryChange(item)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 999,
                backgroundColor: selected ? theme.primary : theme.surface,
                marginRight: 10,
                borderWidth: selected ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <Text
                style={{
                  color: selected ? theme.background : theme.textPrimary,
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Subject */}
      <TextInput
        style={{
          height: 55,
          backgroundColor: theme.surface,
          color: theme.textPrimary,
          paddingHorizontal: 14,
          borderRadius: 10,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: theme.border,
        }}
        value={subject}
        onChangeText={onSubjectChange}
        placeholder="Subject"
        placeholderTextColor={theme.textSecondary}
        editable={!loading}
      />

      {/* Priority 
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        {PRIORITIES.map((item) => {
          const selected = priority === item;

          return (
            <TouchableOpacity
              key={item}
              onPress={() => onPriorityChange(item)}
              style={{
                flex: 1,
                marginHorizontal: 4,
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: selected ? theme.primary : theme.surface,
                borderWidth: selected ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <Text
                style={{
                  color: selected ? theme.background : theme.textPrimary,
                  fontWeight: "700",
                  textTransform: "capitalize",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      */}

      {/* Attachments */}
      <ImagePickerField
        label="Attachments (Optional)"
        value={attachments}
        onChange={onAttachmentsChange}
        multiple
        maxImages={1}
        disabled={loading}
      />

      {/* Message */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          marginTop: 12,
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
          value={description}
          onChangeText={onDescriptionChange}
          placeholder="Type your message..."
          placeholderTextColor={theme.textSecondary}
          multiline
          editable={!loading}
          textAlignVertical="top"
        />

        <TouchableOpacity
          onPress={onSend}
          disabled={disabled}
          style={{
            width: 55,
            height: 55,
            borderRadius: 12,
            backgroundColor: theme.primary,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 10,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <IconSymbol name="SendIcon" size={20} color={theme.background} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
