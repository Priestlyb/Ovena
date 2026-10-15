import { useState } from "react";

import api from "@/services/apiClient";

import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

/* =========================================
   FEEDBACK
========================================= */
type FeedbackFn = (
  message: string,
  variant: "success" | "error" | "warning" | "info"
) => void;

/* =========================================
   IMAGE TYPE
========================================= */
export type AddonImage = {
  uri: string;
  uploadedUrl?: string;
} | null;

/* =========================================
   ADDON TYPE
========================================= */
export type Addon = {
  id?: number;
  base_item_id?: number;

  name: string;
  description: string;
  price: string;

  image: AddonImage;
};

/* =========================================
   ADDON GROUP TYPE
========================================= */
export type AddonGroup = {
  id?: number;

  name: string;
  is_required: boolean;
  max_selection: number | string;

  addons: Addon[];
};

/* =========================================
   HELPER TYPES
========================================= */
type ImageMap = Record<string, AddonImage>;
type PendingMap = Record<string, boolean>;

const keyOf = (
  groupIndex: number,
  addonIndex: number
) => `${groupIndex}-${addonIndex}`;

/* =========================================
   HOOK
========================================= */
export const useAddons = (
  showFeedback?: FeedbackFn
) => {
  const [addonGroups, setAddonGroups] =
    useState<AddonGroup[]>([]);

  /**
   * Image state for every add-on
   */
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
      | "info"
  ) => {
    showFeedback?.(message, variant);
  };

  /* =========================================
     ADD GROUP
  ========================================= */
  const addAddonGroup = () => {
    setAddonGroups((prev) => [
      ...prev,
      {
        name: "",
        is_required: false,
        max_selection: 0,
        addons: [],
      },
    ]);
  };

  /* =========================================
     ADD ADDON
  ========================================= */
  const addAddon = (
    groupIndex: number
  ) => {
    setAddonGroups((prev) =>
      prev.map((group, idx) =>
        idx === groupIndex
          ? {
            ...group,
            addons: [
              ...group.addons,
              {
                name: "",
                description: "",
                price: "0.00",
                image: null,
              },
            ],
          }
          : group
      )
    );
  };

  /* =========================================
   UPDATE ADDON FIELD
========================================= */
  const updateAddonField = <
    K extends keyof Addon
  >(
    groupIndex: number,
    addonIndex: number,
    field: K,
    value: Addon[K]
  ) => {
    setAddonGroups((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIndex) {
          return group;
        }

        return {
          ...group,
          addons: group.addons.map(
            (addon, aIdx) =>
              aIdx === addonIndex
                ? {
                  ...addon,
                  [field]: value,
                }
                : addon
          ),
        };
      })
    );
  };

  /* =========================================
     UPDATE GROUP FIELD
  ========================================= */
  const updateGroupField = <
    K extends keyof AddonGroup
  >(
    groupIndex: number,
    field: K,
    value: AddonGroup[K]
  ) => {
    setAddonGroups((prev) =>
      prev.map((group, idx) =>
        idx === groupIndex
          ? {
            ...group,
            [field]: value,
          }
          : group
      )
    );
  };

  /* =========================================
     PICK ADDON IMAGE
  ========================================= */
  const pickAddonImage = async (
    groupIndex: number,
    addonIndex: number
  ) => {
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

      const image: AddonImage = {
        uri: asset.uri,
      };

      updateAddonField(
        groupIndex,
        addonIndex,
        "image",
        image
      );

      return image;
    } catch (error: any) {
      console.log(
        "ADDON IMAGE PICK ERROR:",
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

  /* =========================================
   UPLOAD ADDON IMAGE
========================================= */
  const uploadAddonImage = async (
    groupIndex: number,
    addonIndex: number
  ): Promise<AddonImage> => {
    const addon =
      addonGroups[groupIndex]?.addons[addonIndex];

    if (!addon?.image) {
      return null;
    }

    /**
     * Already uploaded
     */
    if (addon.image.uploadedUrl) {
      return addon.image;
    }

    try {
      setUploadProgress(10);

      const fileInfo = await FileSystem.getInfoAsync(
        addon.image.uri
      );

      if (!fileInfo.exists) {
        throw new Error("Selected image not found.");
      }

      const response = await api.post(
        "/accounts/onboard/batch-gen-url/",
        {
          files: [
            {
              ref_id: `addon_${Date.now()}`,
              content_type: "image/jpeg",
              file_size: fileInfo.size || 0,
            },
          ],
        }
      );

      const uploadData = response.data?.urls?.[0];

      if (!uploadData?.upload_url) {
        throw new Error(
          "Unable to generate upload URL."
        );
      }

      setUploadProgress(50);

      const imageResponse = await fetch(
        addon.image.uri
      );

      const blob = await imageResponse.blob();

      const uploadRes = await fetch(
        uploadData.upload_url,
        {
          method: "PUT",
          headers: {
            "Content-Type": "image/jpeg",
          },
          body: blob,
        }
      );

      if (!uploadRes.ok) {
        throw new Error("Image upload failed.");
      }

      const uploadedImage: AddonImage = {
        uri: uploadData.public_url,
        uploadedUrl: uploadData.public_url,
      };

      updateAddonField(
        groupIndex,
        addonIndex,
        "image",
        uploadedImage
      );

      setUploadProgress(100);

      return uploadedImage;
    } catch (error: any) {
      console.log(
        "ADDON IMAGE UPLOAD ERROR:",
        error
      );

      showMessage(
        error?.message || "Upload failed.",
        "error"
      );

      return null;
    } finally {
      setTimeout(() => {
        setUploadProgress(0);
      }, 500);
    }
  };

  /* =========================================
     CANCEL ADDON IMAGE CHANGE
  ========================================= */
  const cancelAddonImageChange = (
    groupIndex: number,
    addonIndex: number
  ) => {
    setAddonGroups((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIndex) {
          return group;
        }

        return {
          ...group,
          addons: group.addons.map((addon, aIdx) => {
            if (aIdx !== addonIndex) {
              return addon;
            }

            if (addon.image?.uploadedUrl) {
              return {
                ...addon,
                image: {
                  uri: addon.image.uploadedUrl,
                  uploadedUrl:
                    addon.image.uploadedUrl,
                },
              };
            }

            return {
              ...addon,
              image: null,
            };
          }),
        };
      })
    );
  };

  /* =========================================
     GET ADDON IMAGE
  ========================================= */
  const getAddonImage = (
    groupIndex: number,
    addonIndex: number
  ) => {
    return (
      addonGroups[groupIndex]?.addons[
        addonIndex
      ]?.image ?? null
    );
  };

  /* =========================================
     HAS PENDING IMAGE CHANGE
  ========================================= */
  const hasPendingAddonImageChange = (
    groupIndex: number,
    addonIndex: number
  ) => {
    const image =
      addonGroups[groupIndex]?.addons[
        addonIndex
      ]?.image;

    return !!image && !image.uploadedUrl;
  };

  return {
    /* =========================================
       STATE
    ========================================= */
    addonGroups,
    setAddonGroups,

    uploadProgress,

    /* =========================================
       GROUP ACTIONS
    ========================================= */
    addAddonGroup,
    addAddon,

    updateGroupField,
    updateAddonField,

    /* =========================================
       IMAGE ACTIONS
    ========================================= */
    pickAddonImage,
    uploadAddonImage,
    cancelAddonImageChange,

    getAddonImage,
    hasPendingAddonImageChange,
  };
};