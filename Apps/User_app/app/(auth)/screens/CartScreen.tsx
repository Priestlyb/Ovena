import React, { useEffect, useMemo, useState } from "react";

import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { CustomButton } from "@/components/productComponents/Button";
import { CartItemComponent } from "@/components/productComponents/CartItemComponent";
import { useCartStore } from "@/src/store/cartStore";

import { IconSymbol } from "@/components/ui/icon-symbol";

import useOrderCalculations from "@/hooks/orders/useOrderCalculations";
import { useDeviceLocation } from "@/hooks/Location/useDeviceLocation";

import { useTheme } from "@/constants/theme";

import { createStyles } from "@/constants/styles/CartScreen.styles";

const CartScreen = () => {
  const router = useRouter();

  const theme = useTheme();

  const styles = createStyles(theme);

  const { branchId } = useLocalSearchParams<{
    branchId: string;
  }>();

  const carts = useCartStore((s) => s.carts);

  const clearBranch = useCartStore((s) => s.clearBranch);

  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const removeItem = useCartStore((s) => s.removeItem);

  const [showBreakdown, setShowBreakdown] = useState(true);

  const { coords } = useDeviceLocation();

  const {
    calculateOrder,
    calculationData,
    loading: calculatingOrder,
  } = useOrderCalculations();

  const cartItems = useMemo(() => {
    if (!branchId) return [];

    return carts?.[Number(branchId)] || [];
  }, [carts, branchId]);

  useEffect(() => {
    if (!branchId || !coords || cartItems.length === 0) {
      return;
    }

    calculateOrder(
      {
        branch_id: Number(branchId),
        lat: coords.lat,
        long: coords.lng,
      },
      cartItems,
    );
  }, [branchId, coords, cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + Number(item.line_total || 0),
      0,
    );
  }, [cartItems]);

  const deliveryAmount = calculationData?.delivery_price ?? 0;

  const serviceAmount = calculationData?.service_fee ?? 0;

  const subtotalAmount = calculationData?.subtotal ?? totalPrice;

  const totalAmount =
    calculationData?.grand_total ?? totalPrice + deliveryAmount + serviceAmount;

  const restaurantName =
    cartItems?.[0]?.business_name ||
    cartItems?.[0]?.product_name ||
    `Branch #${branchId}`;

  const handleIncrement = (itemKey: string) => {
    const item = cartItems.find((i) => i.key === itemKey);

    if (!item || !branchId) {
      return;
    }

    updateQuantity(Number(branchId), itemKey, item.quantity + 1);
  };

  const handleDecrement = (itemKey: string) => {
    const item = cartItems.find((i) => i.key === itemKey);

    if (!item || !branchId) {
      return;
    }

    if (item.quantity <= 1) {
      removeItem(Number(branchId), itemKey);

      return;
    }

    updateQuantity(Number(branchId), itemKey, item.quantity - 1);
  };

  const handleDeleteItem = (itemKey: string) => {
    if (!branchId) return;

    removeItem(Number(branchId), itemKey);
  };

  const handleClearCart = () => {
    if (!branchId) return;

    clearBranch(Number(branchId));

    router.back();
  };

  const handleCheckout = () => {
    router.push({
      pathname: "/screens/CheckoutScreen",

      params: {
        branchId,

        deliveryFee: String(deliveryAmount),

        serviceFee: String(calculationData?.service_fee_percent ?? 0),

        subtotal: String(subtotalAmount),

        grandTotal: String(totalAmount),
      },
    });
  };

  if (!branchId) {
    return (
      <View style={styles.container}>
        <Text>Invalid branch</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="ArrowLeftIcon" size={22} color={theme.icon} />
        </TouchableOpacity>

        <Text style={styles.title}>Meal's Cart</Text>

        <TouchableOpacity onPress={handleClearCart} style={styles.deleteBtn}>
          <IconSymbol name="TrashOutline" size={22} color={theme.error} />
        </TouchableOpacity>
      </View>

      {/* SUBHEADER */}
      <Text style={styles.cartSubheader}>
        {totalItems} items from {restaurantName}
      </Text>

      {/* ITEMS */}
      <ScrollView
        style={styles.cartListContainer}
        showsVerticalScrollIndicator={false}
      >
        {cartItems.map((item, index) => (
          <CartItemComponent
            key={item.key || `${item.menu_item_id}-${index}`}

            item={item}

            onPress={() => {
              router.push({
                pathname: "/(auth)/screens/CartProductDetailScreen",

                params: {
                  businessId: String(item.business_id),

                  branchId: String(branchId),

                  menuItemId: String(item.menu_item_id),

                  editCartKey: item.key,
                },
              });
            }}

            onIncrement={() => item.key && handleIncrement(item.key)}

            onDecrement={() => item.key && handleDecrement(item.key)}

            onDelete={() => item.key && handleDeleteItem(item.key)}
          />
        ))}

        <TouchableOpacity
          style={styles.addMoreItemsButton}
          onPress={() =>
            router.push({
              pathname: "/screens/RestaurantsPage",
              params: {
                id: String(cartItems[0]?.business_id),
              },
            })
          }
        >
          <Text style={styles.addMoreItemsText}>Add more items</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* SUMMARY */}
      <View style={styles.orderSummaryCard}>
        {/* SUMMARY HEADER */}
        <TouchableOpacity
          onPress={() => setShowBreakdown((prev) => !prev)}
          style={styles.orderSummaryHeader}
          activeOpacity={0.7}
        >
          <Text style={styles.orderSummaryTitle}>Order Summary</Text>

          <View style={styles.summaryHeaderRight}>
            <Text style={styles.summaryHeaderTotal}>
              ₦{totalAmount.toLocaleString("en-NG")}
            </Text>

            <IconSymbol
              name={showBreakdown ? "ChevronUpIcon" : "ChevronDownIcon"}
              size={20}
              color={theme.icon}
            />
          </View>
        </TouchableOpacity>

        {/* COLLAPSIBLE CONTENT */}
        {showBreakdown && (
          <View style={styles.summaryContent}>
            {/* PRODUCTS */}
            <TouchableOpacity
              onPress={() => setShowBreakdown((prev) => !prev)}
              style={styles.summaryLine}
            >
              <Text style={styles.summaryLineLabel}>
                Products ({cartItems.length})
              </Text>

              <Text style={styles.summaryLineValue}>
                ₦{subtotalAmount.toLocaleString("en-NG")}
              </Text>
            </TouchableOpacity>

            {/* PRODUCT BREAKDOWN */}
            <View style={styles.breakdownContainer}>
              {cartItems.map((item) => (
                <View
                  key={item.key || item.menu_item_id}
                  style={styles.breakdownItem}
                >
                  <Text style={styles.breakdownTitle}>
                    {item.product_name} × {item.quantity}
                  </Text>

                  {(item.variants ?? []).map((v, idx) => (
                    <Text key={idx} style={styles.breakdownText}>
                      • {v.group}: {v.name} (+₦
                      {Number(v.price).toLocaleString("en-NG")})
                    </Text>
                  ))}

                  {(item.addons ?? []).map((a, idx) => (
                    <Text key={idx} style={styles.breakdownText}>
                      • {a.name} × {a.qty} (+₦
                      {Number(a.total).toLocaleString("en-NG")})
                    </Text>
                  ))}

                  <Text style={styles.breakdownSubtotal}>
                    Subtotal: ₦
                    {Number(item.line_total || 0).toLocaleString("en-NG")}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.summaryDivider} />

            {/* SUBTOTAL */}
            <View style={styles.summaryLine}>
              <Text style={styles.summaryTotalLabel}>SubTotal:</Text>

              <Text style={styles.summaryTotalValue}>
                ₦{subtotalAmount.toLocaleString("en-NG")}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            {/* DELIVERY */}
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLineLabel}>Delivery</Text>

              <Text style={styles.summaryLineValue}>
                ₦{deliveryAmount.toLocaleString("en-NG")}
              </Text>
            </View>

            {/* SERVICE FEE */}
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLineLabel}>Service Fee</Text>

              <Text style={styles.summaryLineValue}>
                ₦{serviceAmount.toLocaleString("en-NG")}
              </Text>
            </View>

            {/* DISCOUNT */}
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLineLabel}>Discount</Text>

              <Text style={styles.summaryLineValue}>
                ₦
                {(calculationData?.discount_total ?? 0).toLocaleString("en-NG")}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            {/* TOTAL */}
            <View style={styles.summaryLine}>
              <Text style={styles.summaryTotalLabel}>Total</Text>

              <Text style={styles.summaryTotalValue}>
                ₦{totalAmount.toLocaleString("en-NG")}
              </Text>
            </View>
          </View>
        )}

        {/* COLLAPSED TOTAL */}
        {!showBreakdown && (
          <View style={styles.collapsedTotalRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>

            <Text style={styles.summaryTotalValue}>
              ₦{totalAmount.toLocaleString("en-NG")}
            </Text>
          </View>
        )}
      </View>

      {/* CHECKOUT */}
      <View style={styles.bottomButtonContainer}>
        <CustomButton
          title={calculatingOrder ? "Updating..." : "Checkout Now"}

          onPress={handleCheckout}
        />
      </View>
    </View>
  );
};

export default CartScreen;
