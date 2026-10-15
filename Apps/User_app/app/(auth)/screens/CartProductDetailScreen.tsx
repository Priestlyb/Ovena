import React, { useEffect, useMemo, useState } from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import { useRouter, useLocalSearchParams } from "expo-router";

import { CustomButton } from "@/components/productComponents/Button";
import { Counter } from "@/components/productComponents/Counter";
import { CheckboxItem } from "@/components/productComponents/CheckboxItem";
import { NutritionInfo } from "@/components/productComponents/NutritionInfo";
import { IconSymbol } from "@/components/ui/icon-symbol";

import { useAddFavorite } from "@/hooks/favorites/useAddFavorite";
import { useRemoveFavorite } from "@/hooks/favorites/useRemoveFavorite";
import { useFavorites } from "@/hooks/favorites/useFavorites";
import { useBusinessId } from "@/hooks/homepage/useBusinessId";

import { useCartStore } from "@/src/store/cartStore";

import { createStyles } from "@/constants/styles/ProductDetailScreen.styles";

import { useTheme } from "@/constants/theme";

const ProductDetailScreen = () => {
  const router = useRouter();

  const theme = useTheme();

  const styles = createStyles(theme);

  const params = useLocalSearchParams<{
    item?: string;
    orderMeta?: string;
    businessId?: string;
    branchId?: string;
    menuItemId?: string;
    editCartKey?: string;
  }>();

  const carts = useCartStore((state) => state.carts);

  const parsedBusinessId = Number(params.businessId);

  const { data: business } = useBusinessId(parsedBusinessId || undefined);

  const { mutate: addFavorite, isPending: isAddingFavorite } = useAddFavorite();

  const { mutate: removeFavorite, isPending: isRemovingFavorite } =
    useRemoveFavorite();

  const { data: favorites } = useFavorites();

  const isPending = isAddingFavorite || isRemovingFavorite;

  const [isFavoriteLocal, setIsFavoriteLocal] = useState(false);

  /* ================= PRODUCT ================= */

  const product = useMemo(() => {
    if (params.item) {
      try {
        return JSON.parse(params.item);
      } catch {
        return null;
      }
    }

    if (!business) {
      return null;
    }

    const menuItemId = Number(params.menuItemId);

    for (const menu of business.menus ?? []) {
      for (const category of menu.categories ?? []) {
        const found = category.items?.find(
          (item: any) => item.id === menuItemId,
        );

        if (found) {
          return found;
        }
      }
    }

    return null;
  }, [params.item, params.menuItemId, business]);

  /* ================= FAVORITE ================= */

  const isFavorited = useMemo(() => {
    const productId = Number(product?.id);

    if (!productId || !favorites?.results) {
      return false;
    }

    return favorites.results.some(
      (item: any) => Number(item?.menu_item?.id) === productId,
    );
  }, [favorites?.results, product?.id]);

  useEffect(() => {
    setIsFavoriteLocal(isFavorited);
  }, [isFavorited]);

  /* ================= ORDER META ================= */

  const orderMeta = useMemo(() => {
    try {
      if (!params.orderMeta) {
        return {};
      }

      return JSON.parse(params.orderMeta);
    } catch {
      return {};
    }
  }, [params.orderMeta]);

  const branchId = Number(orderMeta?.branch_id) || Number(params.branchId);

  const businessId = Number(orderMeta?.business_id ?? params.businessId ?? 0);

  const businessName =
    orderMeta?.business_name ?? business?.business_name ?? "";

  /* ================= STATE ================= */

  const [quantity, setQuantity] = useState(1);

  const [notes, setNotes] = useState("");

  const [imageError, setImageError] = useState(false);

  const [selectedVariants, setSelectedVariants] = useState<
    Record<number, number | undefined>
  >({});

  /* ================= VARIANTS ================= */

  const variants = product?.variant_groups ?? [];

  const toggleVariant = (groupId: number, optionId: number) => {
    setSelectedVariants((previous) => ({
      ...previous,

      [groupId]: previous[groupId] === optionId ? undefined : optionId,
    }));
  };

  /* ================= TOTAL ================= */

  const calculateTotal = useMemo(() => {
    let total = Number(product?.price ?? 0) * quantity;

    variants.forEach((group: any) => {
      const selected = selectedVariants[group.id];

      if (selected) {
        const option = group.options?.find((item: any) => item.id === selected);

        if (option) {
          total += Number(option.price_diff ?? 0) * quantity;
        }
      }
    });

    return total;
  }, [product, quantity, selectedVariants, variants]);

  /* ================= RESTORE CART ================= */

  useEffect(() => {
    if (!params.editCartKey || !branchId) {
      return;
    }

    const cartItem = carts?.[branchId]?.find(
      (item) => item.key === params.editCartKey,
    );

    if (!cartItem) {
      return;
    }

    setQuantity(cartItem.quantity);

    setNotes(cartItem.notes ?? "");

    const restored: any = {};

    cartItem.variants?.forEach((variant: any) => {
      if (variant.group_id != null) {
        restored[variant.group_id] = variant.id;

        return;
      }

      const group = product?.variant_groups?.find(
        (g: any) => g.name === variant.group,
      );

      if (group) {
        restored[group.id] = variant.id;
      }
    });

    setSelectedVariants(restored);
  }, [params.editCartKey, branchId, carts, product]);

  /* ================= FAVORITE HANDLER ================= */

  const handleFavorite = () => {
    if (!product?.id || !branchId) {
      return;
    }

    const menuItemId = Number(product.id);

    if (isFavoriteLocal) {
      setIsFavoriteLocal(false);

      removeFavorite(
        {
          menu_item_id: menuItemId,

          branch_id: branchId,
        },
        {
          onError: () => {
            setIsFavoriteLocal(true);
          },
        },
      );
    } else {
      setIsFavoriteLocal(true);

      addFavorite(
        {
          menu_item_id: menuItemId,

          branch_id: branchId,
        },
        {
          onError: () => {
            setIsFavoriteLocal(false);
          },
        },
      );
    }
  };

  if (!product) {
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

  return (
    <View style={styles.container}>
      {/* ================= IMAGE ================= */}

      <View>
        {!imageError && product.image ? (
          <Image
            source={{
              uri: product.image,
            }}

            style={styles.productImage}

            resizeMode="cover"

            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[styles.productImage, styles.fallbackIcon]}>
            <IconSymbol
              name="FastFoodIcon"

              size={250}

              color={theme.icon}
            />
          </View>
        )}

        {/* BACK BUTTON */}

        <TouchableOpacity
          onPress={() => router.back()}

          style={styles.backButton}
        >
          <IconSymbol
            name="ArrowLeftIcon"

            size={24}

            color={theme.icon}
          />
        </TouchableOpacity>

        {/* FAVORITE BUTTON */}

        <TouchableOpacity
          style={styles.menuButton}

          onPress={handleFavorite}

          disabled={isPending}
        >
          <IconSymbol
            name={isFavoriteLocal ? "HeartIcon" : "OutlineHeart"}

            size={24}

            color={isFavoriteLocal ? theme.error : theme.icon}
          />
        </TouchableOpacity>
      </View>

      {/* ================= CONTENT ================= */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}

        style={styles.keyboardContainer}

        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollContent}

          showsVerticalScrollIndicator={false}
        >
          <View style={styles.productSection}>
            {/* TITLE */}

            <View style={styles.productTitleRow}>
              <View style={styles.titleColumn}>
                <Text style={styles.productTitle}>{product.custom_name}</Text>

                <Text style={styles.productPrice}>
                  ₦{Number(product.price ?? 0).toLocaleString("en-NG")}
                </Text>

                {!!businessName && (
                  <Text
                    style={[
                      {
                        marginTop: 4,
                        color: theme.textSecondary,
                      },
                    ]}
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

            {/* NUTRITION */}

            <View style={styles.nutritionGrid}>
              <NutritionInfo
                label="Rating"

                value={product.rating || 0}

                unit="★"
              />

              <NutritionInfo
                label="Time"

                value={product.time || 30}

                unit=" min"
              />
            </View>

            {/* DESCRIPTION */}

            <Text style={styles.productDesc}>
              {product.description || "No description available"}
            </Text>

            <View style={styles.sectionDivider} />

            {/* ================= VARIANTS ================= */}

            {!!variants.length &&
              variants.map((group: any) => (
                <View
                  key={group.id}

                  style={styles.variantGroup}
                >
                  <Text style={styles.sectionTitle}>{group.name}</Text>

                  {group.options?.map((option: any) => (
                    <CheckboxItem
                      key={option.id}

                      label={option.name}

                      price={Number(option.price_diff ?? 0)}

                      checked={selectedVariants[group.id] === option.id}

                      onToggle={() => toggleVariant(group.id, option.id)}
                    />
                  ))}
                </View>
              ))}

            {/* ================= NOTES ================= */}

            <Text style={styles.sectionTitle}>Add Notes</Text>

            <TextInput
              style={styles.notesInput}

              placeholder="Write instruction for restaurant..."

              placeholderTextColor={theme.textSecondary}

              multiline

              value={notes}

              onChangeText={setNotes}
            />

            {/* ================= NEXT BUTTON ================= */}

            <CustomButton
              title={`Next  |  ₦${calculateTotal.toLocaleString("en-NG")}`}

              onPress={() => {
                router.push({
                  pathname: "/screens/AddonsDetails",

                  params: {
                    item: JSON.stringify(product),

                    orderMeta: JSON.stringify({
                      ...orderMeta,

                      editCartKey: params.editCartKey,

                      business_id: businessId,

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

export default ProductDetailScreen;
