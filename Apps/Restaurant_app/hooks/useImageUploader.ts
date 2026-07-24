import api from "@/services/apiClient";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

type FeedbackFn = (
  message: string,
  variant: "success" | "error" | "warning" | "info",
) => void;

/* =========================================
   REUSABLE IMAGE UPLOADER
========================================= */
export const useImageUploader = (showFeedback: FeedbackFn) => {
  const uploadImage = async (): Promise<string | null> => {
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

      if (result.canceled) return null;

      const asset = result.assets[0];

      if (!asset?.uri) {
        showFeedback("Invalid image selected.", "error");
        return null;
      }

      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

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

      const imageResponse = await fetch(asset.uri);
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

      const finalUrl = uploadData.public_url || asset.uri;

      console.log("UPLOAD SUCCESS:");
      console.log("uploadData:", uploadData);
      console.log("finalUrl:", finalUrl);

      showFeedback("Image uploaded successfully.", "success");

      return finalUrl;
    } catch (error: any) {
      console.log("Image upload error:", error);

      showFeedback(error?.message || "Upload failed", "error");

      return null;
    }
  };

  return { uploadImage };
};