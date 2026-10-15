import React, { useState, useMemo, useEffect } from "react";

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

import { CustomButton } from "@/components/productComponents/Button";
import { Counter } from "@/components/productComponents/Counter";
import { CheckboxItem } from "@/components/productComponents/CheckboxItem";
import { NutritionInfo } from "@/components/productComponents/NutritionInfo";
import { IconSymbol } from "@/components/ui/icon-symbol";

import { useRouter, useLocalSearchParams } from "expo-router";

import { useAddFavorite } from "@/hooks/favorites/useAddFavorite";
import { useRemoveFavorite } from "@/hooks/favorites/useRemoveFavorite";
import { useFavorites } from "@/hooks/favorites/useFavorites";

import { createStyles } from "@/constants/styles/ProductDetailScreen.styles";
import { useTheme } from "@/constants/theme";

const ProductDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const theme = useTheme();
  const styles = createStyles(theme);

  const { mutate: addFavorite, isPending: isAddingFavorite } = useAddFavorite();

  const { mutate: removeFavorite, isPending: isRemovingFavorite } =
    useRemoveFavorite();

  const { data: favorites } = useFavorites();

  const isPending = isAddingFavorite || isRemovingFavorite;

  const [isFavoriteLocal, setIsFavoriteLocal] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [imageError, setImageError] = useState(false);

  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string | undefined>
  >({});

  /* ================= PRODUCT ================= */

  const product = useMemo(() => {
    try {
      if (!params?.item) return null;

      return JSON.parse(params.item as string);
    } catch (e) {
      console.log("[PRODUCT PARSE ERROR]:", e);
      return null;
    }
  }, [params]);

  /* ================= FAVORITE STATUS ================= */

  const isFavorited = useMemo(() => {
    const currentProductId = Number(product?.id);

    if (!currentProductId || !favorites?.results) {
      return false;
    }

    return favorites.results.some((item: any) => {
      return Number(item?.menu_item?.id) === currentProductId;
    });
  }, [favorites?.results, product?.id]);

  useEffect(() => {
    setIsFavoriteLocal(isFavorited);
  }, [isFavorited]);

  /* ================= ORDER META ================= */

  const orderMeta = useMemo(() => {
    try {
      if (!params?.orderMeta) return {};

      return JSON.parse(params.orderMeta as string);
    } catch (e) {
      console.log("[ORDER META PARSE ERROR]:", e);
      return {};
    }
  }, [params]);

  const branchId = Number(orderMeta?.branch_id);

  const businessName =
    (params.business_name as string) || orderMeta?.business_name;

  /* ================= VARIANTS ================= */

  const variants = product?.variant_groups || [];

  const toggleVariant = (groupId: string, optionId: string) => {
    setSelectedVariants((prev) => {
      const current = prev[groupId];

      return {
        ...prev,
        [groupId]: current === optionId ? undefined : optionId,
      };
    });
  };

  /* ================= TOTAL ================= */

  const calculateTotal = useMemo(() => {
    const basePrice = Number(product?.price || 0);

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
  }, [product, quantity, selectedVariants, variants]);

  /* ================= FAVORITE HANDLER ================= */

  const handleFavorite = () => {
    if (!product?.id) return;

    if (!branchId) {
      console.log("[BRANCH ID MISSING]");
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
          onError: (error) => {
            setIsFavoriteLocal(true);
            console.log("[REMOVE FAVORITE FAILED]", error);
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
          onError: (error) => {
            setIsFavoriteLocal(false);
            console.log("[ADD FAVORITE FAILED]", error);
          },
        },
      );
    }
  };

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No product found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* IMAGE */}

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
            <IconSymbol name="FastFoodIcon" size={250} color={theme.icon} />
          </View>
        )}

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol name="ArrowLeftIcon" size={24} color={theme.icon} />
        </TouchableOpacity>

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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}

        style={styles.keyboardContainer}
      >
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.productSection}>
            <View style={styles.productTitleRow}>
              <View style={styles.titleColumn}>
                <Text style={styles.productTitle}>{product.custom_name}</Text>

                <Text style={styles.productPrice}>
                  ₦{Number(product.price || 0).toLocaleString("en-NG")}
                </Text>

                {businessName && (
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
                value={product.rating || 0}
                unit="★"
              />

              <NutritionInfo
                label="Time"
                value={product.time || 30}
                unit=" min"
              />
            </View>

            <Text style={styles.productDesc}>
              {product.description || "No description available"}
            </Text>

            <View style={styles.sectionDivider} />

            {variants.map((group: any) => (
              <View key={group.id} style={styles.variantGroup}>
                <Text style={styles.sectionTitle}>{group.name}</Text>

                {group.options.map((option: any) => (
                  <CheckboxItem
                    key={option.id}
                    label={option.name}
                    price={Number(option.price_diff || 0)}
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
              multiline
              value={notes}
              onChangeText={setNotes}
            />

            <CustomButton
              title={`Next  |  ₦${calculateTotal.toLocaleString("en-NG")}`}

              onPress={() => {
                router.push({
                  pathname: "/screens/AddonsDetails",

                  params: {
                    item: JSON.stringify(product),

                    orderMeta: JSON.stringify({
                      ...orderMeta,

                      business_name: businessName,

                      branch_id: orderMeta?.branch_id,

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
