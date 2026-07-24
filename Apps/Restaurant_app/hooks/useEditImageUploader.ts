import { useState } from "react";

import api from "@/services/apiClient";

import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

type FeedbackFn = (
  message: string,
  variant: "success" | "error" | "warning" | "info",
) => void;

type ImageType = {
  uri: string;
  uploadedUrl?: string;
};

/* =========================================
   REUSABLE IMAGE UPLOADER
========================================= */
export const useEditImageUploader = (
  showFeedback?: FeedbackFn,
) => {
  const [productImage, setProductImage] =
    useState<ImageType | null>(null);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const showMessage = (
    message: string,
    variant:
      | "success"
      | "error"
      | "warning"
      | "info",
  ) => {
    if (showFeedback) {
      showFeedback(message, variant);
    }
  };

  const handleImageUpload = async () => {
    try {
      setUploadProgress(10);

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showMessage(
          "Gallery permission is required to upload images.",
          "warning",
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
        setUploadProgress(0);

        return null;
      }

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        showMessage(
          "Invalid image selected.",
          "error",
        );

        setUploadProgress(0);

        return null;
      }

      setUploadProgress(25);

      const fileInfo =
        await FileSystem.getInfoAsync(asset.uri);

      if (!fileInfo.exists) {
        throw new Error(
          "Selected image not found.",
        );
      }

      const fileSize = fileInfo.size || 0;

      setUploadProgress(40);

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
        },
      );

      const uploadData =
        response.data?.urls?.[0];

      if (!uploadData?.upload_url) {
        throw new Error(
          "Unable to generate upload URL.",
        );
      }

      setUploadProgress(60);

      const imageResponse = await fetch(
        asset.uri,
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
        },
      );

      if (!uploadRes.ok) {
        throw new Error(
          "Image upload failed.",
        );
      }

      setUploadProgress(90);

      const finalUrl =
        uploadData.public_url || asset.uri;

      console.log("UPLOAD SUCCESS:");
      console.log(
        "uploadData:",
        uploadData,
      );
      console.log(
        "finalUrl:",
        finalUrl,
      );

      const imageObject: ImageType = {
        uri: finalUrl,
        uploadedUrl: finalUrl,
      };

      setProductImage(imageObject);

      setUploadProgress(100);

      showMessage(
        "Image uploaded successfully.",
        "success",
      );

      return imageObject;
    } catch (error: any) {
      console.log(
        "Image upload error:",
        error,
      );

      showMessage(
        error?.message || "Upload failed",
        "error",
      );

      return null;
    } finally {
      setTimeout(() => {
        setUploadProgress(0);
      }, 500);
    }
  };

  const removeImage = () => {
    setProductImage(null);
  };

  const setExistingImage = (
    imageUrl: string | null,
  ) => {
    if (!imageUrl) {
      setProductImage(null);
      return;
    }

    setProductImage({
      uri: imageUrl,
      uploadedUrl: imageUrl,
    });
  };

  return {
    productImage,

    setProductImage,

    setExistingImage,

    uploadProgress,

    handleImageUpload,

    removeImage,
  };
};