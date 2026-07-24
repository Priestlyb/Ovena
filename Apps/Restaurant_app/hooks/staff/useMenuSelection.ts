import { MenuItem } from "@/types/menu";

export function useMenuSelection(
    menuItems: MenuItem[],
    setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>,
) {
    const toggleSelect = (id: string) => {
        setMenuItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, selected: !item.selected }
                    : item,
            ),
        );
    };

    const selectAll = () => {
        const allSelected = menuItems.every((item) => item.selected);

        setMenuItems((prev) =>
            prev.map((item) => ({
                ...item,
                selected: !allSelected,
            })),
        );
    };

    const selectedItems = menuItems.filter((i) => i.selected);

    const allInStock = selectedItems.every((i) => i.inStock);

    const allOutOfStock = selectedItems.every((i) => !i.inStock);

    const isMixed =
        selectedItems.length > 0 &&
        !allInStock &&
        !allOutOfStock;

    return {
        toggleSelect,
        selectAll,
        selectedItems,
        allInStock,
        allOutOfStock,
        isMixed,
    };
}