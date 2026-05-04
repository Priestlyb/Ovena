import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

/* ================================
   TYPES
================================ */
type ImageType = {
  uri: string;
};

type ImageSectionProps = {
  productImage: ImageType | null;
  uploadProgress: number;
  handleImageUpload: () => void;
  removeImage: () => void;
};

/* ================================
   COMPONENT
================================ */
export const ImageSection: React.FC<ImageSectionProps> = ({
  productImage,
  uploadProgress,
  handleImageUpload,
  removeImage,
}) => {
  return !productImage ? (
    <TouchableOpacity onPress={handleImageUpload}>
      <Text>Upload Image ({uploadProgress}%)</Text>
    </TouchableOpacity>
  ) : (
    <>
      <Image source={{ uri: productImage.uri }} style={{ height: 150 }} />
      <TouchableOpacity onPress={removeImage}>
        <Text>Remove</Text>
      </TouchableOpacity>
    </>
  );
};
