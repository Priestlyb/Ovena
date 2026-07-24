import { useCallback } from "react";

import { bulkUpdateAvailability } from "@/services/menu.service";
import { MenuItem } from "@/types/menu";

interface UseMenuAvailabilityProps {
    selectedBranch: string;
    menuItems: MenuItem[];
    setMenuItems: React.Dispatch<
        React.SetStateAction<MenuItem[]>
    >;
    fetchMenu: (
        branchId: string,
        isSilent?: boolean
    ) => Promise<void>;
}

export const useMenuAvailability = ({
    selectedBranch,
    menuItems,
    setMenuItems,
    fetchMenu,
}: UseMenuAvailabilityProps) => {
    const handleMarkSelected = useCallback(
        async (markInStock: boolean) => {
            const selected = menuItems.filter(
                (item) => item.selected
            );

            if (!selected.length) return;

            // IDs used to update the UI
            const menuItemIds = selected.map(
                (item) => item.id
            );

            // IDs expected by the backend
            const baseItemIds = selected.map(
                (item) => item.base_item_id
            );

            const payload = {
                items: baseItemIds.map((id) => ({
                    id: Number(id),
                    is_available: markInStock,
                })),
            };

            console.log(
                "[Menu] Selected menu item IDs:",
                menuItemIds
            );

            console.log(
                "[Menu] Selected base item IDs:",
                baseItemIds
            );

            payload.items.forEach((item) => {
                console.log(
                    `[Menu] Sending base_item_id: ${item.id}, is_available: ${item.is_available}`
                );
            });

            console.log(
               "[Menu] Bulk update payload:",
                payload
              );

            try {
                // Optimistic update
                setMenuItems((prev) =>
                    prev.map((item) =>
                        menuItemIds.includes(item.id)
                            ? {
                                ...item,
                                inStock:
                                    markInStock,
                                is_available:
                                    markInStock,
                                selected: false,
                            }
                            : item
                    )
                );

                const response =
                    await bulkUpdateAvailability(
                        selectedBranch,
                        payload
                    );

                 console.log(
                      "[Menu] Bulk update response:",
                      response.status,
                      response.data
                 );
            } catch (error) {
                console.error(error);

                await fetchMenu(
                    selectedBranch,
                    true
                );
            }
        },
        [
            menuItems,
            selectedBranch,
            setMenuItems,
            fetchMenu,
        ]
    );

    return {
        handleMarkSelected,
    };
};