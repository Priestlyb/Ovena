import { menuService } from "@/services/menuService";
import { mapMenuResponse } from "@/utils/menuMappers";
import { useEffect } from "react";

export function useLoadMenuDetails({
    menuId,
    categoryId,
    baseItemIdParam,
    setters,
    setError,
}: any) {
    useEffect(() => {
        if (!menuId || !categoryId || !baseItemIdParam) return;

        const load = async () => {
            try {
                const menus = await menuService.fetchMenus();

                console.log("RAW MENUS RESPONSE:", menus);

                const { foundMenu, foundCategory, foundItem } = mapMenuResponse(
                    menus,
                    menuId,
                    categoryId,
                    baseItemIdParam
                );

                console.log("FOUND MENU:", foundMenu);
                console.log("FOUND CATEGORY:", foundCategory);
                console.log("FOUND ITEM:", foundItem);

                // 🔥 ADD THIS: focus on addons only
                console.log(
                    "ADDON GROUPS RAW:",
                    foundItem?.addon_groups
                );

                console.log(
                    "FIRST ADDON SAMPLE:",
                    foundItem?.addon_groups?.[0]?.addons?.[0]
                );

                if (!foundMenu || !foundCategory || !foundItem) {
                    return setError("Item not found");
                }

                setters.apply(foundMenu, foundCategory, foundItem);
            } catch (err) {
                console.log("LOAD MENU ERROR:", err);
                setError("Failed to load item");
            }
        };

        load();
    }, [menuId, categoryId, baseItemIdParam]);
}