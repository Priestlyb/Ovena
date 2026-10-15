// components/support/ImagePickerField.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { IconSymbol } from "../ui/icon-symbol";
import { useTheme } from "@/constants/theme";

interface ImagePickerFieldProps {
  value: ImagePicker.ImagePickerAsset[];
  onChange: (images: ImagePicker.ImagePickerAsset[]) => void;

  label?: string;
  disabled?: boolean;

  multiple?: boolean;
  maxImages?: number;
}

const ImagePickerField = ({
  value,
  onChange,
  label = "Photos",
  disabled = false,
  multiple = true,
  maxImages = 5,
}: ImagePickerFieldProps) => {
  const theme = useTheme();

  const requestPermission = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow photo library access to upload images.",
      );
      return false;
    }

    return true;
  };

  const pickImages = async () => {
    if (disabled) return;

    const granted = await requestPermission();

    if (!granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: !multiple,
      quality: 0.8,
      allowsMultipleSelection: multiple,
      selectionLimit: maxImages,
    });

    if (result.canceled) return;

    if (multiple) {
      const merged = [...value, ...result.assets];

      const unique = merged.filter(
        (item, index, array) =>
          array.findIndex((i) => i.uri === item.uri) === index,
      );

      onChange(unique.slice(0, maxImages));
    } else {
      onChange(result.assets.slice(0, 1));
    }
  };

  const removeImage = (uri: string) => {
    onChange(value.filter((image) => image.uri !== uri));
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          marginBottom: 8,
          fontSize: 14,
          fontWeight: "600",
          color: theme.textPrimary,
        }}
      >
        {label}
      </Text>

      <TouchableOpacity
        disabled={disabled}
        onPress={pickImages}
        style={{
          borderWidth: 1,
          borderColor: theme.border,
          borderStyle: "dashed",
          borderRadius: 10,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.surface,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <IconSymbol name="AddCircleIcon" color={theme.primary} size={24} />

        <Text
          style={{
            marginTop: 8,
            fontSize: 12,
            color: theme.textSecondary,
          }}
        >
          {multiple ? `Up to ${maxImages} images` : "Choose one image"}
        </Text>
      </TouchableOpacity>

      {value.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12 }}
        >
          {value.map((image) => (
            <View
              key={image.uri}
              style={{
                margin: 7,
              }}
            >
              <Image
                source={{ uri: image.uri }}
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 10,
                }}
              />

              {!disabled && (
                <TouchableOpacity
                  onPress={() => removeImage(image.uri)}
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -6,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: theme.error,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconSymbol
                    name="CloseIcon"
                    size={14}
                    color={theme.background}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ImagePickerField;
