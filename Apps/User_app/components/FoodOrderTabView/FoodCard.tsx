import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";

import { router } from "expo-router";

import { createStyles } from "@/constants/styles/RestaurantsPage.styles";

import { useTheme } from "@/constants/theme";

import { IconSymbol } from "../ui/icon-symbol";
import { useCart } from "@/context/CartContext";

type Props = {
  items?: any[];

  businessId?: number;

  branchId?: number;

  businessName?: string;

  /**
   * Exact menu item to scroll to.
   *
   * This has priority over category targeting.
   */
  targetMenuId?: string;

  /**
   * Category ID to scroll to.
   */
  targetCategoryId?: string | number;

  /**
   * Category name fallback.
   */
  targetCategoryName?: string;

  onTargetItemFound?: (item: any) => void;
};

export const FoodCard = ({
  items = [],
  businessId,
  branchId,
  businessName,
  targetMenuId,
  targetCategoryId,
  targetCategoryName,
  onTargetItemFound,
}: Props) => {
  const theme = useTheme();

  const styles = createStyles(theme);

  const { dispatch } = useCart();

  /* ==================================================
     REFS
  ================================================== */

  const itemsScrollRef = useRef<ScrollView>(null);

  const hasScrolledToTarget = useRef(false);

  const targetScrollX = useRef<number | null>(null);

  /* ==================================================
     STATE
  ================================================== */

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [targetLayoutReady, setTargetLayoutReady] = useState(false);

  /* ==================================================
     ADD TO CART
  ================================================== */

  const handleAddToCart = useCallback(
    (item: any) => {
      dispatch({
        type: "ADD_TO_CART",

        payload: {
          id: String(item.id),

          name: item.custom_name,

          price: Number(item.price),

          image: item.image,

          quantity: 1,
        },
      });
    },
    [dispatch],
  );

  /* ==================================================
     AVAILABLE ITEMS
  ================================================== */

  const availableItems = useMemo(() => {
    return items.filter((item) => item?.is_available === true);
  }, [items]);

  /* ==================================================
     UNIQUE CATEGORIES
  ================================================== */

  const categories = useMemo(() => {
    const seen = new Set<string>();

    return availableItems
      .map((item) => item?.categoryName)
      .filter((name) => {
        const normalized = String(name ?? "")
          .trim()
          .toLowerCase();

        if (!normalized || seen.has(normalized)) {
          return false;
        }

        seen.add(normalized);

        return true;
      });
  }, [availableItems]);

  /* ==================================================
     FIND EXACT MENU ITEM
  ================================================== */

  const targetMenuItem = useMemo(() => {
    if (!targetMenuId) {
      return null;
    }

    const normalizedId = String(targetMenuId);

    const found = availableItems.find(
      (item) => String(item?.id) === normalizedId,
    );

    if (!found) {
      console.log("[FOOD CARD] Menu item not found:", normalizedId);
    }

    return found ?? null;
  }, [availableItems, targetMenuId]);

  /* ==================================================
     FIND CATEGORY
  ================================================== */

  const targetCategoryNameResolved = useMemo(() => {
    /*
     * MENU ID ALWAYS WINS.
     *
     * If we found a specific menu item,
     * use the category containing it.
     */
    if (targetMenuItem?.categoryName) {
      return String(targetMenuItem.categoryName);
    }

    /*
     * ==================================================
       CATEGORY ID
     * ==================================================
     */

    if (targetCategoryId !== undefined) {
      const normalizedId = String(targetCategoryId);

      const categoryItem = availableItems.find(
        (item) => String(item?.categoryId) === normalizedId,
      );

      if (categoryItem?.categoryName) {
        return String(categoryItem.categoryName);
      }
    }

    /*
     * ==================================================
       CATEGORY NAME FALLBACK
     * ==================================================
     */

    if (targetCategoryName) {
      const normalizedTarget = String(targetCategoryName).trim().toLowerCase();

      const foundCategory = categories.find((category) => {
        const normalizedCategory = String(category).trim().toLowerCase();

        if (normalizedCategory === normalizedTarget) {
          return true;
        }

        /*
         * burger -> burgers
         */
        if (`${normalizedTarget}s` === normalizedCategory) {
          return true;
        }

        /*
         * burgers -> burger
         */
        if (
          normalizedTarget.endsWith("s") &&
          normalizedTarget.slice(0, -1) === normalizedCategory
        ) {
          return true;
        }

        return false;
      });

      if (foundCategory) {
        return String(foundCategory);
      }
    }

    return null;
  }, [
    targetMenuItem,
    targetCategoryId,
    targetCategoryName,
    availableItems,
    categories,
  ]);

  /* ==================================================
     RESOLVE ITEM TO SCROLL TO
  ================================================== */

  const resolvedTargetItem = useMemo(() => {
    /*
     * Exact menu item.
     */
    if (targetMenuItem) {
      return targetMenuItem;
    }

    /*
     * Category-only navigation.
     *
     * Scroll to the first available item
     * in that category.
     */
    if (targetCategoryNameResolved) {
      const categoryItem = availableItems.find(
        (item) =>
          String(item?.categoryName).trim().toLowerCase() ===
          String(targetCategoryNameResolved).trim().toLowerCase(),
      );

      return categoryItem ?? null;
    }

    return null;
  }, [targetMenuItem, targetCategoryNameResolved, availableItems]);

  /* ==================================================
     FILTERED ITEMS
  ================================================== */

  const filteredItems = useMemo(() => {
    if (!activeCategory) {
      return availableItems;
    }

    return availableItems.filter(
      (item) =>
        String(item?.categoryName).trim().toLowerCase() ===
        String(activeCategory).trim().toLowerCase(),
    );
  }, [availableItems, activeCategory]);

  /* ==================================================
     TARGET EXISTS IN CURRENT FILTER
  ================================================== */

  const targetIsVisible = useMemo(() => {
    if (!resolvedTargetItem) {
      return false;
    }

    return filteredItems.some(
      (item) => String(item?.id) === String(resolvedTargetItem?.id),
    );
  }, [filteredItems, resolvedTargetItem]);

  /* ==================================================
     RESET
  ================================================== */

  useEffect(() => {
    hasScrolledToTarget.current = false;

    targetScrollX.current = null;

    setTargetLayoutReady(false);
  }, [targetMenuId, targetCategoryId, targetCategoryName]);

  /* ==================================================
     ACTIVATE TARGET CATEGORY
  ================================================== */

  useEffect(() => {
    if (!resolvedTargetItem) {
      return;
    }

    const categoryName = resolvedTargetItem?.categoryName;

    if (!categoryName) {
      return;
    }

    setActiveCategory((current) => {
      const currentNormalized = String(current ?? "")
        .trim()
        .toLowerCase();

      const targetNormalized = String(categoryName).trim().toLowerCase();

      if (currentNormalized === targetNormalized) {
        return current;
      }

      console.log("[FOOD CARD] Activating category:", categoryName);

      return String(categoryName);
    });
  }, [resolvedTargetItem]);

  /* ==================================================
     TARGET LAYOUT
  ================================================== */

  const handleTargetLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { x } = event.nativeEvent.layout;

      targetScrollX.current = x;

      console.log("[FOOD CARD] Target layout ready:", {
        id: resolvedTargetItem?.id,
        x,
      });

      setTargetLayoutReady(true);
    },
    [resolvedTargetItem],
  );

  /* ==================================================
     PERFORM SCROLL
  ================================================== */

  useEffect(() => {
    if (!resolvedTargetItem) {
      return;
    }

    if (!targetIsVisible) {
      return;
    }

    if (!targetLayoutReady) {
      return;
    }

    if (hasScrolledToTarget.current) {
      return;
    }

    const x = targetScrollX.current;

    if (x === null) {
      return;
    }

    /*
     * Small left-side padding.
     */
    const scrollPosition = Math.max(0, x - 16);

    console.log("[FOOD CARD] SCROLLING TO TARGET:", {
      menuId: resolvedTargetItem.id,
      category: resolvedTargetItem.categoryName,
      x: scrollPosition,
    });

    /*
     * Let the current layout commit before
     * starting the animation.
     */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        itemsScrollRef.current?.scrollTo({
          x: scrollPosition,
          animated: true,
        });

        hasScrolledToTarget.current = true;

        onTargetItemFound?.(resolvedTargetItem);
      });
    });
  }, [
    resolvedTargetItem,
    targetIsVisible,
    targetLayoutReady,
    onTargetItemFound,
  ]);

  /* ==================================================
     EMPTY
  ================================================== */

  if (!filteredItems.length) {
    return null;
  }

  /* ==================================================
     UI
  ================================================== */

  return (
    <View>
      {/* ==================================================
          CATEGORY FILTER
      ================================================== */}

      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {/* ALL */}

        <TouchableOpacity
          onPress={() => setActiveCategory(null)}
          activeOpacity={0.8}
          style={[
            styles.categoryChip,

            activeCategory === null && styles.activeCategoryChip,
          ]}
        >
          <Text
            style={[
              styles.categoryText,

              activeCategory === null && styles.activeCategoryText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* CATEGORIES */}

        {categories.map((category, index) => {
          const isActive =
            String(activeCategory ?? "").toLowerCase() ===
            String(category ?? "").toLowerCase();

          return (
            <TouchableOpacity
              key={`${category}-${index}`}
              onPress={() => setActiveCategory(category)}
              activeOpacity={0.8}
              style={[
                styles.categoryChip,

                isActive && styles.activeCategoryChip,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,

                  isActive && styles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ==================================================
          MENU ITEMS
      ================================================== */}

      <ScrollView
        ref={itemsScrollRef}
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredItems.map((item: any, index: number) => {
          const isTarget =
            !!resolvedTargetItem &&
            String(item?.id) === String(resolvedTargetItem?.id);

          return (
            <TouchableOpacity
              key={`${item.id}-${index}`}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/(auth)/screens/ProductDetailScreen",

                  params: {
                    item: JSON.stringify(item),

                    business_name: businessName,

                    orderMeta: JSON.stringify({
                      business_id: businessId,

                      branch_id: branchId,

                      business_name: businessName,
                    }),
                  },
                })
              }
            >
              <View
                onLayout={isTarget ? handleTargetLayout : undefined}
                style={[
                  styles.promoCard,

                  index === 0 && styles.firstPromoCard,

                  isTarget && {
                    borderWidth: 2,
                    borderColor: theme.primary,
                  },
                ]}
              >
                {/* IMAGE */}

                <View>
                  {item?.image ? (
                    <Image
                      source={{
                        uri: item.image,
                      }}
                      style={styles.promoImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <IconSymbol
                      name="FastFoodIcon"
                      size={100}
                      color={theme.icon}
                    />
                  )}
                </View>

                {/* TITLE */}

                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.custom_name}
                </Text>

                {/* DESCRIPTION */}

                {!!item.description && (
                  <Text numberOfLines={2} style={styles.promoCardDescription}>
                    {item.description}
                  </Text>
                )}

                {/* PRICE */}

                <Text style={styles.price}>
                  ₦{Number(item.price || 0).toLocaleString("en-NG")}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
