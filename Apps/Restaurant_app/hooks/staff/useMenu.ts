import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import api from "@/services/apiClient";
import { MenuAPIResponse, MenuItem } from "@/types/menu";
import { getAccessToken } from "@/utils/authStorage";

const MENU_CACHE_KEY = "staff_menu_cache";

export function useMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMenuAndAvailability = useCallback(
    async (isSilent = false, preserveSelection = true) => {
      try {
        if (isSilent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const token = await getAccessToken();

        const menuRes = await api.get("/menu/staff/menu-list/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const menuData = menuRes.data;

        const rawMenus: MenuAPIResponse[] = Array.isArray(menuData)
          ? menuData
          : Array.isArray(menuData?.menus)
            ? menuData.menus
            : [];

        const newItems: MenuItem[] = [];

        rawMenus.forEach((menu) => {
          menu.categories?.forEach((category) => {
            category.items?.forEach((item) => {
              if (!item?.base_item_id) return;

              newItems.push({
                ...item,

                id: String(item.id),

                base_item_id: String(item.base_item_id),

                custom_name: item.custom_name ?? "Unnamed",

                description: item.description ?? "",

                image: item.image ?? "",

                price: `₦${Number(item.price ?? 0).toLocaleString()}`,

                is_available: item.is_available,

                inStock: !!item.is_available,

                variant_groups: item.variant_groups ?? [],

                addon_groups: item.addon_groups ?? [],

                selected: false,

                menuId: String(menu.id),

                categoryId: String(category.id),

                categoryName: category.name ?? "",

                menuName: menu.name ?? "",
              });
            });
          });
        });

        setMenuItems((prev) => {
          // Clear all selections when requested
          if (!preserveSelection) {
            return newItems.map((item) => ({
              ...item,
              selected: false,
            }));
          }

          // Preserve current selections during refresh
          return newItems.map((newItem) => {
            const existing = prev.find((p) => p.id === newItem.id);

            return {
              ...newItem,
              selected: existing?.selected ?? false,
            };
          });
        });

        await AsyncStorage.setItem(MENU_CACHE_KEY, JSON.stringify(newItems));
      } catch (err) {
        console.error("❌ Failed to fetch menu", err);
      } finally {
        if (isSilent) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const loadCachedMenu = async () => {
      try {
        const cached = await AsyncStorage.getItem(MENU_CACHE_KEY);

        if (cached) {
          const parsed: MenuItem[] = JSON.parse(cached);

          setMenuItems(parsed);
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Failed to load menu cache", error);
      }

      fetchMenuAndAvailability(true);
    };

    loadCachedMenu();
  }, [fetchMenuAndAvailability]);

  useFocusEffect(
    useCallback(() => {
      fetchMenuAndAvailability(true);
    }, [fetchMenuAndAvailability]),
  );

  const bulkUpdateAvailability = async (
    itemIds: string[],
    targetAvailability: boolean,
  ) => {
    console.log("\n==============================");
    console.log("[BULK AVAILABILITY UPDATE]");
    console.log("==============================");

    console.log("[INPUT] itemIds:", itemIds);

    console.log("[INPUT] targetAvailability:", targetAvailability);

    try {
      const token = await getAccessToken();

      console.log("[TOKEN FOUND]", token ? "YES" : "NO");

      const payload = {
        items: itemIds.map((id) => ({
          id: Number(id),
          is_available: targetAvailability,
        })),
      };

      console.log("[PAYLOAD]", JSON.stringify(payload, null, 2));

      console.log("[REQUEST]", "PATCH /menu/availability/bulk-update/");

      const response = await api.patch(
        "/menu/availability/bulk-update/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("[RESPONSE STATUS]", response.status);

      console.log("[RESPONSE DATA]", JSON.stringify(response.data, null, 2));

      console.log("[REFRESH]", "Refreshing menu...");

      await fetchMenuAndAvailability(true, false);
    } catch (error: any) {
      console.log("==============================");
      console.log("[AVAILABILITY ERROR]");

      console.log("[STATUS]", error?.response?.status);

      console.log("[STATUS TEXT]", error?.response?.statusText);

      console.log(
        "[RESPONSE DATA]",
        JSON.stringify(error?.response?.data, null, 2),
      );

      console.log(
        "[REQUEST CONFIG]",
        JSON.stringify(
          {
            url: error?.config?.url,
            method: error?.config?.method,
            data: error?.config?.data,
          },
          null,
          2,
        ),
      );

      console.log("[FULL ERROR]", error);

      console.log("==============================\n");
    }
  };

  return {
    menuItems,
    setMenuItems,
    loading,
    refreshing,
    fetchMenuAndAvailability,
    bulkUpdateAvailability,
  };
}
