import { useCallback, useMemo } from "react";

import { MenuItem } from "@/types/menu";

interface UseMenuSelectionProps {
    menuItems: MenuItem[];
    setMenuItems: React.Dispatch<
        React.SetStateAction<MenuItem[]>
    >;
}

export const useMenuSelection = ({
    menuItems,
    setMenuItems,
}: UseMenuSelectionProps) => {
    const toggleSelect = useCallback(
        (id: string) => {
            setMenuItems((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            selected: !item.selected,
                        }
                        : item
                )
            );
        },
        [setMenuItems]
    );

    const selectAll = useCallback(() => {
        const allSelected = menuItems.every(
            (item) => item.selected
        );

        setMenuItems((prev) =>
            prev.map((item) => ({
                ...item,
                selected: !allSelected,
            }))
        );
    }, [menuItems, setMenuItems]);

    const selectedItems = useMemo(
        () =>
            menuItems.filter(
                (item) => item.selected
            ),
        [menuItems]
    );

    const allInStock = useMemo(
        () =>
            selectedItems.every(
                (item) => item.inStock
            ),
        [selectedItems]
    );

    const allOutOfStock = useMemo(
        () =>
            selectedItems.every(
                (item) => !item.inStock
            ),
        [selectedItems]
    );

    const isMixed = useMemo(
        () =>
            selectedItems.length > 0 &&
            !allInStock &&
            !allOutOfStock,
        [
            selectedItems,
            allInStock,
            allOutOfStock,
        ]
    );

    return {
        toggleSelect,
        selectAll,

        selectedItems,
        allInStock,
        allOutOfStock,
        isMixed,
    };
};