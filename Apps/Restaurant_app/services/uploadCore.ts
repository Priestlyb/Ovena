// uploadCore.ts

import api from "@/services/apiClient";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

export type FeedbackFn = (
    message: string,
    variant: "success" | "error" | "warning" | "info"
) => void;

export type UploadResponse = string | null;

export const uploadToServer = async (
    showFeedback: FeedbackFn,
    refIdPrefix: string
): Promise<UploadResponse> => {
    const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
        showFeedback(
            "Gallery permission is required to upload images.",
            "warning"
        );
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
    });

    if (result.canceled) return null;

    const asset = result.assets?.[0];

    if (!asset?.uri) {
        showFeedback("Invalid image selected.", "error");
        return null;
    }

    const fileInfo = await FileSystem.getInfoAsync(asset.uri);

    if (!fileInfo.exists) {
        throw new Error("Selected image not found.");
    }

    const fileSize = fileInfo.size ?? 0;

    const response = await api.post(
        "/accounts/onboard/batch-gen-url/",
        {
            files: [
                {
                    ref_id: `${refIdPrefix}_${Date.now()}`,
                    content_type: "image/jpeg",
                    file_size: fileSize,
                },
            ],
        }
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

    const finalUrl = uploadData.public_url ?? asset.uri;

    showFeedback("Image uploaded successfully.", "success");

    return finalUrl;
};