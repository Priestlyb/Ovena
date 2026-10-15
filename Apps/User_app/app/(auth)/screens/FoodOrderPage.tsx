import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";

import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";

import { Counter } from "@/components/productComponents/Counter";
import { CheckboxItem } from "@/components/productComponents/CheckboxItem";
import { NutritionInfo } from "@/components/productComponents/NutritionInfo";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { CustomButton } from "@/components/productComponents/Button";

import { createStyles } from "@/constants/styles/ProductDetailScreen.styles";
import { useTheme } from "@/constants/theme";

import { useAddFavorite } from "@/hooks/favorites/useAddFavorite";
import { useRemoveFavorite } from "@/hooks/favorites/useRemoveFavorite";
import { useFavorites } from "@/hooks/favorites/useFavorites";
import { useBusinessId } from "@/hooks/homepage/useBusinessId";

const FoodOrderPage = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  /* ================= ROUTE PARAMS ================= */

  const { productId, businessId } = useLocalSearchParams<{
    productId: string;
    businessId: string;
  }>();

  /* ================= FAVORITES ================= */

  const { data: favorites } = useFavorites();

  const queryClient = useQueryClient();

  const { mutate: addFavorite, isPending: isAddingFavorite } = useAddFavorite();

  const { mutate: removeFavorite, isPending: isRemovingFavorite } =
    useRemoveFavorite();

  const isPending = isAddingFavorite || isRemovingFavorite;

  /* ================= API ================= */

  const { data: business, loading } = useBusinessId(businessId);

  const branchId = Number(businessId);

  /* ================= LOCAL STATE ================= */

  const [quantity, setQuantity] = useState(1);

  const [notes, setNotes] = useState("");

  const [imageError, setImageError] = useState(false);

  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string | undefined>
  >({});

  /* ================= PRODUCT ================= */

  const product = useMemo(() => {
    if (!business?.menus?.length) return null;

    for (const menu of business.menus) {
      for (const category of menu.categories || []) {
        const found = category.items?.find(
          (item: any) => item.id === Number(productId),
        );

        if (found) return found;
      }
    }

    return null;
  }, [business, productId]);

  /* ================= NORMALIZED PRODUCT ================= */

  const normalizedProduct = useMemo(() => {
    if (!product) return null;

    return {
      id: product.id,
      custom_name: product.custom_name,
      price: Number(product.price || 0),
      image: product.image || "",
      rating: product.rating || 0,
      time: product.time || 0,
      description: product.description || "",
      variant_groups: product.variant_groups || [],
      addon_groups: product.addon_groups || [],
    };
  }, [product]);

  /* ================= FAVORITE STATUS ================= */

  const isFavorited = useMemo(() => {
    const currentProductId = Number(normalizedProduct?.id);

    if (!currentProductId || !favorites?.results) return false;

    return favorites.results.some(
      (item: any) => Number(item?.menu_item?.id) === currentProductId,
    );
  }, [favorites?.results, normalizedProduct?.id]);

  /* ================= FAVORITE HANDLER ================= */

  const handleFavorite = () => {
    if (!normalizedProduct?.id || !branchId) return;

    const menuItemId = Number(normalizedProduct.id);

    if (isFavorited) {
      removeFavorite(
        {
          menu_item_id: menuItemId,
          branch_id: branchId,
        },
        {
          onSuccess: async () => {
            await queryClient.fetchQuery({
              queryKey: ["favorites"],
            });
          },
        },
      );
    } else {
      addFavorite(
        {
          menu_item_id: menuItemId,
          branch_id: branchId,
        },
        {
          onSuccess: async () => {
            await queryClient.fetchQuery({
              queryKey: ["favorites"],
            });
          },
        },
      );
    }
  };

  /* ================= VARIANTS ================= */

  const toggleVariant = (groupId: string, optionId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [groupId]: prev[groupId] === optionId ? undefined : optionId,
    }));
  };

  const variants = normalizedProduct?.variant_groups || [];

  /* ================= TOTAL ================= */

  const calculateTotal = useMemo(() => {
    const basePrice = Number(normalizedProduct?.price || 0);

    let total = basePrice * quantity;

    variants.forEach((group: any) => {
      const selectedOptionId = selectedVariants[group.id];

      if (selectedOptionId) {
        const option = group.options.find(
          (opt: any) => opt.id === selectedOptionId,
        );

        if (option) {
          total += Number(option.price_diff || 0) * quantity;
        }
      }
    });

    return total;
  }, [normalizedProduct, quantity, selectedVariants, variants]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!normalizedProduct) {
    return (
      <View style={styles.emptyContainer}>
        <Text
          style={{
            color: theme.textPrimary,
          }}
        >
          No product found
        </Text>
      </View>
    );
  }

  const businessName = business?.business_name;

  return (
    <View style={styles.container}>
      <View>
        {!imageError && normalizedProduct.image ? (
          <Image
            source={{
              uri: normalizedProduct.image,
            }}
            style={styles.productImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[styles.productImage, styles.fallbackIcon]}>
            <IconSymbol name="FastFoodIcon" size={250} color={theme.icon} />
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="ArrowLeftIcon" size={24} color={theme.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleFavorite}
          disabled={isPending}
        >
          <IconSymbol
            name={isFavorited ? "HeartIcon" : "OutlineHeart"}
            size={24}
            color={isFavorited ? theme.error : theme.icon}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView style={styles.scrollContent}>
          <View style={styles.productSection}>
            <View style={styles.productTitleRow}>
              <View style={styles.titleColumn}>
                <Text style={styles.productTitle}>
                  {normalizedProduct.custom_name}
                </Text>

                <Text style={styles.productPrice}>
                  ₦{normalizedProduct.price}
                </Text>

                {!!businessName && (
                  <Text
                    style={{
                      color: theme.textSecondary,
                      marginTop: 4,
                    }}
                  >
                    {businessName}
                  </Text>
                )}
              </View>

              <Counter
                value={quantity}
                onIncrement={() => setQuantity((q) => q + 1)}
                onDecrement={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                size="large"
                minValue={1}
              />
            </View>

            <View style={styles.nutritionGrid}>
              <NutritionInfo
                label="Rating"
                value={normalizedProduct.rating}
                unit="★"
              />

              <NutritionInfo
                label="Time"
                value={normalizedProduct.time}
                unit=" min"
              />
            </View>

            <Text style={styles.productDesc}>
              {normalizedProduct.description}
            </Text>

            <View style={styles.sectionDivider} />

            {variants.map((group: any) => (
              <View key={group.id} style={styles.variantGroup}>
                <Text style={styles.sectionTitle}>{group.name}</Text>

                {group.options.map((option: any) => (
                  <CheckboxItem
                    key={option.id}
                    label={option.name}
                    price={Number(option.price_diff)}
                    checked={selectedVariants[group.id] === option.id}
                    onToggle={() => toggleVariant(group.id, option.id)}
                  />
                ))}
              </View>
            ))}

            <Text style={styles.sectionTitle}>Add Notes</Text>

            <TextInput
              style={styles.notesInput}
              placeholder="Write instruction for restaurant..."
              placeholderTextColor={theme.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <CustomButton
              title={`Next  |  ₦${calculateTotal.toLocaleString("en-NG")}`}
              onPress={() => {
                router.push({
                  pathname: "/screens/AddonsDetails",

                  params: {
                    item: JSON.stringify(normalizedProduct),

                    orderMeta: JSON.stringify({
                      business_id: branchId,
                      business_name: businessName,

                      branch_id: branchId,

                      quantity,

                      selectedVariants,

                      notes,

                      total: calculateTotal,
                    }),
                  },
                });
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default FoodOrderPage;
