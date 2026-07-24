import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { styles } from "@/constants/foodTab";

import { useMenu } from "@/hooks/staff/useMenu";
import { useMenuSelection } from "@/hooks/staff/useMenuSelection";

//import FloatingButtons from "@/components/staff/FloatingButtons";
import FoodHeader from "@/components/staff/FoodHeader";
import MenuActions from "@/components/staff/MenuActions";
import MenuCard from "@/components/staff/MenuCard";
import SearchBar from "@/components/staff/SearchBar";

export default function FoodScreen() {
  const router = useRouter();

  const { menuItems, setMenuItems, loading, bulkUpdateAvailability } =
    useMenu();

  const {
    toggleSelect,
    selectAll,
    selectedItems,
    allInStock,
    allOutOfStock,
    isMixed,
  } = useMenuSelection(menuItems, setMenuItems);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = menuItems.filter((item) =>
    item.custom_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleMarkSelected = async (markInStock: boolean) => {
    const itemIds = selectedItems.map((item) => item.base_item_id);

    try {
      await bulkUpdateAvailability(itemIds, markInStock);

      setMenuItems((prev) =>
        prev.map((item) =>
          itemIds.includes(item.id)
            ? {
                ...item,
                selected: false,
              }
            : item,
        ),
      );
    } catch (error) {
      console.log("[FOOD SCREEN BULK UPDATE ERROR]", error);
    }
  };

  const handleBulkUpdate = () => {
    if (allInStock) {
      handleMarkSelected(false);
    } else if (allOutOfStock) {
      handleMarkSelected(true);
    }
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
      <FoodHeader onSearchPress={() => setShowSearch((prev) => !prev)} />

      {showSearch && (
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      )}

      <MenuActions
        selectAll={selectAll}
        handleBulkUpdate={handleBulkUpdate}
        isMixed={isMixed}
        selectedCount={selectedItems.length}
        allInStock={allInStock}
        allOutOfStock={allOutOfStock}
      />

      <FlatList
        data={filteredItems}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 0,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/screens/ProductDetails",
                params: {
                  product: JSON.stringify(item),
                },
              })
            }
          >
            <MenuCard
              item={item}
              onToggle={() => toggleSelect(item.id)}
              onEdit={() =>
                router.push({
                  pathname: "/screens/EditMenuDetails",
                  params: {
                    itemId: item.id,
                    menuId: item.menuId,
                    categoryId: item.categoryId,
                  },
                })
              }
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
