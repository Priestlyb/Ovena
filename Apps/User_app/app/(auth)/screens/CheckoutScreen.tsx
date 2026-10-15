import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { useCartStore } from "@/src/store/cartStore";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { CustomButton } from "@/components/productComponents/Button";

import { createStyles } from "@/constants/styles/CheckoutScreen.styles";
import { useTheme } from "@/constants/theme";
import { TextInput } from "react-native-gesture-handler";
import { DeliveryOptions } from "@/components/CheckoutScreen/DeliveryOptions";
import { DeliveryAddressForm } from "@/components/CheckoutScreen/DeliveryAddressForm";
import CutleryScreen from "@/components/CheckoutScreen/CutleryScreen";

import useCreateMenuOrder from "@/hooks/orders/useCreateMenuOrder";
import useOrderCalculations from "@/hooks/orders/useOrderCalculations";
import { useDeviceLocation } from "@/hooks/Location/useDeviceLocation";
import FeedbackModal from "@/components/FeedbackModal";

const CheckoutScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  const { branchId } = useLocalSearchParams<{
    branchId: string;
  }>();

  const [orderNote, setOrderNote] = useState("");

  const [needCutlery, setNeedCutlery] = useState(false);

  const CUTLERY_NOTE = "Please include disposable cutlery.";

  const { createOrder, loading } = useCreateMenuOrder();

  const { getLocation } = useDeviceLocation();

  const {
    calculateOrder,
    calculationData,
    loading: calculationLoading,
  } = useOrderCalculations();

  const carts = useCartStore((s) => s.carts);

  const [promoModal, setPromoModal] = useState<{
    visible: boolean;
    message: string;
    variant: "success" | "error" | "info";
  }>({
    visible: false,
    message: "",
    variant: "success",
  });

  const cartItems = useMemo(() => {
    if (!branchId) return [];

    return carts?.[Number(branchId)] || [];
  }, [carts, branchId]);

  useEffect(() => {
    const originalNotes = cartItems
      .map((item) => item.notes?.trim())
      .filter(Boolean)
      .join(" | ");

    setOrderNote(originalNotes);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + Number(item.line_total || 0),
      0,
    );
  }, [cartItems]);

  const businessName = cartItems?.[0]?.business_name || `Branch ${branchId}`;
  const businessId = cartItems?.[0]?.business_id;

  // =========================
  // DELIVERY TYPE
  // =========================

  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">(
    "pickup",
  );

  const [couponCode, setCouponCode] = useState("");

  const [validatedCoupon, setValidatedCoupon] = useState<string | null>(null);

  // =========================
  // INITIAL CALCULATION
  // =========================

  useEffect(() => {
    const calculate = async () => {
      if (!branchId || cartItems.length === 0) {
        return;
      }

      const location = await getLocation();

      if (!location) {
        return;
      }

      await calculateOrder(
        {
          branch_id: Number(branchId),

          lat: location.lat,

          long: location.lng,
        },

        cartItems,
      );
    };

    calculate();
  }, [branchId, cartItems]);

  // =========================
  // RECALCULATE DELIVERY CHANGE
  // =========================

  useEffect(() => {
    const calculate = async () => {
      if (!branchId || cartItems.length === 0) {
        return;
      }

      const location = await getLocation();

      if (!location) {
        return;
      }

      await calculateOrder(
        {
          branch_id: Number(branchId),

          lat: location.lat,

          long: location.lng,

          coupon_code: validatedCoupon || undefined,
        },

        cartItems,
      );
    };

    calculate();
  }, [deliveryType]);

  // =========================
  // SUMMARY
  // =========================

  const summarySubtotal = calculationData?.subtotal ?? cartSubtotal;

  const summaryDelivery =
    deliveryType === "delivery" ? (calculationData?.delivery_price ?? 0) : 0;

  const summaryServiceFee = calculationData?.service_fee ?? 0;

  const summaryDiscount = calculationData?.discount_total ?? 0;

  const summaryGrandTotal =
    summarySubtotal + summaryDelivery + summaryServiceFee - summaryDiscount;

  // =========================
  // APPLY PROMO
  // =========================

  const handleApplyPromo = async () => {
    try {
      const location = await getLocation();

      if (!location) {
        console.log("[PROMO] Location not available");
        return;
      }

      const trimmedCoupon = couponCode.trim();

      if (!trimmedCoupon) {
        return;
      }

      const result = await calculateOrder(
        {
          branch_id: Number(branchId),
          coupon_code: trimmedCoupon,
          lat: location.lat,
          long: location.lng,
        },
        cartItems,
      );

      if (result.success) {
        setValidatedCoupon(trimmedCoupon);

        setPromoModal({
          visible: true,
          message: `Coupon "${trimmedCoupon}" applied successfully`,
          variant: "success",
        });
      } else {
        setValidatedCoupon(null);

        setPromoModal({
          visible: true,
          message:
            typeof result.error === "string"
              ? result.error
              : "Invalid coupon code",
          variant: "error",
        });
      }
    } catch (error) {
      console.log("[PROMO ERROR]", error);

      setValidatedCoupon(null);
    }
  };

  if (!branchId) {
    return (
      <View style={styles.center}>
        <Text>Invalid checkout session</Text>
      </View>
    );
  }

  const handleCutleryToggle = (enabled: boolean) => {
    setNeedCutlery(enabled);

    setOrderNote((prev) => {
      const parts = prev
        .split("|")
        .map((p) => p.trim())
        .filter((p) => p && p !== CUTLERY_NOTE);

      if (enabled) {
        parts.push(CUTLERY_NOTE);
      }

      return parts.join(" | ");
    });
  };

  // =========================
  // BUILD ORDER PAYLOAD
  // =========================

  const buildPayload = (location: { lat: number; lng: number }) => {
    return {
      branch_id: Number(branchId),

      coupon_code: validatedCoupon || undefined,

      wallet_entry_id: null,

      lat: location.lat,

      long: location.lng,

      is_delivery: deliveryType === "delivery",

      items: cartItems.map((item) => ({
        menu_item_id: item.menu_item_id,

        quantity: item.quantity,

        variant_option_ids: item.variant_option_ids ?? [],

        addon_ids: item.addon_ids ?? [],

        addtional_note: orderNote.trim(),
      })),
    };
  };

  //console.log("[CHECKOUT CART ITEMS]", JSON.stringify(cartItems, null, 2));

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async () => {
    try {
      console.log("[PLACE ORDER] Starting...");

      const location = await getLocation();

      if (!location) {
        console.log("[PLACE ORDER] Location unavailable");

        setPromoModal({
          visible: true,
          variant: "error",
          message:
            "Unable to determine your location. Please enable location services and try again.",
        });

        return;
      }

      const payload = buildPayload(location);

      //console.log("[CREATE ORDER PAYLOAD]", JSON.stringify(payload, null, 2));

      const result = await createOrder(payload);

      //console.log("[CREATE ORDER RESULT]");
      //console.log(JSON.stringify(result, null, 2));

      // =========================
      // ORDER CREATION FAILED
      // =========================

      if (!result.success) {
        console.log("[ORDER FAILED]", result.error);

        setPromoModal({
          visible: true,
          variant: "error",
          message:
            typeof result.error === "string"
              ? result.error
              : result.error?.message ||
                "Unable to create order. Please try again shortly.",
        });

        return;
      }

      // =========================
      // VERIFY ORDER ID
      // =========================

      if (!result.data?.order_id) {
        console.log("[ORDER ERROR] Missing order ID");

        setPromoModal({
          visible: true,
          variant: "error",
          message: "Order was created, but the order ID is missing.",
        });

        return;
      }

      // =========================
      // ORDER CREATED
      // =========================

      console.log("[ORDER CREATED SUCCESSFULLY]");
      console.log("Order ID:", result.data.order_id);
      console.log("Order Status:", result.data.status);
      console.log("Delivery Passphrase:", result.data.delivery_passphrase);

      // =========================
      // NAVIGATE TO PAYMENT METHOD
      // =========================

      console.log("[NAVIGATING] PaymentMethodScreen");

      console.log("[PAYMENT PARAMS]", {
        orderId: String(result.data.order_id),
        branchId: String(branchId),
        businessId: String(businessId ?? ""),
      });

      router.push({
        pathname: "/screens/PaymentMethodScreen",
        params: {
          orderId: String(result.data.order_id),
          branchId: String(branchId),
          businessId: String(businessId ?? ""),
        },
      });
    } catch (error: any) {
      console.log("[ORDER ERROR]", error);

      setPromoModal({
        visible: true,
        variant: "error",
        message:
          error?.message ||
          "Something went wrong while placing your order. Please try again.",
      });
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="ArrowLeftIcon" size={22} color={theme.icon} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Checkout</Text>

          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* RESTAURANT */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Restaurant</Text>
            <Text style={styles.businessName}>{businessName}</Text>
          </View>

          {/* ITEMS */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Order Items ({totalItems})</Text>

            {cartItems.map((item, index) => (
              <View
                key={`${item.menu_item_id}-${index}`}
                style={styles.itemCard}
              >
                <Text style={styles.productName}>
                  {item.product_name} × {item.quantity}
                </Text>

                <View style={styles.row}>
                  <Text style={styles.label}>Unit Price</Text>
                  <Text style={styles.value}>
                    ₦{Number(item.unit_price || 0).toLocaleString()}
                  </Text>
                </View>

                {(item.variants ?? []).length > 0 && (
                  <View>
                    {item.variants?.map((v, idx) => (
                      <Text
                        key={idx}
                        style={{
                          fontSize: 12,
                          color: theme.textSecondary,
                        }}
                      >
                        • {v.group}: {v.name} (+₦
                        {v.price.toLocaleString()})
                      </Text>
                    ))}
                  </View>
                )}

                {(item.addons ?? []).length > 0 && (
                  <View>
                    {item.addons?.map((a, idx) => (
                      <Text key={idx} style={{ fontSize: 12, color: "#666" }}>
                        • {a.name} × {a.qty} (+₦
                        {a.total.toLocaleString()})
                      </Text>
                    ))}
                  </View>
                )}

                <View style={[styles.row, { marginTop: 10 }]}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>
                    ₦{Number(item.line_total || 0).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* DELIVERY */}
          <DeliveryOptions selected={deliveryType} onChange={setDeliveryType} />

          {deliveryType === "delivery" && <DeliveryAddressForm visible />}

          <CutleryScreen
            value={needCutlery}
            onValueChange={handleCutleryToggle}
          />

          {/* PROMO */}
          <View style={styles.promoBox}>
            <View style={styles.promoInputBox}>
              <IconSymbol
                name="TicketPercentIcon"
                color={theme.icon}
                size={20}
              />

              <TextInput
                style={styles.promoInput}
                placeholder="Promo code"
                value={couponCode}
                onChangeText={(text) => {
                  setCouponCode(text);
                  setValidatedCoupon(null);
                }}
              />
            </View>

            <TouchableOpacity
              disabled={calculationLoading}
              style={[
                styles.promoButton,
                calculationLoading && {
                  opacity: 0.7,
                },
              ]}
              onPress={handleApplyPromo}
            >
              <Text style={styles.promoButtonText}>
                {calculationLoading ? "Applying..." : "Apply"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* SUMMARY */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Order Summary</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Items</Text>
              <Text style={styles.value}>{totalItems}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Subtotal</Text>
              <Text style={styles.value}>
                ₦{summarySubtotal.toLocaleString()}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Delivery</Text>
              <Text style={styles.value}>
                ₦{summaryDelivery.toLocaleString()}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Service Fee</Text>
              <Text style={styles.value}>
                ₦{summaryServiceFee.toLocaleString()}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Discount</Text>
              <Text style={styles.value}>
                ₦{summaryDiscount.toLocaleString()}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ₦{summaryGrandTotal.toLocaleString()}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* FOOTER */}
        <View style={styles.footer}>
          <CustomButton
            title={loading ? "Processing..." : "Pay to order"}
            onPress={handlePlaceOrder}
            disabled={loading || calculationLoading || cartItems.length === 0}
          />
        </View>
      </View>

      <FeedbackModal
        visible={promoModal.visible}
        message={promoModal.message}
        variant={promoModal.variant}
        onClose={() =>
          setPromoModal((prev) => ({
            ...prev,
            visible: false,
          }))
        }
      />
    </KeyboardAvoidingView>
  );
};

export default CheckoutScreen;
