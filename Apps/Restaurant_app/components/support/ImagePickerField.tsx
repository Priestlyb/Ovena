// components/support/ImagePickerField.tsx

import * as ImagePicker from "expo-image-picker";
import React, { forwardRef, useImperativeHandle } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { Text } from "@/components/atoms/Text";
import { IconSymbol } from "@/components/ui/icon-symbol";

export interface ImagePickerFieldRef {
  openPicker: () => Promise<void>;
}

interface ImagePickerFieldProps {
  value: ImagePicker.ImagePickerAsset[];
  onChange: (images: ImagePicker.ImagePickerAsset[]) => void;

  maxImages?: number;
  multiple?: boolean;
  disabled?: boolean;
  showPickerButton?: boolean;
}

const ImagePickerField = forwardRef<ImagePickerFieldRef, ImagePickerFieldProps>(
  (
    {
      value,
      onChange,
      maxImages = 5,
      multiple = true,
      disabled = false,
      showPickerButton = true,
    },
    ref,
  ) => {
    const pickImages = async () => {
      if (disabled) return;

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library.",
        );
        return;
      }

      const remaining = maxImages - value.length;

      if (remaining <= 0) {
        Alert.alert(
          "Maximum reached",
          `You can only select up to ${maxImages} images.`,
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: !multiple,
        allowsMultipleSelection: multiple,
        selectionLimit: remaining,
        quality: 0.8,
      });

      if (result.canceled) return;

      if (multiple) {
        onChange([...value, ...result.assets].slice(0, maxImages));
      } else {
        onChange(result.assets.slice(0, 1));
      }
    };

    useImperativeHandle(ref, () => ({
      openPicker: pickImages,
    }));

    const removeImage = (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    };

    return (
      <View>
        {(value.length > 0 || showPickerButton) && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {value.map((image, index) => (
              <View
                key={`${image.assetId ?? image.uri}-${index}`}
                style={styles.imageContainer}
              >
                <Image source={{ uri: image.uri }} style={styles.image} />

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <IconSymbol name="CloseIcon" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}

            {showPickerButton && value.length < maxImages && !disabled && (
              <TouchableOpacity style={styles.addButton} onPress={pickImages}>
                <IconSymbol name="AddCircleIcon" size={30} color="#FF5920" />

                <Text
                  variant="caption"
                  align="center"
                  color="secondary"
                  style={{
                    marginTop: 6,
                  }}
                >
                  Add
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}

        {multiple && (
          <Text variant="caption" color="secondary" style={styles.helper}>
            {value.length}/{maxImages} selected
          </Text>
        )}
      </View>
    );
  },
);

ImagePickerField.displayName = "ImagePickerField";

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 25,
    marginRight: 12,
    position: "relative",
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },

  removeButton: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    padding: 2,
  },

  addButton: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },

  helper: {
    marginTop: 8,
  },
});

export default ImagePickerField;
