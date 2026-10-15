import { useState } from "react";

import api from "@/services/apiClient";

import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

type FeedbackFn = (
    message: string,
    variant: "success" | "error" | "warning" | "info",
) => void;

export type AddonImage = {
    uri: string;
    uploadedUrl?: string;
};

type ImageMap = Record<string, AddonImage | null>;
type PendingMap = Record<string, boolean>;

const keyOf = (
    groupIndex: number,
    addonIndex: number,
) => `${groupIndex}-${addonIndex}`;

export const useEditAddonImageUploader = (
    showFeedback?: FeedbackFn,
) => {
    const [images, setImages] =
        useState<ImageMap>({});

    const [originalImages, setOriginalImages] =
        useState<ImageMap>({});

    const [pendingChanges, setPendingChanges] =
        useState<PendingMap>({});

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
        showFeedback?.(message, variant);
    };

    /**
     * ============================
     * PICK IMAGE
     * ============================
     */
    const pickAddonImage = async (
        groupIndex: number,
        addonIndex: number,
    ) => {
        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                showMessage(
                    "Gallery permission is required.",
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
                showMessage(
                    "Invalid image selected.",
                    "error",
                );

                return null;
            }

            const key = keyOf(
                groupIndex,
                addonIndex,
            );

            const image: AddonImage = {
                uri: asset.uri,
            };

            setImages((prev) => ({
                ...prev,
                [key]: image,
            }));

            setPendingChanges((prev) => ({
                ...prev,
                [key]: true,
            }));

            return image;
        } catch (error: any) {
            console.log(
                "ADDON PICK IMAGE ERROR:",
                error,
            );

            showMessage(
                error?.message ??
                "Failed to select image.",
                "error",
            );

            return null;
        }
    };

    /**
     * ============================
     * LOAD EXISTING IMAGE
     * ============================
     */
    const setExistingAddonImage = (
        groupIndex: number,
        addonIndex: number,
        imageUrl: string | null,
    ) => {
        const key = keyOf(
            groupIndex,
            addonIndex,
        );

        if (!imageUrl) {
            setImages((prev) => ({
                ...prev,
                [key]: null,
            }));

            setOriginalImages((prev) => ({
                ...prev,
                [key]: null,
            }));

            setPendingChanges((prev) => ({
                ...prev,
                [key]: false,
            }));

            return;
        }

        const image: AddonImage = {
            uri: imageUrl,
            uploadedUrl: imageUrl,
        };

        setImages((prev) => ({
            ...prev,
            [key]: image,
        }));

        setOriginalImages((prev) => ({
            ...prev,
            [key]: image,
        }));

        setPendingChanges((prev) => ({
            ...prev,
            [key]: false,
        }));
    };

    /**
     * ============================
     * CANCEL IMAGE CHANGE
     * ============================
     */
    const cancelAddonImageChange = (
        groupIndex: number,
        addonIndex: number,
    ) => {
        const key = keyOf(
            groupIndex,
            addonIndex,
        );

        setImages((prev) => ({
            ...prev,
            [key]:
                originalImages[key] ?? null,
        }));

        setPendingChanges((prev) => ({
            ...prev,
            [key]: false,
        }));
    };

    /**
     * ============================
     * UPLOAD ONE ADDON IMAGE
     * ============================
     */
    const uploadAddonImage = async (
        groupIndex: number,
        addonIndex: number,
    ): Promise<AddonImage | null> => {
        const key = keyOf(
            groupIndex,
            addonIndex,
        );

        const image = images[key];

        if (!image) {
            return null;
        }

        if (image.uploadedUrl) {
            return image;
        }

        try {
            setUploadProgress(10);

            const info =
                await FileSystem.getInfoAsync(
                    image.uri,
                );

            if (!info.exists) {
                throw new Error(
                    "Selected image not found.",
                );
            }

            const response =
                await api.post(
                    "/accounts/onboard/batch-gen-url/",
                    {
                        files: [
                            {
                                ref_id: `addon_${Date.now()}`,
                                content_type:
                                    "image/jpeg",
                                file_size:
                                    info.size || 0,
                            },
                        ],
                    },
                );

            const upload =
                response.data?.urls?.[0];

            if (!upload?.upload_url) {
                throw new Error(
                    "Unable to generate upload URL.",
                );
            }

            setUploadProgress(50);

            const blob = await (
                await fetch(image.uri)
            ).blob();

            const uploadRes =
                await fetch(
                    upload.upload_url,
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
                    "Upload failed.",
                );
            }

            const uploaded: AddonImage = {
                uri: upload.public_url,
                uploadedUrl:
                    upload.public_url,
            };

            setImages((prev) => ({
                ...prev,
                [key]: uploaded,
            }));

            setOriginalImages((prev) => ({
                ...prev,
                [key]: uploaded,
            }));

            setPendingChanges((prev) => ({
                ...prev,
                [key]: false,
            }));

            setUploadProgress(100);

            return uploaded;
        } catch (error: any) {
            console.log(
                "ADDON IMAGE UPLOAD ERROR:",
                error,
            );

            showMessage(
                error?.message ??
                "Upload failed.",
                "error",
            );

            return null;
        } finally {
            setTimeout(() => {
                setUploadProgress(0);
            }, 500);
        }
    };

    const getAddonImage = (
        groupIndex: number,
        addonIndex: number,
    ) =>
        images[
        keyOf(groupIndex, addonIndex)
        ] ?? null;

    const hasPendingAddonImageChange = (
        groupIndex: number,
        addonIndex: number,
    ) =>
        pendingChanges[
        keyOf(groupIndex, addonIndex)
        ] ?? false;

    return {
        uploadProgress,

        pickAddonImage,

        uploadAddonImage,

        cancelAddonImageChange,

        setExistingAddonImage,

        getAddonImage,

        hasPendingAddonImageChange,
    };
};