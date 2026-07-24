// components/support/SupportComposer.tsx

import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { CustomDropdown } from "@/components/CustomDropDown";
import ImagePickerField, {
    ImagePickerFieldRef,
} from "@/components/support/ImagePickerField";
import PrioritySelector, {
    SupportPriority,
} from "@/components/support/PrioritySelector";
import { IconSymbol } from "@/components/ui/icon-symbol";

import { Send } from "lucide-react-native";

interface SupportComposerProps {
  categories: string[];

  category: string;
  onCategoryChange: (value: string) => void;

  subject: string;
  onSubjectChange: (value: string) => void;

  description: string;
  onDescriptionChange: (value: string) => void;

  priority: SupportPriority;
  onPriorityChange: (value: SupportPriority) => void;

  attachments: ImagePicker.ImagePickerAsset[];
  onAttachmentsChange: (images: ImagePicker.ImagePickerAsset[]) => void;

  imagePickerRef: React.RefObject<ImagePickerFieldRef | null>;

  loading: boolean;
  onOpenImagePicker: () => void;
  onSend: () => void;
}

export default function SupportComposer({
  categories,

  category,
  onCategoryChange,

  subject,
  onSubjectChange,

  description,
  onDescriptionChange,

  priority,
  onPriorityChange,

  attachments,
  onAttachmentsChange,

  imagePickerRef,

  loading,

  onOpenImagePicker,
  onSend,
}: SupportComposerProps) {
  return (
    <View style={styles.container}>
      <CustomDropdown
        label="Category"
        placeholder="Select a category"
        options={categories}
        value={category}
        onChange={onCategoryChange}
        required
      />

      <TextInput
        style={styles.subjectInput}
        value={subject}
        onChangeText={onSubjectChange}
        placeholder="Subject (brief title)"
        placeholderTextColor="#9CA3AF"
        editable={!loading}
      />

      <PrioritySelector
        value={priority}
        onChange={onPriorityChange}
        disabled={loading}
      />

      <ImagePickerField
        ref={imagePickerRef}
        value={attachments}
        onChange={onAttachmentsChange}
        maxImages={5}
        showPickerButton={false}
      />

      <View style={styles.messageRow}>
        <TextInput
          style={styles.messageInput}
          value={description}
          onChangeText={onDescriptionChange}
          placeholder="Type your message..."
          placeholderTextColor="#9CA3AF"
          multiline
          editable={!loading}
        />

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onOpenImagePicker}
          disabled={loading}
        >
          <IconSymbol name="AddCircleIcon" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              opacity: !description.trim() || !category || loading ? 0.5 : 1,
            },
          ]}
          disabled={!description.trim() || !category || loading}
          onPress={onSend}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Send size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },

  subjectInput: {
    height: 60,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  messageInput: {
    flex: 1,
    height: 60,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    maxHeight: 100,
  },

  iconButton: {
    padding: 10,
  },

  sendButton: {
    backgroundColor: "#FF5920",
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
