// app/(tabs)/products/food.tsx
import ConfirmModal from "@/components/ConfirmModal";
import { CustomDropdown } from "@/components/CustomDropDown";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useFoodMenu } from "@/hooks/foodTab/useFoodMenu";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function FoodScreen() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    branches,
    selectedBranch,
    setSelectedBranch,
    menuItems,
    loading,
    toggleSelect,
    selectAll,
    handleMarkSelected,
    selectedItems,
    allInStock,
    allOutOfStock,
    isMixed,
    deleteItem,
    deleteSelected,
  } = useFoodMenu();

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openDeleteModal = (menuId: string) => {
    setSelectedMenuId(menuId);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedMenuId(null);
    setDeleteModalVisible(false);
  };

  const confirmDelete = async () => {
    if (!selectedMenuId) return;

    try {
      setDeleteLoading(true);
      await deleteItem(selectedMenuId);
    } finally {
      setDeleteLoading(false);
      closeDeleteModal();
    }
  };

  const handleBulkUpdate = () => {
    if (allInStock) handleMarkSelected(false);
    else if (allOutOfStock) handleMarkSelected(true);
  };

  // FILTERED DATA
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems;

    return menuItems.filter((item) =>
      item.custom_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [menuItems, searchQuery]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#F84E10" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Products Management</Text>

        {/* SEARCH BUTTON */}
        <TouchableOpacity
          onPress={() => {
            setShowSearch((prev) => !prev);
            if (showSearch) setSearchQuery("");
          }}
        >
          <Ionicons name="search-outline" size={22} />
        </TouchableOpacity>
      </View>

      {/* SEARCH INPUT */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search product..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            autoFocus
          />
        </View>
      )}

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/(tabs)/products/food")}
        >
          <Text
            style={[
              styles.tabText,
              pathname.includes("food") && styles.activeTab,
            ]}
          >
            Food
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/(tabs)/products/rooms")}
        >
          <Text
            style={[
              styles.tabText,
              pathname.includes("rooms") && styles.activeTab,
            ]}
          >
            Rooms
          </Text>
        </TouchableOpacity>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.selectAllBtn} onPress={selectAll}>
          <Text>Select All</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
            <Text style={{ fontSize: 11, color: "#666", marginLeft: 5 }}>
              ⚠️ Select items with the same status
            </Text>
          )}

          <TouchableOpacity
            style={{
              marginLeft: 15,
              backgroundColor: "#ffb47e40",
              padding: 6,
              borderRadius: 25,
              justifyContent: "center",
              alignItems: "center",
            }}
            disabled={selectedItems.length === 0}
            onPress={deleteSelected}
          >
            <IconSymbol name="TrashOutline" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* DROPDOWN */}
      <View style={{ marginBottom: 10 }}>
        <CustomDropdown
          label="Branch"
          options={branches.map((b) => b.name)}
          placeholder="Select branch"
          value={branches.find((b) => b.id === selectedBranch)?.name ?? ""}
          onChange={(selectedName: string) => {
            const found = branches.find((b) => b.name === selectedName);
            if (found) setSelectedBranch(found.id);
          }}
        />
      </View>

      {/* PRODUCT LIST */}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {filteredItems.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text>No matching products</Text>
          </View>
        ) : (
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
                        {
                          backgroundColor: item.inStock ? "#F84E10" : "#ccc",
                        },
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
                    onPress={() => openDeleteModal(item.menuId)}
                  >
                    <IconSymbol name="TrashOutline" size={16} color="#333" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.checkbox, item.selected && styles.checked]}
                    onPress={() => toggleSelect(item.id)}
                  />
                </View>
              </View>
            )}
          />
        )}
      </KeyboardAvoidingView>

      {/* FLOATING BUTTONS */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/screens/addMenuItems")}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.chatFab}
        onPress={() => router.push("/screens/SupportPage")}
      >
        <Ionicons name="chatbubble-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <ConfirmModal
        visible={deleteModalVisible}
        title="Delete Item"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        variant="danger"
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  title: { fontSize: 22, fontWeight: "600" },

  // ✅ NEW STYLES
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 6,
  },
  tabItem: { flex: 1, alignItems: "center" },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#777",
    paddingBottom: 4,
    textAlign: "center",
  },
  activeTab: {
    width: "100%",
    color: "#000",
    borderBottomWidth: 2,
    borderColor: "#F84E10",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
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
    marginBottom: 25,
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
