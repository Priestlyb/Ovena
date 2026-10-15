import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import { CustomButton } from "@/components/productComponents/Button";
import { Counter } from "@/components/productComponents/Counter";

import { useRouter, useLocalSearchParams } from "expo-router";
import { useCartStore } from "@/src/store/cartStore";

import { createStyles } from "@/constants/styles/AddonsDetails.styles";
import { useTheme } from "@/constants/theme";

import ProductHeader from "@/components/AddonsDetails/ProductHeader";
import AddonList from "@/components/AddonsDetails/AddonList";
import OrderSummary from "@/components/AddonsDetails/OrderSummary";

/* ================= KEY BUILDER ================= */

const buildCartKey = (
  product: any,
  selectedVariants: any,
  addonQty: Record<string, number>,
) => {
  return JSON.stringify({
    id: product.id,
    variants: selectedVariants,
    addons: addonQty,
  });
};

const AddonsDetails = () => {
  const router = useRouter();

  const params = useLocalSearchParams();

  const theme = useTheme();

  const styles = createStyles(theme);

  /* ================= PRODUCT ================= */

  const product = useMemo(() => {
    try {
      if (!params?.item) return null;

      return JSON.parse(params.item as string);
    } catch (e) {
      console.log("[PRODUCT PARSE ERROR]:", e);

      return null;
    }
  }, [params.item]);

  /* ================= ORDER META ================= */

  const orderMeta = useMemo(() => {
    try {
      if (!params?.orderMeta) return null;

      return JSON.parse(params.orderMeta as string);
    } catch (e) {
      console.log("[ORDER META PARSE ERROR]:", e);

      return null;
    }
  }, [params.orderMeta]);

  const addItem = useCartStore((s) => s.addItem);

  const updateItem = useCartStore((s) => s.updateItem);

  const carts = useCartStore((s) => s.carts);

  const selectedVariants = orderMeta?.selectedVariants || {};

  const businessId = Number(orderMeta?.business_id);

  const businessName = orderMeta?.business_name;

  const [quantity, setQuantity] = useState(orderMeta?.quantity || 1);

  const [imageError, setImageError] = useState(false);

  const [addonQty, setAddonQty] = useState<Record<string, number>>({});

  const addonGroups = product?.addon_groups || [];

  const variantGroups = product?.variant_groups || [];

  const mainTitle = product?.custom_name || "Product";

  const [restored, setRestored] = useState(false);

  /* ================= RESTORE CART ================= */

  useEffect(() => {
    if (restored) return;

    if (!orderMeta?.editCartKey) return;

    const branchId = Number(orderMeta.branch_id);

    const cartItem = carts?.[branchId]?.find(
      (i) => i.key === orderMeta.editCartKey,
    );

    if (!cartItem) return;

    setQuantity(cartItem.quantity);

    const restoredAddons: Record<string, number> = {};

    cartItem.addons?.forEach((addon) => {
      restoredAddons[String(addon.id)] = addon.qty;
    });

    setAddonQty(restoredAddons);

    setRestored(true);
  }, [restored, orderMeta?.editCartKey, orderMeta?.branch_id, carts]);

  /* ================= VARIANTS ================= */

  const variantLines = useMemo(() => {
    const lines: any[] = [];

    variantGroups.forEach((group: any) => {
      const selectedId = selectedVariants[group.id];

      if (!selectedId) return;

      const option = group.options.find((opt: any) => opt.id === selectedId);

      if (option) {
        lines.push({
          id: Number(option.id),

          group_id: Number(group.id),

          group: group.name,

          name: option.name,

          price: Number(option.price_diff || 0),
        });
      }
    });

    return lines;
  }, [variantGroups, selectedVariants]);

  /* ================= ADDONS ================= */

  const increaseAddon = (group: any, addon: any) => {
    setAddonQty((prev) => ({
      ...prev,
      [addon.id]: (prev[addon.id] || 0) + 1,
    }));
  };

  const decreaseAddon = (addon: any) => {
    setAddonQty((prev) => {
      const current = prev[addon.id] || 0;

      if (current <= 0) return prev;

      return {
        ...prev,
        [addon.id]: current - 1,
      };
    });
  };

  /* ================= BREAKDOWN ================= */

  const breakdown = useMemo(() => {
    const basePrice = Number(product?.price || 0);

    const addonLines: any[] = [];

    let addonSubtotal = 0;

    addonGroups.forEach((group: any) => {
      group.addons?.forEach((addon: any) => {
        const qty = addonQty[addon.id] || 0;

        if (qty > 0) {
          const lineTotal = qty * Number(addon.price || 0);

          addonLines.push({
            id: addon.id,

            name: addon.name,

            qty,

            price: Number(addon.price || 0),

            total: lineTotal,
          });

          addonSubtotal += lineTotal;
        }
      });
    });

    const baseSubtotal = basePrice * quantity;

    const variantSubtotal = variantLines.reduce(
      (sum, v) => sum + v.price * quantity,
      0,
    );

    return {
      basePrice,

      baseSubtotal,

      addonLines,

      addonSubtotal,

      variantLines,

      variantSubtotal,

      total: baseSubtotal + addonSubtotal + variantSubtotal,
    };
  }, [product, quantity, addonQty, addonGroups, variantLines]);

  /* ================= CART HANDLER ================= */

  const handleConfirmOrder = () => {
    const branchId = Number(orderMeta?.branch_id);

    if (!branchId || !product?.id) return;

    const variant_option_ids = Object.values(selectedVariants)
      .filter(Boolean)
      .map(Number);

    const addon_ids = Object.entries(addonQty)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([id]) => Number(id));

    const selectedAddons = breakdown.addonLines;

    const selectedVariantLines = variantLines;

    const key =
      orderMeta?.editCartKey ??
      buildCartKey(product, selectedVariants, addonQty);

    const cartItem = {
      key,

      business_id: businessId,

      branch_id: branchId,

      menu_item_id: Number(product.id),

      quantity: Number(quantity),

      variant_option_ids,

      addon_ids,

      variants: selectedVariantLines,

      addons: selectedAddons,

      unit_price: breakdown.total / Number(quantity),

      line_total: breakdown.total,

      notes: orderMeta?.notes ?? "",

      product_name: mainTitle,

      business_name: businessName,

      image: product?.image,
    };

    if (orderMeta?.editCartKey) {
      updateItem(branchId, orderMeta.editCartKey, cartItem);
    } else {
      addItem(branchId, cartItem);
    }

    router.push({
      pathname: "/screens/RestaurantCart",

      params: {
        branchId: String(branchId),

        business_name: businessName,
      },
    });
  };

  /* ================= EMPTY ================= */

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

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      <ProductHeader
        image={product?.image}

        imageError={imageError}

        setImageError={setImageError}

        onBack={() => router.back()}

        styles={styles}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}

        style={styles.keyboardContainer}
      >
        <ScrollView style={styles.scrollContent}>
          <View style={styles.productSection}>
            <View style={styles.productTitleRow}>
              <Text style={styles.productTitle}>{mainTitle}</Text>

              <Counter
                value={quantity}

                onIncrement={() => setQuantity(quantity + 1)}

                onDecrement={() => quantity > 1 && setQuantity(quantity - 1)}

                size="large"
              />
            </View>

            <AddonList
              addonGroups={addonGroups}

              addonQty={addonQty}

              increaseAddon={increaseAddon}

              decreaseAddon={decreaseAddon}

              styles={styles}
            />

            <OrderSummary
              breakdown={breakdown}

              styles={styles}
            />

            <CustomButton
              title={`Confirm Order | ₦${breakdown.total.toLocaleString("en-NG")}`}

              onPress={handleConfirmOrder}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddonsDetails;
