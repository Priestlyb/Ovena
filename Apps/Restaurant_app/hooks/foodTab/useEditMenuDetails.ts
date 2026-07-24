import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

import { useAddons } from "@/hooks/useAddons";
import { useCategories } from "@/hooks/useCategories";
import { useEditImageUploader } from "@/hooks/useEditImageUploader";
import { useVariants } from "@/hooks/useVariants";


import { useMenu } from "@/hooks/foodTab/useMenu";
import { useUpdateMenu } from "@/hooks/foodTab/useUpdateMenu";
import { buildUpdatePayload, mapMenuResponse } from "@/utils/menuMappers";
import { useEditMenuState } from "./useEditMenuState";

/**
 * =========================
 * IMAGE NORMALIZER (FINAL FIX)
 * =========================
 */
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

        //console.log(
        //"FULL MENUS RESPONSE:",
        //JSON.stringify(menus, null, 2)
        //);

        if (!menu.length) return;

        const { foundMenu, foundCategory, foundItem } = mapMenuResponse(
          menu,
          menuId,
          categoryId,
          baseItemIdParam
        );

        //console.log("FOUND ITEM:", foundItem);

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
          foundItem.base_item?.id ?? foundItem.base_item_id ?? null
        );

        state.setMenuName(foundMenu.name ?? "");
        state.setIsActive(
          foundMenu.is_active !== undefined
            ? !!foundMenu.is_active
            : true
        );

        categoriesHook.setCategory(foundCategory.name ?? "");

        state.setName(foundItem.custom_name ?? "");
        state.setDescription(foundItem.description ?? "");
        state.setPrice(foundItem.price ? String(foundItem.price) : "");

        /**
         * =========================
         * IMAGE
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
          (foundItem.variant_groups || []).map((g: any) => ({
            ...g,
            options: (g.options || []).map((o: any) => ({
              ...o,
              price_diff:
                o.price_diff != null ? String(o.price_diff) : "",
            })),
          }))
        );

        /**
         * =========================
         * ADDONS (FULL FIXED)
         * =========================
         */
        const mappedAddonGroups = (foundItem.addon_groups || []).map(
          (g: any) => ({
            ...g,
            addons: (g.addons || []).map((a: any) => ({
              ...a,

              name: a.name ?? "",
              description: a.description ?? "",

              price:
                a.price !== undefined && a.price !== null
                  ? String(a.price)
                  : "",

              // 🔥 FIXED IMAGE (THIS IS THE KEY FIX)
              image: normalizeImage(a.image),

              base_item_id:
                a.base_item_id ?? a.base_item?.id ?? null,
            })),
          })
        );

        addonHook.setAddonGroups(mappedAddonGroups);
      } catch (err) {
        console.log("LOAD MENU ERROR:", err);
        showError("Failed to load item");
      }
    };

    load();
  }, [menuId, categoryId, baseItemIdParam]);

  /**
   * =========================
   * SUBMIT
   * =========================
   */
  const handleSubmit = async () => {
    if (state.isSubmitting) return;

    try {
      state.setIsSubmitting(true);

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
        image: imageHook.productImage,
        baseItemId: state.baseItemId,
        variantGroups: variantHook.variantGroups,
        addonGroups: addonHook.addonGroups,
      });

      await updateMenuMutation.mutateAsync(payload);

      state.setFeedback({
        visible: true,
        message: "Menu updated successfully",
        variant: "success",
      });

      setTimeout(() => router.back(), 700);
    } catch (err: any) {
      console.log("ERROR RESPONSE:", err?.response?.data);

      showError(JSON.stringify(err?.response?.data || err?.message));
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

    ...state,
    ...imageHook,
    ...variantHook,
    ...addonHook,

    categories: categoriesHook.categories,
    category: categoriesHook.category,
    setCategory: categoriesHook.setCategory,
    newCategory: categoriesHook.newCategory,
    setNewCategory: categoriesHook.setNewCategory,
    showAddCategory: categoriesHook.showAddCategory,
    setShowAddCategory: categoriesHook.setShowAddCategory,
    handleAddCategory: categoriesHook.handleAddCategory,

    handleSubmit,
  };
}