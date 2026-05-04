import api from "@/services/apiClient";
import { getAccessToken } from "@/utils/authStorage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type MenuItem = {
  id: string;
  custom_name: string;
  price: string;
  inStock: boolean;
  selected: boolean;
  menuId: string;
  categoryId: string;
};

type MenuAPIResponse = {
  id: number;
  categories?: {
    id: number;
    name: string;
    items?: {
      base_item_id: number;
      custom_name?: string;
      description?: string;
      price?: string;
      is_available?: boolean;
    }[];
  }[];
};

export default function FoodScreen() {
  const router = useRouter();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = menuItems.filter((item) =>
    item.custom_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // =========================
  // FETCH MENU (SMART + SILENT)
  // =========================
  const fetchMenuAndAvailability = useCallback(async (isSilent = false) => {
    try {
      if (isSilent) setRefreshing(true);
      else setLoading(true);

      const token = await getAccessToken();

      const menuRes = await api.get("/menu/staff/menu-list/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const menuData = menuRes.data as any;

      const rawMenus: MenuAPIResponse[] = Array.isArray(menuData)
        ? menuData
        : Array.isArray(menuData?.menus)
          ? menuData.menus
          : [];

      const newItems: MenuItem[] = [];

      rawMenus.forEach((menu) => {
        menu.categories?.forEach((category) => {
          category.items?.forEach((item) => {
            if (!item?.base_item_id) return;

            newItems.push({
              id: String(item.base_item_id),
              custom_name: item.custom_name ?? "Unnamed",
              price: `₦${Number(item.price ?? 0).toLocaleString()}`,
              inStock: !!item.is_available,
              selected: false,
              menuId: String(menu.id),
              categoryId: String(category.id),
            });
          });
        });
      });

      // ✅ SMART MERGE (no UI reset)
      setMenuItems((prev) => {
        if (!isSilent) return newItems;

        return newItems.map((newItem) => {
          const existing = prev.find((p) => p.id === newItem.id);

          if (!existing) return newItem;

          return {
            ...newItem,
            selected: existing.selected,
          };
        });
      });
    } catch (err) {
      console.error("❌ Failed to fetch menu", err);
    } finally {
      if (isSilent) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  // =========================
  // INIT TOKEN
  // =========================
  useEffect(() => {
    const init = async () => {
      const token = await getAccessToken();
      console.log("🍔 FOOD TOKEN:", token);
      if (token) setIsReady(true);
    };

    init();
  }, []);

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    if (!isReady) return;

    fetchMenuAndAvailability(false);

    const interval = setInterval(() => {
      fetchMenuAndAvailability(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchMenuAndAvailability, isReady]);

  const toggleSelect = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const selectAll = () => {
    const allSelected = menuItems.every((item) => item.selected);
    setMenuItems((prev) =>
      prev.map((item) => ({ ...item, selected: !allSelected })),
    );
  };

  const handleMarkSelected = async (markInStock: boolean) => {
    const selectedItems = menuItems.filter((item) => item.selected);
    if (selectedItems.length === 0) return;

    const allInStock = selectedItems.every((i) => i.inStock);
    const allOutOfStock = selectedItems.every((i) => !i.inStock);
    const isMixed = !allInStock && !allOutOfStock;

    if (isMixed) {
      alert("⚠️ Please select items with the same status for bulk update.");
      return;
    }

    const targetAvailability = markInStock;
    const itemIds = selectedItems.map((i) => i.id);

    try {
      setMenuItems((prev) =>
        prev.map((item) =>
          itemIds.includes(item.id)
            ? { ...item, inStock: targetAvailability, selected: false }
            : item,
        ),
      );

      await api.patch(`/menu/availability/bulk-update/`, {
        items: itemIds.map((id) => ({
          id: Number(id),
          is_available: targetAvailability,
        })),
      });
    } catch (err) {
      console.error("❌ Failed to update availability", err);
      fetchMenuAndAvailability(false);
    }
  };

  const selectedItems = menuItems.filter((i) => i.selected);
  const allInStock = selectedItems.every((i) => i.inStock);
  const allOutOfStock = selectedItems.every((i) => !i.inStock);
  const isMixed = selectedItems.length > 0 && !allInStock && !allOutOfStock;

  const handleBulkUpdate = () => {
    if (allInStock) handleMarkSelected(false);
    else if (allOutOfStock) handleMarkSelected(true);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#F84E10" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Products Management</Text>
        <TouchableOpacity onPress={() => setShowSearch((prev) => !prev)}>
          <Ionicons name="search-outline" size={22} />
        </TouchableOpacity>
      </View>

      {showSearch && (
        <TextInput
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      )}

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.selectAllBtn} onPress={selectAll}>
          <Text>Select All</Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={[
              styles.outOfStockBtn,
              isMixed && { backgroundColor: "#ccc" },
              allOutOfStock && { backgroundColor: "#F84E10" },
            ]}
            onPress={handleBulkUpdate}
            disabled={isMixed || selectedItems.length === 0}
          >
            <Text
              style={{
                color: isMixed ? "#666" : allOutOfStock ? "#fff" : "#000",
                fontWeight: "bold",
              }}
            >
              {allInStock
                ? "Mark out of stock"
                : allOutOfStock
                  ? "Mark in stock"
                  : "Bulk Update"}
            </Text>
          </TouchableOpacity>

          {isMixed && (
            <Text style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
              ⚠️ Select items with the same status
            </Text>
          )}
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.custom_name}</Text>
              <View style={styles.priceRow}>
                <Text>{item.price}</Text>
                <Text
                  style={[
                    styles.inStock,
                    { backgroundColor: item.inStock ? "#F84E10" : "#ccc" },
                  ]}
                >
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                  router.push({
                    pathname: "/screens/EditMenuDetails",
                    params: {
                      itemId: item.id,
                      menuId: item.menuId,
                      categoryId: item.categoryId,
                    },
                  })
                }
              >
                <Ionicons name="create-outline" size={16} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.checkbox, item.selected && styles.checked]}
                onPress={() => toggleSelect(item.id)}
              />
            </View>
          </View>
        )}
      />

      {/* FABS */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/superForm2/menu-items")}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.chatFab}
        onPress={() => router.push("/screens/staffs/SupportPage")}
      >
        <Ionicons name="chatbubble-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 55,
    paddingHorizontal: 20,
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  title: { fontSize: 22, fontWeight: "600" },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 10,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    gap: 10,
  },
  selectAllBtn: {
    borderWidth: 1,
    borderStyle: "dashed",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  outOfStockBtn: {
    backgroundColor: "rgba(255, 89, 32, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  card: {
    height: 95,
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 15,
    marginVertical: 20,
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginRight: 10,
  },
  productName: { fontWeight: "600" },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  inStock: {
    color: "#fff",
    fontSize: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  editBtn: {
    padding: 6,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffb47e40",
  },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: "#333" },
  checked: { backgroundColor: "#F84E10" },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 50,
  },
  chatFab: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: "#F84E10",
    padding: 16,
    borderRadius: 50,
  },
});
