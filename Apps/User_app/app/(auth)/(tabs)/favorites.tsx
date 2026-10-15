import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useFavorites } from "@/hooks/favorites/useFavorites";
import { router } from "expo-router";

import { createStyles } from "@/constants/styles/favorite.styles";
import { useTheme } from "@/constants/theme";

const numColumns = 2;
const ITEM_WIDTH = Dimensions.get("window").width / numColumns - 24;

/* ================= FOODS SCREEN ================= */

function FoodsScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const {
    data: favorites,
    isLoading: favLoading,
    isError: favError,
  } = useFavorites();

  const favoriteMenuItems = useMemo(() => {
    if (!favorites?.results?.length) return [];

    return [...favorites.results]
      .sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .map((fav: any) => ({
        id: fav.menu_item?.id,
        name: fav.menu_item?.custom_name,
        description: fav.menu_item?.description,
        price: fav.menu_item?.price,
        image: fav.menu_item?.image,
        businessId: fav.buisness_id,
        createdAt: fav.created_at,
      }));
  }, [favorites]);

  if (favLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (favError) {
    return (
      <View style={styles.loader}>
        <Text
          style={{
            color: theme.textPrimary,
          }}
        >
          Failed to load favorites
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.sceneCover}>
      <FlatList
        data={favoriteMenuItems}
        keyExtractor={(item: any) => item.id?.toString()}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sceneItem}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              router.push({
                pathname: "/screens/FoodOrderPage",
                params: {
                  productId: item.id,
                  businessId: item.businessId,
                },
              });
            }}
          >
            <View
              style={[
                styles.foodContainer,
                {
                  width: ITEM_WIDTH,
                },
              ]}
            >
              <View style={styles.foodImageCover}>
                {item.image ? (
                  <Image
                    style={styles.foodImage}
                    source={{
                      uri: item.image,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <IconSymbol
                    name="FastFoodIcon"
                    size={125}
                    color={theme.icon}
                  />
                )}

                <View style={styles.cart}>
                  <IconSymbol
                    name="CartIcon"
                    size={24}
                    color={theme.secondary}
                  />
                </View>
              </View>

              <View style={styles.foodDetails}>
                <Text style={styles.foodDetailsText} numberOfLines={1}>
                  {item.name}
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    color: theme.textSecondary,
                  }}
                  numberOfLines={1}
                >
                  {item.description}
                </Text>

                <Text style={styles.foodDetailsText}>₦{item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol
              name="FastFoodIcon"
              size={100}
              color={theme.textSecondary}
            />

            <Text style={styles.emptyText}>No favorite meals found</Text>
          </View>
        }
      />
    </View>
  );
}

/* ================= HEADER ================= */

function FavoriteHeader() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.header}>
      <View style={{ width: 24 }} />

      <Text style={styles.headerTitle}>Most Loved Orders</Text>

      <View style={{ width: 24 }} />
    </View>
  );
}

/* ================= MAIN SCREEN ================= */

export default function Favorites() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <FavoriteHeader />

      <View style={{ flex: 1 }}>
        {/* Tab Header */}
        <View
          style={{
            backgroundColor: theme.background,
          }}
        >
          <View
            style={{
              height: 48,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: theme.textPrimary,
              }}
            >
              Order Your Best Meals!
            </Text>
          </View>

          {/* Tab Indicator */}
          <View
            style={{
              height: 2,
              width: "100%",
              backgroundColor: theme.primary,
            }}
          />
        </View>

        {/* Tab Content */}
        <FoodsScreen />
      </View>
    </View>
  );
}
