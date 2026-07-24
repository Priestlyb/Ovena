// hooks/useAddonsImageUploader.ts

import api from "@/services/apiClient";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

type FeedbackFn = (
  message: string,
  variant: "success" | "error" | "warning" | "info",
) => void;

/* =========================================
   TYPES
========================================= */
type UploadImageOptions = {
  refPrefix?: string;
  contentType?: string;
};

type UploadResponse = {
  upload_url?: string;
  public_url?: string;
};

/* =========================================
   ADDONS IMAGE UPLOADER
========================================= */
export const useAddonsImageUploader = (
  showFeedback: FeedbackFn,
) => {
  const uploadImage = async (
    options?: UploadImageOptions,
  ): Promise<string | null> => {
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
        showFeedback("Invalid image selected.", "error");

        return null;
      }

      console.log("SELECTED ADDON IMAGE:");
      console.log(asset);

      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

      if (!fileInfo.exists) {
        throw new Error("Selected image not found.");
      }

      const fileSize = fileInfo.size || 0;

      console.log("ADDON IMAGE FILE INFO:");
      console.log(fileInfo);

      const contentType =
        options?.contentType || "image/jpeg";

      const refPrefix =
        options?.refPrefix || "addon_img";

      const payload = {
        files: [
          {
            ref_id: `${refPrefix}_${Date.now()}`,
            content_type: contentType,
            file_size: fileSize,
          },
        ],
      };

      console.log("ADDON IMAGE URL PAYLOAD:");
      console.log(JSON.stringify(payload, null, 2));

      const response = await api.post(
        "/accounts/onboard/batch-gen-url/",
        payload,
      );

      console.log("ADDON IMAGE URL RESPONSE:");
      console.log(JSON.stringify(response.data, null, 2));

      const uploadData: UploadResponse =
        response.data?.urls?.[0];

      if (!uploadData?.upload_url) {
        throw new Error("Unable to generate upload URL.");
      }

      const imageResponse = await fetch(asset.uri);

      const blob = await imageResponse.blob();

      console.log("STARTING ADDON IMAGE UPLOAD...");

      const uploadRes = await fetch(
        uploadData.upload_url,
        {
          method: "PUT",
          headers: {
            "Content-Type": contentType,
          },
          body: blob,
        },
      );

      if (!uploadRes.ok) {
        console.log("ADDON IMAGE UPLOAD FAILED:");
        console.log("status:", uploadRes.status);

        throw new Error("Image upload failed.");
      }

      const finalUrl =
        uploadData.public_url || asset.uri;

      console.log("ADDON IMAGE UPLOAD SUCCESS:");
      console.log("uploadData:", uploadData);
      console.log("finalUrl:", finalUrl);

      showFeedback(
        "Image uploaded successfully.",
        "success",
      );

      return finalUrl;
    } catch (error: any) {
      console.log("ADDON IMAGE UPLOAD ERROR:");
      console.log(error);

      showFeedback(
        error?.message || "Upload failed",
        "error",
      );

      return null;
    }
  };

  return {
    uploadImage,
  };
};