// app/(tabs)/products/food.tsx
import ConfirmModal from "@/components/ConfirmModal";
import { CustomDropdown } from "@/components/CustomDropDown";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { styles } from "@/constants/foodStyles";
import { useFoodMenu } from "@/hooks/foodTab/useFoodMenu";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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
    MenuLoading,
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
  if (MenuLoading) {
    return (
      <View style={styles.loadingContainer}>
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

            if (showSearch) {
              setSearchQuery("");
            }
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

        <View style={styles.actionsRight}>
          <TouchableOpacity
            style={[
              styles.outOfStockBtn,
              isMixed && styles.mixedButton,
              allOutOfStock && styles.activeButton,
            ]}
            onPress={handleBulkUpdate}
            disabled={isMixed || selectedItems.length === 0}
          >
            <Text
              style={[
                styles.bulkButtonText,
                isMixed
                  ? styles.mixedButtonText
                  : allOutOfStock
                    ? styles.activeButtonText
                    : styles.defaultButtonText,
              ]}
            >
              {allInStock
                ? "Mark out of stock"
                : allOutOfStock
                  ? "Mark in stock"
                  : "Bulk Update"}
            </Text>
          </TouchableOpacity>

          {isMixed && (
            <Text style={styles.warningText}>
              ⚠️ Select items with the same status
            </Text>
          )}

          {selectedItems.length > 0 && (
            <TouchableOpacity
              style={styles.deleteSelectedBtn}
              onPress={deleteSelected}
            >
              <IconSymbol name="TrashOutline" size={20} color="#333" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* DROPDOWN */}
      <View style={styles.dropdownContainer}>
        <CustomDropdown
          label="Branches"
          options={branches.map((b) => b.name)}
          placeholder="Select branch"
          value={branches.find((b) => b.id === selectedBranch)?.name ?? ""}
          onChange={(selectedName: string) => {
            const found = branches.find((b) => b.name === selectedName);

            if (found) {
              setSelectedBranch(found.id);
            }
          }}
        />
      </View>

      {/* PRODUCT LIST */}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>No matching products</Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  console.log("[SELECTED PRODUCT]", item);

                  router.push({
                    pathname: "/screens/ProductDetails",
                    params: {
                      product: JSON.stringify(item),
                    },
                  });
                }}
              >
                <View style={styles.card}>
                  <View style={styles.image}>
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  </View>

                  <View style={styles.cardContent}>
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
              </TouchableOpacity>
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

      {/*
      <TouchableOpacity
        style={styles.chatFab}
        onPress={() => router.push("/screens/SupportPage")}
      >
        <Ionicons name="chatbubble-outline" size={24} color="#fff" />
      </TouchableOpacity>
      */}

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
