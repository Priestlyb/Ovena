import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { IconSymbol } from "../ui/icon-symbol";
import { createFoodOrderStyles } from "@/constants/styles/ordersStyles";
import { useTheme } from "@/constants/theme";
import { getDeliveryPassphrase } from "@/src/utils/deliveryPassphraseStorage";
import { useRetryOrderPayment } from "@/hooks/orders/useRetryOrderPayment";

interface FoodOrder {
  id: number;
  branch: string;
  branch_id?: number;
  grand_total: string;
  status: string;
  product_name?: string | null;
  product_image?: string | null;
  created_at?: string;
  extra_items?: number;
  location?: string;
  isLive?: boolean;
}

interface FoodOrderCardProps {
  order: FoodOrder;
  onPress?: (order: FoodOrder) => void;
}

const FoodOrderCard: React.FC<FoodOrderCardProps> = ({ order, onPress }) => {
  const router = useRouter();
  const theme = useTheme();
  const styles = createFoodOrderStyles(theme);

  const [deliveryPassphrase, setDeliveryPassphrase] = useState<string | null>(
    null,
  );

  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const { retryPayment, loading: retryingPayment } = useRetryOrderPayment();

  useEffect(() => {
    const loadPassphrase = async () => {
      try {
        const passphrase = await getDeliveryPassphrase(order.id);

        setDeliveryPassphrase(passphrase);
      } catch (error) {
        console.log("[PASSCODE] Failed to load passphrase:", error);
      }
    };

    loadPassphrase();
  }, [order]);

  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const displayPrice = order.grand_total ?? "0.00";

  const imageUrl = order.product_image;

  const formattedPrice = isNaN(Number(displayPrice))
    ? "0.00"
    : Number(displayPrice).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  const displayLocation = order.branch || "";

  const canRetryPayment = ["payment_initialization_failed"].includes(
    order.status,
  );

  const handlePress = () => {
    if (onPress) {
      onPress(order);
      return;
    }

    router.push({
      pathname: "/screens/OrderDetails",
      params: {
        id: order.id,
      },
    });
  };

  const handleRetryPayment = async () => {
    if (secondsRemaining > 0) {
      return;
    }

    try {
      const response = await retryPayment({
        order_id: order.id,
      });

      console.log("[RETRY PAYMENT RESPONSE]", response);

      if (response.status === "payment_initialization_failed") {
        if (response.retry_after) {
          const retryTime = new Date(response.retry_after).getTime();

          const now = Date.now();

          const seconds = Math.max(0, Math.ceil((retryTime - now) / 1000));

          setSecondsRemaining(seconds);

          Alert.alert(
            "Retry Payment",
            `Payment couldn't be initialized. Please try again in about ${seconds} second${
              seconds === 1 ? "" : "s"
            }.`,
          );
        } else {
          Alert.alert(
            "Retry Payment",
            response.message || "Payment couldn't be initialized.",
          );
        }

        return;
      }

      const paymentUrl = response.authorization_url || response.payment_url;

      if (paymentUrl) {
        router.push({
          pathname: "/screens/PaymentScreen",
          params: {
            paymentUrl,
            orderId: String(order.id),
            branchId: String(order.branch_id ?? ""),
          },
        });

        return;
      }

      Alert.alert(
        "Payment Retry",
        response.message ||
          response.detail ||
          "Payment has been reinitialized successfully.",
      );
    } catch (error: any) {
      console.log("[RETRY PAYMENT ERROR]", error?.response?.data || error);

      Alert.alert(
        "Retry Payment",
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Unable to retry payment. Please try again.",
      );
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <View style={styles.foodCardYellow}>
        {/* IMAGE */}
        <View style={styles.foodCardRow}>
          <View>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <IconSymbol name="FastFoodIcon" size={36} color="#fff" />
              </View>
            )}
          </View>

          <View style={styles.foodCardRowItem}>
            {order.isLive && (
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}

            {!!order.status && (
              <Text style={styles.statusText}>Status: {order.status}</Text>
            )}

            {deliveryPassphrase && (
              <Text
                style={{
                  marginTop: 4,
                  color: "#D9502E",
                  fontWeight: "700",
                  fontSize: 13,
                }}
              >
                Pickup Code: {deliveryPassphrase}
              </Text>
            )}

            <View style={styles.ratingPriceRow}>
              <Text style={styles.priceText}>₦{formattedPrice}</Text>
            </View>

            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color="#D9502E" />
              <Text style={styles.locationText}>{displayLocation}</Text>
            </View>
          </View>
        </View>

        {/* RETRY PAYMENT BUTTON */}
        {canRetryPayment && (
          <TouchableOpacity
            style={[
              styles.checkOrderButton,
              (retryingPayment || secondsRemaining > 0) && {
                opacity: 0.6,
              },
            ]}
            onPress={handleRetryPayment}
            disabled={retryingPayment || secondsRemaining > 0}
            activeOpacity={0.8}
          >
            <Text style={styles.checkOrderText}>
              {retryingPayment
                ? "Retrying..."
                : secondsRemaining > 0
                  ? `Retry in ${secondsRemaining}s`
                  : "Retry Payment"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default FoodOrderCard;
