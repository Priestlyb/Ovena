import { useEffect, useMemo, useState } from "react";

import { useBranchAvailability } from "@/hooks/foodTab/useBranchAvailability";
import { useMenu } from "@/hooks/foodTab/useMenu";

import { MenuItem } from "@/types/menu";
import { mapMenuItems } from "@/utils/adminMenuMappers";

export const useMenuData = (
    selectedBranch: string
) => {
    const {
        menu,
        loading: menuLoading,
        refreshing: menuRefreshing,
        refetchMenu,
    } = useMenu();

    const {
        availability,
        loading: availabilityLoading,
        refreshing: availabilityRefreshing,
        refetchAvailability,
    } = useBranchAvailability(selectedBranch);

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    /**
     * Merge menu + availability whenever either changes.
     * Preserve UI-only state like "selected".
     */
    const mappedItems = useMemo(() => {
        return mapMenuItems(menu, availability);
    }, [menu, availability]);

    useEffect(() => {
        setMenuItems((prev) => {
            const previousSelections = new Map(
                prev.map((item) => [item.id, item.selected])
            );

            return mappedItems.map((item) => ({
                ...item,
                selected: previousSelections.get(item.id) ?? false,
            }));
        });
    }, [mappedItems]);

    const refreshMenu = async () => {
        await Promise.all([
            refetchMenu(),
            selectedBranch
                ? refetchAvailability()
                : Promise.resolve(),
        ]);
    };

    return {
        menuItems,
        setMenuItems,

        loading:
            menuLoading || availabilityLoading,

        refreshing:
            menuRefreshing || availabilityRefreshing,

        refreshMenu,

        refetchMenu,
        refetchAvailability,
    };
};