import api from "@/services/apiClient";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

type FeedbackFn = (
  message: string,
  variant: "success" | "error" | "warning" | "info",
) => void;

export type PickedImage = {
  uri: string;
  width?: number;
  height?: number;
  mimeType?: string;
};

/* =========================================
   REUSABLE IMAGE PICKER + UPLOADER
========================================= */
export const useImageUploader = (showFeedback: FeedbackFn) => {
  /* =========================================
     PICK IMAGE ONLY
  ========================================= */
  const pickImage = async (): Promise<PickedImage | null> => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showFeedback(
          "Gallery permission is required to upload images.",
          "warning",
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) return null;

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        showFeedback("Invalid image selected.", "error");
        return null;
      }

      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        mimeType: asset.mimeType,
      };
    } catch (error: any) {
      console.log("Image picker error:", error);

      showFeedback(
        error?.message || "Unable to select image.",
        "error",
      );

      return null;
    }
  };

  /* =========================================
     UPLOAD EXISTING IMAGE
  ========================================= */
  const uploadImage = async (
    imageUri: string,
  ): Promise<string | null> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);

      if (!fileInfo.exists) {
        throw new Error("Selected image not found.");
      }

      const fileSize = fileInfo.size || 0;

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

      const uploadData = response.data?.urls?.[0];

      if (!uploadData?.upload_url) {
        throw new Error("Unable to generate upload URL.");
      }

      const imageResponse = await fetch(imageUri);

      const blob = await imageResponse.blob();

      const uploadRes = await fetch(uploadData.upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": "image/jpeg",
        },
        body: blob,
      });

      if (!uploadRes.ok) {
        throw new Error("Image upload failed.");
      }

      const finalUrl = uploadData.public_url;

      console.log("UPLOAD SUCCESS");
      console.log("Upload Data:", uploadData);
      console.log("Public URL:", finalUrl);

      return finalUrl;
    } catch (error: any) {
      console.log("Image upload error:", error);

      showFeedback(
        error?.message || "Image upload failed.",
        "error",
      );

      return null;
    }
  };

  return {
    pickImage,
    uploadImage,
  };
};