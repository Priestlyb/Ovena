import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { createStyles } from "@/constants/styles/orderSuccess.styles";
import { useTheme } from "@/constants/theme";

import useGetMenuOrder from "@/hooks/orders/useGetMenuOrder";
import FeedbackModal from "@/components/FeedbackModal";
import { getDeliveryPassphrase } from "@/src/utils/deliveryPassphraseStorage";
import { IconSymbol } from "@/components/ui/icon-symbol";

const OrderSuccess = () => {
  const router = useRouter();

  const theme = useTheme();
  const styles = createStyles(theme);

  const { orderId } = useLocalSearchParams<{
    orderId: string;
  }>();

  const { getOrder, order, loading } = useGetMenuOrder();

  const [deliveryPassphrase, setDeliveryPassphrase] = useState<string | null>(
    null,
  );

  const [feedback, setFeedback] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  useEffect(() => {
    if (!orderId) return;

    getOrder(Number(orderId));
  }, [orderId, getOrder]);

  const isPaid = order?.payment_status?.toLowerCase() === "paid";

  useEffect(() => {
    const loadDeliveryPassphrase = async () => {
      if (!order?.id) return;

      try {
        if (order.delivery_passphrase) {
          setDeliveryPassphrase(order.delivery_passphrase);
          return;
        }

        const saved = await getDeliveryPassphrase(order.id);

        setDeliveryPassphrase(saved);
      } catch (error) {
        console.log(
          "[ORDER SUCCESS] Failed to load delivery passphrase",
          error,
        );
      }
    };

    loadDeliveryPassphrase();
  }, [order]);

  const copyDeliveryCode = async () => {
    if (!deliveryPassphrase) return;

    try {
      await Clipboard.setStringAsync(deliveryPassphrase);

      setFeedback({
        visible: true,
        title: "Copied",
        message: "Delivery code copied to your clipboard.",
        variant: "success",
      });
    } catch (error) {
      console.log("[COPY DELIVERY CODE ERROR]", error);

      setFeedback({
        visible: true,
        title: "Error",
        message: "Unable to copy delivery code.",
        variant: "error",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 50,
            }}
          >
            {/* HEADER */}

            <View style={styles.header}>
              <View
                style={[
                  styles.successIcon,
                  {
                    backgroundColor: isPaid ? theme.success : theme.warning,
                  },
                ]}
              >
                <Ionicons
                  name={isPaid ? "checkmark-circle" : "time"}
                  size={55}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.title}>Order Confirmed!</Text>

              <Text style={styles.subtitle}>
                We've received your order and will begin processing it shortly.
              </Text>
            </View>

            {order && (
              <>
                {/* ORDER DETAILS */}

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Order Details</Text>

                  <View style={styles.row}>
                    <Text style={styles.label}>Order Number</Text>

                    <Text style={styles.value}>#{order.id}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Status</Text>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: theme.warning,
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>{order.status}</Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Branch</Text>

                    <Text style={styles.value}>
                      {order.branch ?? "That Branch"}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Date</Text>

                    <Text style={styles.value}>
                      {new Date(order.created_at).toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* ITEMS */}

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Items Ordered</Text>

                  {order.items?.map((item: any, index: number) => (
                    <View key={index} style={styles.itemRow}>
                      <View>
                        <Text style={styles.itemName}>{item.name}</Text>

                        <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                      </View>

                      <Text style={styles.itemPrice}>
                        ₦{Number(item.line_total).toLocaleString("en-NG")}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* PAYMENT */}

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Payment & Delivery</Text>

                  <View style={styles.row}>
                    <Text style={styles.label}>Payment</Text>

                    <Text
                      style={[
                        styles.value,
                        {
                          color: isPaid ? theme.success : theme.error,
                        },
                      ]}
                    >
                      {order.payment_status ?? "Paid"}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>ETA</Text>

                    <Text style={styles.value}>60 mins</Text>
                  </View>

                  {deliveryPassphrase && (
                    <View style={styles.row}>
                      <Text style={styles.label}>
                        <IconSymbol
                          name="BikeIcon"
                          size={22}
                          color={theme.textPrimary}
                        />{" "}
                        Delivery Code
                      </Text>

                      <TouchableOpacity
                        onPress={copyDeliveryCode}
                        activeOpacity={0.7}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={[
                            styles.value,
                            {
                              fontSize: 22,
                              fontWeight: "700",
                              color: theme.primary,
                              marginRight: 8,
                            },
                          ]}
                        >
                          {deliveryPassphrase}
                        </Text>

                        <Ionicons
                          name="copy-outline"
                          size={20}
                          color={theme.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* NEXT STEPS */}

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>What Happens Next?</Text>

                  <Text style={styles.step}>
                    • Restaurant confirms your order
                  </Text>

                  <Text style={styles.step}>• Food is prepared</Text>

                  <Text style={styles.step}>• Rider picks up your order</Text>

                  <Text style={styles.step}>• Delivered to your location</Text>
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => router.replace("/(tabs)")}
            >
              <Text style={styles.homeButtonText}>Back Home</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <FeedbackModal
        visible={feedback.visible}

        title={feedback.title}

        message={feedback.message}

        variant={feedback.variant}

        onClose={() =>
          setFeedback((prev) => ({
            ...prev,
            visible: false,
          }))
        }
      />
    </SafeAreaView>
  );
};

export default OrderSuccess;
