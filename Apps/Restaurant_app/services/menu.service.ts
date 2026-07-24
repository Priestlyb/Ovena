import api from "@/services/apiClient";

export const getBranches = async () => {
    return api.get("/business/list-branches/");
};

export const getMenu = async () => {
    return api.get("/menu/business/menu-list/");
};

export const updateMenus = async (payload: any) => {
    return api.patch("/menu/update-menus/", payload);
};

export const getAvailability = async (branchId: string) => {
    return api.get(`/menu/${branchId}/availability/`);
};

export const bulkUpdateAvailability = async (
    branchId: string,
    payload: {
        items: {
            id: number;
            is_available: boolean;
        }[];
    }
) => {
    return api.patch(
        `/menu/${branchId}/availability/bulk-update/`,
        payload
    );
};

export const deleteMenu = async (menuId: string) => {
    return api.delete(
        `/menu/business/${menuId}/delete/`
    );
};