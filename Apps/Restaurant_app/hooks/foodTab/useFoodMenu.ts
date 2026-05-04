import api from "@/services/apiClient";
import {
    AvailabilityItem,
    Branch,
    MenuAPIResponse,
    MenuItem,
} from "@/types/menu";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

export const useFoodMenu = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>("");

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    // ✅ Prevent stale overwrites
    const fetchIdRef = useRef(0);

    // =========================
    // FETCH BRANCHES
    // =========================
    const fetchBranches = useCallback(async () => {
        try {
            const res = await api.get("/business/list-branches/");
            const data = res.data as any;

            const raw = Array.isArray(data?.results?.data)
                ? data.results.data
                : Array.isArray(data?.results)
                    ? data.results
                    : Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data)
                            ? data
                            : [];

            const mapped: Branch[] = raw.map((b: any) => ({
                id: String(b.id),
                name: b.name ?? "Unnamed Branch",
            }));

            setBranches(mapped);
            setSelectedBranch((prev) => prev || mapped[0]?.id || "");
        } catch (err) {
            console.error("❌ Failed to fetch branches", err);
        }
    }, []);

    // =========================
    // FETCH MENU (FIXED)
    // =========================
    const fetchMenu = useCallback(
        async (branchId: string, isSilent = false) => {
            const fetchId = ++fetchIdRef.current;

            try {
                if (!isSilent && menuItems.length === 0) {
                    setLoading(true);
                } else {
                    setRefreshing(true);
                }

                const [menuRes, availabilityRes] = await Promise.all([
                    api.get("/menu/business/menu-list/"),
                    api.get(`/menu/${branchId}/availability/`),
                ]);

                // ❗ Ignore outdated responses
                if (fetchId !== fetchIdRef.current) return;

                const menuData = menuRes.data;
                const availabilityData = availabilityRes.data;

                const availabilityRaw: AvailabilityItem[] = Array.isArray(
                    availabilityData
                )
                    ? availabilityData
                    : availabilityData?.results?.data ||
                    availabilityData?.results ||
                    availabilityData?.data ||
                    [];

                const availabilityMap = new Map<number, boolean>();
                availabilityRaw.forEach((a) => {
                    availabilityMap.set(a.id, a.is_available);
                });

                const rawMenus: MenuAPIResponse[] = Array.isArray(menuData)
                    ? menuData
                    : menuData?.menus || [];

                const items: MenuItem[] = [];

                rawMenus.forEach((menu) => {
                    menu.categories?.forEach((category) => {
                        category.items?.forEach((item) => {
                            if (!item?.base_item_id) return;

                            const idNum = item.base_item_id;

                            items.push({
                                id: String(idNum),
                                custom_name: item.custom_name ?? "Unnamed",
                                price: `₦${Number(item.price ?? 0).toLocaleString()}`,
                                inStock: availabilityMap.get(idNum) ?? false,
                                selected: false,
                                menuId: String(menu.id),
                                categoryId: String(category.id),
                            });
                        });
                    });
                });

                setMenuItems((prev) => {
                    const prevMap = new Map(prev.map((i) => [i.id, i]));

                    return items.map((item) => ({
                        ...item,
                        selected: prevMap.get(item.id)?.selected ?? false,
                    }));
                });
            } catch (err) {
                console.error("❌ Failed to fetch menu", err);
            } finally {
                if (fetchId === fetchIdRef.current) {
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        },
        [menuItems.length] // safe now because fetchId guards it
    );

    // =========================
    // BRANCH POLLING
    // =========================
    useEffect(() => {
        fetchBranches();

        const interval = setInterval(fetchBranches, 1000000);
        return () => clearInterval(interval);
    }, [fetchBranches]);

    // =========================
    // MENU POLLING
    // =========================
    useEffect(() => {
        if (!selectedBranch) return;

        fetchMenu(selectedBranch, true);

        const interval = setInterval(() => {
            fetchMenu(selectedBranch, true);
        }, 1000000);

        return () => clearInterval(interval);
    }, [selectedBranch, fetchMenu]);

    // =========================
    // ACTIONS
    // =========================
    const toggleSelect = (id: string) => {
        setMenuItems((prev) =>
            prev.map((i) =>
                i.id === id ? { ...i, selected: !i.selected } : i
            )
        );
    };

    const selectAll = () => {
        const allSelected = menuItems.every((i) => i.selected);
        setMenuItems((prev) =>
            prev.map((i) => ({ ...i, selected: !allSelected }))
        );
    };

    const handleMarkSelected = async (markInStock: boolean) => {
        const selected = menuItems.filter((i) => i.selected);
        if (!selected.length) return;

        const ids = selected.map((i) => i.id);

        const payload = {
            items: ids.map((id) => ({
                id: Number(id),
                is_available: markInStock,
            })),
        };

        try {
            // Optimistic update
            setMenuItems((prev) =>
                prev.map((item) =>
                    ids.includes(item.id)
                        ? {
                            ...item,
                            inStock: markInStock,
                            selected: false,
                        }
                        : item
                )
            );

            await api.patch(
                `/menu/${selectedBranch}/availability/bulk-update/`,
                payload
            );
        } catch (err) {
            console.error("❌ Bulk update failed", err);
            fetchMenu(selectedBranch, true);
        }
    };

    // =========================
    // DERIVED STATE
    // =========================
    const selectedItems = useMemo(
        () => menuItems.filter((i) => i.selected),
        [menuItems]
    );

    const allInStock = selectedItems.every((i) => i.inStock);
    const allOutOfStock = selectedItems.every((i) => !i.inStock);
    const isMixed =
        selectedItems.length > 0 && !allInStock && !allOutOfStock;

    // =========================
    // DELETE (FIXED - NO FLICKER)
    // =========================
    const deleteItem = async (menuId: string) => {
        console.log("🗑️ Deleting menuId:", menuId);

        try {
            // Optimistic remove
            setMenuItems((prev) =>
                prev.filter((item) => item.menuId !== menuId)
            );

            await api.delete(`/menu/business/menu/${menuId}/`);

            console.log("✅ Deleted successfully");
            // ❌ NO immediate refetch → prevents flicker
        } catch (err: any) {
            console.log("❌ STATUS:", err?.response?.status);
            console.log("❌ RESPONSE:", err?.response?.data);

            // rollback via refetch
            fetchMenu(selectedBranch, true);
        }
    };

    const deleteSelected = async () => {
        const selected = menuItems.filter((i) => i.selected);
        if (!selected.length) return;

        const menuIds = selected.map((i) => i.menuId);

        console.log("🗑️ Bulk deleting menuIds:", menuIds);

        try {
            // Optimistic remove
            setMenuItems((prev) =>
                prev.filter((item) => !menuIds.includes(item.menuId))
            );

            const results = await Promise.allSettled(
                menuIds.map((menuId) =>
                    api.delete(`/menu/business/menu/${menuId}/`)
                )
            );

            const failed = results.filter(
                (r) => r.status === "rejected"
            );

            if (failed.length > 0) {
                console.warn(
                    `⚠️ ${failed.length}/${menuIds.length} deletes failed`
                );
            } else {
                console.log("✅ All items deleted successfully");
            }

            // ❌ NO immediate refetch
        } catch (err: any) {
            console.error("❌ Bulk delete critical failure", err);
            fetchMenu(selectedBranch, true);
        }
    };

    return {
        branches,
        selectedBranch,
        setSelectedBranch,
        menuItems,
        loading,
        refreshing,

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