import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

import { useAddons } from "@/hooks/useAddons";
import { useCategories } from "@/hooks/useCategories";
import { useEditImageUploader } from "@/hooks/useEditImageUploader";
import { useVariants } from "@/hooks/useVariants";

import useBulkDeleteImages from "@/hooks/foodTab/useBulkDeleteImages";
import { useBulkDeleteMenu } from "@/hooks/foodTab/useBulkDeleteMenu";
import { useMenu } from "@/hooks/foodTab/useMenu";
import { useUpdateMenu } from "@/hooks/foodTab/useUpdateMenu";

import { buildUpdatePayload, mapMenuResponse } from "@/utils/menuMappers";
import { useEditMenuState } from "./useEditMenuState";

const normalizeImage = (img: any) => {
  if (!img) return null;

  if (typeof img === "string") {
    return {
      uri: img,
      uploadedUrl: img,
    };
  }

  return {
    uri: img.uri ?? img.url ?? "",
    uploadedUrl: img.uploadedUrl ?? img.url ?? img.uri ?? "",
  };
};

export function useEditMenuDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { mutateAsync: bulkDeleteMenu } = useBulkDeleteMenu();
  const { bulkDeleteImages } = useBulkDeleteImages();

  const baseItemIdParam = Array.isArray(params.itemId)
    ? params.itemId[0]
    : params.itemId;

  const menuId = Array.isArray(params.menuId)
    ? params.menuId[0]
    : params.menuId;

  const categoryId = Array.isArray(params.categoryId)
    ? params.categoryId[0]
    : params.categoryId;

  const state = useEditMenuState();

  const categoriesHook = useCategories();
  const imageHook = useEditImageUploader();
  const variantHook = useVariants();
  const addonHook = useAddons();

  const { menu } = useMenu();
  const updateMenuMutation = useUpdateMenu();

  const showError = (msg: string) =>
    state.setFeedback({
      visible: true,
      message: msg,
      variant: "error",
    });

  /**
   * =========================
   * LOAD DATA
   * =========================
   */
  useEffect(() => {
    if (!menuId || !categoryId || !baseItemIdParam) return;

    const load = async () => {
      try {
        if (!menu.length) return;

        const {
          foundMenu,
          foundCategory,
          foundItem,
        } = mapMenuResponse(
          menu,
          menuId,
          categoryId,
          baseItemIdParam
        );

        if (!foundMenu || !foundCategory || !foundItem) {
          return showError("Item not found");
        }

        /**
         * =========================
         * HYDRATE STATE
         * =========================
         */
        state.setMenuId(foundMenu.id);
        state.setCategoryId(foundCategory.id);
        state.setItemId(foundItem.id);

        state.setBaseItemId(
          foundItem.base_item?.id ??
          foundItem.base_item_id ??
          null
        );

        state.setMenuName(foundMenu.name ?? "");
        state.setIsActive(
          foundMenu.is_active !== undefined
            ? !!foundMenu.is_active
            : true
        );

        categoriesHook.setCategory(
          foundCategory.name ?? ""
        );

        state.setName(foundItem.custom_name ?? "");
        state.setDescription(foundItem.description ?? "");
        state.setPrice(
          foundItem.price
            ? String(foundItem.price)
            : ""
        );

        /**
         * =========================
         * MAIN MENU IMAGE
         * =========================
         */
        if (foundItem.image) {
          imageHook.setExistingImage(foundItem.image);
        }

        /**
         * =========================
         * VARIANTS
         * =========================
         */
        variantHook.setVariantGroups(
          (foundItem.variant_groups || []).map(
            (group: any) => ({
              ...group,
              options: (group.options || []).map(
                (option: any) => ({
                  ...option,
                  price_diff:
                    option.price_diff != null
                      ? String(option.price_diff)
                      : "",
                })
              ),
            })
          )
        );

        /**
         * =========================
         * ADD-ONS
         * Images are stored directly
         * on addon.image
         * =========================
         */
        addonHook.setAddonGroups(
          (foundItem.addon_groups || []).map(
            (group: any) => ({
              ...group,
              addons: (group.addons || []).map(
                (addon: any) => ({
                  ...addon,

                  name: addon.name ?? "",
                  description:
                    addon.description ?? "",

                  price:
                    addon.price != null
                      ? String(addon.price)
                      : "",

                  image: normalizeImage(
                    addon.image
                  ),

                  base_item_id:
                    addon.base_item_id ??
                    addon.base_item?.id ??
                    null,
                })
              ),
            })
          )
        );
      } catch (err) {
        console.log("LOAD MENU ERROR:", err);

        showError("Failed to load item");
      }
    };

    load();
  }, [
    menuId,
    categoryId,
    baseItemIdParam,
    menu,
  ]);

  const deleteVariantOption = async (
    groupIndex: number,
    optionIndex: number
  ) => {
    const option =
      variantHook.variantGroups[groupIndex]?.options[optionIndex];

    if (!option) return;

    try {
      if (option.id) {
        await bulkDeleteMenu({
          varity: [option.id],
        });
      }

      variantHook.setVariantGroups((prev) =>
        prev.map((group, i) => {
          if (i !== groupIndex) return group;

          return {
            ...group,
            options: group.options.filter(
              (_, j) => j !== optionIndex
            ),
          };
        })
      );
    } catch (err) {
      console.log("DELETE VARIANT ERROR:", err);

      state.setFeedback({
        visible: true,
        message: "Failed to delete variant option.",
        variant: "error",
      });
    }
  };

  const deleteAddon = async (
    groupIndex: number,
    addonIndex: number
  ) => {
    const addon =
      addonHook.addonGroups[groupIndex]?.addons[addonIndex];

    if (!addon) return;

    try {
      if (addon.id) {
        await bulkDeleteMenu({
          addons: [addon.id],
        });
      }

      addonHook.setAddonGroups((prev) =>
        prev.map((group, i) => {
          if (i !== groupIndex) return group;

          return {
            ...group,
            addons: group.addons.filter(
              (_, j) => j !== addonIndex
            ),
          };
        })
      );
    } catch (err) {
      console.log("DELETE ADDON ERROR:", err);

      state.setFeedback({
        visible: true,
        message: "Failed to delete add-on.",
        variant: "error",
      });
    }
  };

  /**
 * =========================
 * SUBMIT
 * =========================
 */
  const handleSubmit = async () => {
    if (state.isSubmitting) return;

    try {
      state.setIsSubmitting(true);

      let image = imageHook.productImage;

      /**
       * =========================
       * MENU IMAGE
       * =========================
       */
      if (imageHook.hasPendingImageChange) {
        console.log("Deleting old menu image...");

        await bulkDeleteImages({
          items: [String(state.itemIdState)],
        });

        console.log("Uploading new menu image...");

        image = await imageHook.uploadImage();

        if (!image) {
          throw new Error("Menu image upload failed.");
        }
      }

      /**
       * =========================
       * ADD-ON IMAGES
       * =========================
       */
      const updatedAddonGroups = await Promise.all(
        addonHook.addonGroups.map(async (group, groupIndex) => {
          const updatedAddons = await Promise.all(
            group.addons.map(async (addon, addonIndex) => {
              // Existing server image
              if (addon.image?.uploadedUrl) {
                return addon;
              }

              // No image selected
              if (!addon.image?.uri) {
                return addon;
              }

              console.log(
                `Uploading add-on image (${groupIndex}-${addonIndex})...`
              );

              const uploadedImage =
                await addonHook.uploadAddonImage(
                  groupIndex,
                  addonIndex
                );

              if (!uploadedImage) {
                throw new Error(
                  `Failed to upload image for add-on "${addon.name}".`
                );
              }

              return {
                ...addon,
                image: uploadedImage,
              };
            })
          );

          return {
            ...group,
            addons: updatedAddons,
          };
        })
      );

      /**
       * Keep hook state in sync
       */
      addonHook.setAddonGroups(updatedAddonGroups);

      /**
       * =========================
       * BUILD PAYLOAD
       * =========================
       */
      const payload = buildUpdatePayload({
        menuId: state.menuIdState,
        menuName: state.menuName,
        isActive: state.isActive,

        categoryId: state.categoryIdState,
        categoryName: categoriesHook.category,

        itemId: state.itemIdState,

        name: state.name,
        description: state.description,
        price: state.price,

        image,

        baseItemId: state.baseItemId,

        variantGroups: variantHook.variantGroups,

        // IMPORTANT
        addonGroups: updatedAddonGroups,
      });

      console.log(
        "Payload:",
        JSON.stringify(payload, null, 2)
      );

      /**
       * =========================
       * UPDATE MENU
       * =========================
       */
      await updateMenuMutation.mutateAsync(payload);

      state.setFeedback({
        visible: true,
        message: "Menu updated successfully",
        variant: "success",
      });

      setTimeout(() => router.back(), 700);
    } catch (err: any) {
      console.log(
        "ERROR RESPONSE:",
        err?.response?.data ?? err
      );

      showError(
        JSON.stringify(
          err?.response?.data || err?.message
        )
      );
    } finally {
      state.setIsSubmitting(false);
    }
  };

  /**
   * =========================
   * RETURN
   * =========================
   */
  return {
    router,

    // State
    ...state,

    // Menu image
    ...imageHook,

    // Variants
    ...variantHook,

    // Add-ons
    ...addonHook,

    // Categories
    categories: categoriesHook.categories,
    category: categoriesHook.category,
    setCategory: categoriesHook.setCategory,
    newCategory: categoriesHook.newCategory,
    setNewCategory: categoriesHook.setNewCategory,
    showAddCategory: categoriesHook.showAddCategory,
    setShowAddCategory: categoriesHook.setShowAddCategory,
    handleAddCategory: categoriesHook.handleAddCategory,

    // Delete actions
    deleteVariantOption,
    deleteAddon,

    // Submit
    handleSubmit,
  }
}