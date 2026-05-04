import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { useAddons } from "@/hooks/useAddons";
import { useCategories } from "@/hooks/useCategories";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useVariants } from "@/hooks/useVariants";
import api from "@/services/apiClient";

export function useEditMenuDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const itemId = Array.isArray(params.itemId)
    ? params.itemId[0]
    : params.itemId;
  const menuId = Array.isArray(params.menuId)
    ? params.menuId[0]
    : params.menuId;
  const categoryId = Array.isArray(params.categoryId)
    ? params.categoryId[0]
    : params.categoryId;

  const [menuIdState, setMenuId] = useState<any>(null);
  const [categoryIdState, setCategoryId] = useState<any>(null);
  const [itemIdState, setItemId] = useState<any>(null);
  const [baseItemId, setBaseItemId] = useState<any>(null);

  const {
    categories,
    category,
    setCategory,
    newCategory,
    setNewCategory,
    showAddCategory,
    setShowAddCategory,
    handleAddCategory,
  } = useCategories();

  const { productImage, uploadProgress, handleImageUpload, removeImage } =
    useImageUpload();

  const { variantGroups, setVariantGroups, addVariantGroup, addVariantOption } =
    useVariants();

  const { addonGroups, setAddonGroups, addAddonGroup, addAddon } = useAddons();

  const [isActive, setIsActive] = useState(true);

  const [useMergeBase, setUseMergeBase] = useState(true);
  const [manualBaseName, setManualBaseName] = useState("");
  const [manualBaseDescription, setManualBaseDescription] = useState("");
  const [manualBasePrice, setManualBasePrice] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [feedback, setFeedback] = useState({
    visible: false,
    message: "",
    variant: "error" as "success" | "error" | "warning" | "info",
  });

  const cleanText = (t: string) => (t || "").trim();
  const parsePrice = (v: string) => Number(v.replace(/,/g, "")) || 0;
  const safeNumber = (v: any) => {
    const n = typeof v === "number" ? v : parseFloat(String(v).trim());
    return Number.isFinite(n) ? n : 0;
  };

  const showError = (message: string) => {
    setFeedback({ visible: true, message, variant: "error" });
  };

  const loadMenuDetails = async () => {
    try {
      const res = await api.get("/menu/business/menu-list/");
      const menus = Array.isArray(res.data) ? res.data : res.data?.menus || [];

      let foundMenu: any;
      let foundCategory: any;
      let foundItem: any;

      menus.forEach((m: any) => {
        if (String(m.id) !== String(menuId)) return;
        foundMenu = m;

        m.categories?.forEach((c: any) => {
          if (String(c.id) !== String(categoryId)) return;
          foundCategory = c;

          c.items?.forEach((i: any) => {
            if (String(i.base_item_id) === String(itemId)) {
              foundItem = i;
            }
          });
        });
      });

      if (!foundItem) return showError("Item not found");

      setMenuId(foundMenu.id);
      setCategoryId(foundCategory.id);
      setItemId(foundItem.id ?? foundItem.base_item_id);

      setCategory(foundCategory.name);
      setName(foundItem.custom_name ?? "");
      setDescription(foundItem.description ?? "");
      setPrice(String(foundItem.price ?? ""));
      setBaseItemId(foundItem.base_item?.id ?? foundItem.base_item_id);

      setVariantGroups(
        (foundItem.variant_groups || []).map((g: any) => ({
          ...g,
          options: (g.options || []).map((o: any) => ({
            ...o,
            price_diff: safeNumber(o.price_diff),
          })),
        }))
      );

      setAddonGroups(
        (foundItem.addon_groups || []).map((g: any) => ({
          ...g,
          addons: (g.addons || []).map((a: any) => ({
            ...a,
            price: a.price ? String(a.price) : "",
          })),
        }))
      );
    } catch (err) {
      console.log(err);
      showError("Failed to load item");
    }
  };

  useEffect(() => {
    if (itemId && menuId && categoryId) loadMenuDetails();
  }, [itemId, menuId, categoryId]);

  const handleSubmit = async () => {
    try {
      if (!menuIdState || !categoryIdState || !itemIdState) {
        return showError("Missing required IDs. Reload page.");
      }

      const payload = {
        menus: [
          {
            id: menuIdState,
            name: "Main Menu",
            is_active: isActive,
            categories: [
              {
                id: categoryIdState,
                name: cleanText(category),
                items: [
                  {
                    id: itemIdState,
                    custom_name: cleanText(name),
                    description: cleanText(description),
                    price: parsePrice(price),
                    base_item: {
                      id: baseItemId,
                      name: cleanText(name),
                      description: cleanText(description),
                      price: parsePrice(price),
                    },
                    variant_groups: variantGroups.map((g: any) => ({
                      ...g,
                      options: g.options.map((o: any) => ({
                        ...o,
                        price_diff: safeNumber(o.price_diff),
                      })),
                    })),
                    addon_groups: addonGroups.map((g: any) => ({
                      ...g,
                      max_selection: Number(g.max_selection || 0),
                      addons: g.addons.map((a: any) => ({
                        ...a,
                        price: safeNumber(a.price),
                      })),
                    })),
                  },
                ],
              },
            ],
          },
        ],
      };

      const res = await api.patch("/menu/update-menus/", payload);

      setFeedback({
        visible: true,
        message: "Menu updated successfully",
        variant: "success",
      });

      setTimeout(() => router.back(), 700);

      console.log("SUCCESS", res.data);
    } catch (err: any) {
      console.log("ERROR", err);
      showError(JSON.stringify(err?.response?.data || err?.message));
    }
  };

  return {
    router,

    categories,
    category,
    setCategory,
    newCategory,
    setNewCategory,
    showAddCategory,
    setShowAddCategory,
    handleAddCategory,

    productImage,
    uploadProgress,
    handleImageUpload,
    removeImage,

    variantGroups,
    setVariantGroups,
    addVariantGroup,
    addVariantOption,

    addonGroups,
    setAddonGroups,
    addAddonGroup,
    addAddon,

    isActive,
    setIsActive,

    useMergeBase,
    setUseMergeBase,
    manualBaseName,
    setManualBaseName,
    manualBaseDescription,
    setManualBaseDescription,
    manualBasePrice,
    setManualBasePrice,

    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,

    feedback,
    setFeedback,

    handleSubmit,
  };
}