import { useCallback } from "react";

import { deleteMenu } from "@/services/menu.service";
import { MenuItem } from "@/types/menu";

interface UseMenuDeleteProps {
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

export const useMenuDelete = ({
    selectedBranch,
    menuItems,
    setMenuItems,
    fetchMenu,
}: UseMenuDeleteProps) => {
    const deleteItem = useCallback(
        async (menuId: string) => {
            const previousItems = [...menuItems];

            try {
                // Optimistic update
                setMenuItems((prev) =>
                    prev.filter(
                        (item) =>
                            item.menuId !== menuId
                    )
                );

                await deleteMenu(menuId);

                await fetchMenu(
                    selectedBranch,
                    true
                );
            } catch (error) {
                console.error(error);

                setMenuItems(previousItems);

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

    const deleteSelected = useCallback(
        async () => {
            const selected = menuItems.filter(
                (item) => item.selected
            );

            if (!selected.length) return;

            const menuIds = selected.map(
                (item) => item.menuId
            );

            const previousItems = [...menuItems];

            try {
                // Optimistic update
                setMenuItems((prev) =>
                    prev.filter(
                        (item) =>
                            !menuIds.includes(
                                item.menuId
                            )
                    )
                );

                const results =
                    await Promise.allSettled(
                        menuIds.map((menuId) =>
                            deleteMenu(menuId)
                        )
                    );

                const hasFailures =
                    results.some(
                        (result) =>
                            result.status ===
                            "rejected"
                    );

                if (hasFailures) {
                    setMenuItems(previousItems);
                }

                await fetchMenu(
                    selectedBranch,
                    true
                );
            } catch (error) {
                console.error(
                    "Bulk delete error",
                    error
                );

                setMenuItems(previousItems);

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
        deleteItem,
        deleteSelected,
    };
};