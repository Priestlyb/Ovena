import { useState } from "react";

import api from "@/services/apiClient";

import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

type FeedbackFn = (
  message: string,
  variant: "success" | "error" | "warning" | "info"
) => void;

export type ImageType = {
  uri: string;
  uploadedUrl?: string;
};

export const useEditImageUploader = (
  showFeedback?: FeedbackFn
) => {
  /**
   * Image currently displayed in the UI.
   *
   * Existing image:
   * {
   *   uri: "https://...",
   *   uploadedUrl: "https://..."
   * }
   *
   * Newly picked image:
   * {
   *   uri: "file:///..."
   * }
   */
  const [productImage, setProductImage] =
    useState<ImageType | null>(null);

  /**
   * Original image loaded from the API.
   * Used when the user presses "Cancel Change".
   */
  const [originalImage, setOriginalImage] =
    useState<ImageType | null>(null);

  /**
   * Whether the user selected a new image
   * that hasn't been uploaded yet.
   */
  const [
    hasPendingImageChange,
    setHasPendingImageChange,
  ] = useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const showMessage = (
    message: string,
    variant:
      | "success"
      | "error"
      | "warning"
      | "info"
  ) => {
    showFeedback?.(message, variant);
  };

  /**
   * ================================
   * PICK IMAGE ONLY
   * (No upload happens here anymore)
   * ================================
   */
  const handleImageUpload = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showMessage(
          "Gallery permission is required to upload images.",
          "warning"
        );
        return null;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 0.8,
        });

      if (result.canceled) {
        return null;
      }

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        showMessage(
          "Invalid image selected.",
          "error"
        );
        return null;
      }

      const image: ImageType = {
        uri: asset.uri,
      };

      setProductImage(image);
      setHasPendingImageChange(true);

      return image;
    } catch (error: any) {
      console.log(
        "Image picker error:",
        error
      );

      showMessage(
        error?.message ||
        "Failed to select image.",
        "error"
      );

      return null;
    }
  };

  /**
   * ================================
   * UPLOAD IMAGE TO R2
   * Called ONLY when Update Menu is pressed.
   * ================================
   */
  const uploadImage = async () => {
    if (!productImage) return null;

    /**
     * Already uploaded
     */
    if (productImage.uploadedUrl) {
      return productImage;
    }

    try {
      setUploadProgress(10);

      const fileInfo =
        await FileSystem.getInfoAsync(
          productImage.uri
        );

      if (!fileInfo.exists) {
        throw new Error(
          "Selected image not found."
        );
      }

      const fileSize = fileInfo.size || 0;

      setUploadProgress(25);

      const response = await api.post(
        "/accounts/onboard/batch-gen-url/",
        {
          files: [
            {
              ref_id: `img_${Date.now()}`,
              content_type: "image/jpeg",
              file_size: fileSize,
            },
          ],
        }
      );

      const uploadData =
        response.data?.urls?.[0];

      if (!uploadData?.upload_url) {
        throw new Error(
          "Unable to generate upload URL."
        );
      }

      setUploadProgress(50);

      const imageResponse = await fetch(
        productImage.uri
      );

      const blob =
        await imageResponse.blob();

      const uploadRes = await fetch(
        uploadData.upload_url,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "image/jpeg",
          },
          body: blob,
        }
      );

      if (!uploadRes.ok) {
        throw new Error(
          "Image upload failed."
        );
      }

      setUploadProgress(90);

      const uploaded: ImageType = {
        uri: uploadData.public_url,
        uploadedUrl:
          uploadData.public_url,
      };

      console.log(
        "UPLOAD SUCCESS:",
        uploaded
      );

      setProductImage(uploaded);
      setOriginalImage(uploaded);
      setHasPendingImageChange(false);

      setUploadProgress(100);

      showMessage(
        "Image uploaded successfully.",
        "success"
      );

      return uploaded;
    } catch (error: any) {
      console.log(
        "Image upload error:",
        error
      );

      showMessage(
        error?.message ||
        "Upload failed.",
        "error"
      );

      return null;
    } finally {
      setTimeout(() => {
        setUploadProgress(0);
      }, 500);
    }
  };

  /**
   * ================================
   * CANCEL IMAGE CHANGE
   * Restores original server image.
   * ================================
   */
  const cancelImageChange = () => {
    setProductImage(originalImage);
    setHasPendingImageChange(false);
  };

  /**
   * ================================
   * LOAD EXISTING IMAGE
   * ================================
   */
  const setExistingImage = (
    imageUrl: string | null
  ) => {
    if (!imageUrl) {
      setProductImage(null);
      setOriginalImage(null);
      setHasPendingImageChange(false);
      return;
    }

    const image = {
      uri: imageUrl,
      uploadedUrl: imageUrl,
    };

    setProductImage(image);
    setOriginalImage(image);
    setHasPendingImageChange(false);
  };

  return {
    productImage,
    setProductImage,

    uploadProgress,

    hasPendingImageChange,

    handleImageUpload,
    uploadImage,

    cancelImageChange,

    setExistingImage,
  };
};