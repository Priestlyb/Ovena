import { useBranches } from "@/hooks/foodTab/useBranches";
import { useMenuAvailability } from "@/hooks/foodTab/useMenuAvailability";
import { useMenuData } from "@/hooks/foodTab/useMenuData";
import { useMenuDelete } from "@/hooks/foodTab/useMenuDelete";
import { useMenuSelection } from "@/hooks/foodTab/useMenuSelection";

export const useFoodMenu = () => {
    const {
        branches,
        selectedBranch,
        setSelectedBranch,
    } = useBranches();

    const {
        menuItems,
        setMenuItems,
        loading: MenuLoading,
        refreshing,
        fetchMenu,
        refreshMenu,
    } = useMenuData(selectedBranch);

    const {
        toggleSelect,
        selectAll,
        selectedItems,
        allInStock,
        allOutOfStock,
        isMixed,
    } = useMenuSelection({
        menuItems,
        setMenuItems,
    });

    const { handleMarkSelected } =
        useMenuAvailability({
            selectedBranch,
            menuItems,
            setMenuItems,
            fetchMenu,
        });

    const {
        deleteItem,
        deleteSelected,
    } = useMenuDelete({
        selectedBranch,
        menuItems,
        setMenuItems,
        fetchMenu,
    });

    return {
        branches,
        selectedBranch,
        setSelectedBranch,

        menuItems,
        MenuLoading,
        refreshing,

        refreshMenu,

        toggleSelect,
        selectAll,
        handleMarkSelected,

        selectedItems,
        allInStock,
        allOutOfStock,
        isMixed,

        deleteItem,
        deleteSelected,
    };
};