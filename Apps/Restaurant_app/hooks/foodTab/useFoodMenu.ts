import { useBranches } from "@/hooks/foodTab/useBranches";
import { useBulkDeleteMenu } from "@/hooks/foodTab/useBulkDeleteMenu";
import { useMenuAvailability } from "@/hooks/foodTab/useMenuAvailability";
import { useMenuData } from "@/hooks/foodTab/useMenuData";
import { useMenuSelection } from "@/hooks/foodTab/useMenuSelection";

export const useFoodMenu = () => {
    /* ================= BRANCH ================= */

    const {
        branches,
        selectedBranch,
        setSelectedBranch,
    } = useBranches();


    /* ================= MENU DATA ================= */

    const {
        menuItems,
        setMenuItems,

        loading: menuLoading,

        refreshing,

        refreshMenu,

        refetchMenu,

        refetchAvailability,

    } = useMenuData(selectedBranch);


    const fetchMenu = async (
        branchId: string,
        isSilent?: boolean,
    ) => {
        await refetchMenu();
    };


    /* ================= SELECTION ================= */

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



    /* ================= AVAILABILITY ================= */

    const {
        handleMarkSelected,

    } = useMenuAvailability({

        selectedBranch,

        menuItems,

        setMenuItems,

        fetchMenu,

    });



    /* ================= DELETE ================= */

    const {
        mutateAsync: bulkDeleteMenu,
        isPending: deleteLoading,
    } = useBulkDeleteMenu();



    const deleteItem = async (menuId: string) => {
        await bulkDeleteMenu({
            menus: [Number(menuId)],
        });
    };



    const deleteSelected = async () => {
        const ids = selectedItems.map((item) => Number(item.menuId));

        if (!ids.length) return;

        await bulkDeleteMenu({
            menus: ids,
        });
    };



    return {

        /* ================= BRANCH ================= */

        branches,

        selectedBranch,

        setSelectedBranch,


        /* ================= MENU ================= */

        menuItems,

        setMenuItems,

        menuLoading,

        refreshing,


        refreshMenu,

        refetchMenu,

        refetchAvailability,


        /* ================= SELECTION ================= */

        toggleSelect,

        selectAll,


        selectedItems,

        allInStock,

        allOutOfStock,

        isMixed,


        /* ================= ACTIONS ================= */

        handleMarkSelected,


        deleteItem,

        deleteSelected,

        deleteLoading,

    };
};