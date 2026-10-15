import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useCustomerOrderId } from "@/hooks/orders/useCustomerOrderId";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Ionicons } from "@expo/vector-icons";
import { createOrderDetailsStyles } from "@/constants/styles/ordersStyles";
import { useTheme } from "@/constants/theme";
import * as Clipboard from "expo-clipboard";
import FeedbackModal from "@/components/FeedbackModal";
import {
  getDeliveryPassphrase,
  removeDeliveryPassphrase,
} from "@/src/utils/deliveryPassphraseStorage";
import useGetMyBranchRatings from "@/hooks/ratings/useGetMyBranchRatings";
import useRateOrder, { type RatingPayload } from "@/hooks/ratings/useRateOrder";
import RatingModal from "@/src/modals/RatingModal";

export default function OrderDetailsScreen() {
  const theme = useTheme();
  const styles = createOrderDetailsStyles(theme);
  const { id } = useLocalSearchParams<{ id: string }>();

  const orderId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading, error } = useCustomerOrderId(orderId);
  const [deliveryPassphrase, setDeliveryPassphrase] = useState<string | null>(
    null,
  );
  const [ratingModalVisible, setRatingModalVisible] = useState(false);

  const [feedback, setFeedback] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  const {
    submitRating,
    loading: submittingRating,
    success,
    error: ratingError,
  } = useRateOrder();

  const { ratings, getMyBranchRatings } = useGetMyBranchRatings();

  useEffect(() => {
    const loadRatings = async () => {
      try {
        const result = await getMyBranchRatings();

        //console.log(
        //  "[ORDER DETAILS] Branch Ratings:",
        //JSON.stringify(result, null, 2),
        //);
      } catch (err) {
        console.log("[ORDER DETAILS] Failed to fetch ratings:", err);
      }
    };

    loadRatings();
  }, [getMyBranchRatings]);

  useEffect(() => {
    if (data) {
      //console.log("[ORDER DETAILS DATA]", JSON.stringify(data, null, 2));
    }
  }, [data]);

  const handleSubmitRating = async (
    rating: Omit<RatingPayload, "order_id">,
  ) => {
    if (!data?.id) return;

    const result = await submitRating({
      order_id: Number(data.id),
      ...rating,
    });

    if (result) {
      setRatingModalVisible(false);

      await getMyBranchRatings();

      setFeedback({
        visible: true,
        title: "Thank you!",
        message: "Your rating has been submitted.",
        variant: "success",
      });
    }
  };

  useEffect(() => {
    const loadDeliveryPassphrase = async () => {
      if (!data?.id) return;

      try {
        const status = String(data.status).toUpperCase();

        // Remove stored passphrase for completed orders
        if (["DELIVERED", "COMPLETED", "CANCELLED"].includes(status)) {
          await removeDeliveryPassphrase(data.id);

          setDeliveryPassphrase(null);

          return;
        }

        // Prefer the API value
        if (data.delivery_passphrase) {
          setDeliveryPassphrase(data.delivery_passphrase);
          return;
        }

        // Otherwise use the locally stored value
        const saved = await getDeliveryPassphrase(data.id);

        setDeliveryPassphrase(saved);
      } catch (error) {
        console.log(
          "[ORDER DETAILS] Failed to load delivery passphrase",
          error,
        );
      }
    };

    loadDeliveryPassphrase();
  }, [data]);

  if (!orderId) {
    return (
      <View style={styles.center}>
        <Text style={styles.messageText}>Invalid order ID</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.messageText}>Unable to load order</Text>
      </View>
    );
  }

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

  const handleCallDriver = async () => {
    const rawPhone = data?.driver_phone_number;

    if (!rawPhone) {
      setFeedback({
        visible: true,
        title: "Unavailable",
        message: "The driver's phone number is not available.",
        variant: "warning",
      });
      return;
    }

    // Remove spaces, hyphens, parentheses, etc.
    const phoneNumber = rawPhone.replace(/[^\d+]/g, "");

    if (!phoneNumber) {
      setFeedback({
        visible: true,
        title: "Invalid Number",
        message: "The driver's phone number is invalid.",
        variant: "warning",
      });
      return;
    }

    const phoneUrl = `tel:${phoneNumber}`;

    try {
      await Linking.openURL(phoneUrl);
    } catch (error) {
      console.error("[CALL DRIVER ERROR]", {
        phoneNumber,
        error,
      });

      setFeedback({
        visible: true,
        title: "Call Failed",
        message: "Unable to open the phone app. Please try again.",
        variant: "error",
      });
    }
  };

  const items = data.items;

  const orderRating = ratings?.find(
    (rating) => Number(rating.order) === Number(data.id),
  );

  const hasRatedOrder = !!orderRating;

  const formattedComplaint =
    orderRating?.complaint_type
      ?.replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "";

  const formattedRatedDate = orderRating?.created_at
    ? new Date(orderRating.created_at).toLocaleDateString()
    : "";

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return theme.success;

      case "pending":
      case "preparing":
      case "ready":
        return theme.warning;

      case "cancelled":
        return theme.error;

      default:
        return theme.textSecondary;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Ionicons
            key={index}
            name={index < rating ? "star" : "star-outline"}
            color={theme.warning}
            size={22}
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/orders")}
          style={styles.backBtn}
        >
          <IconSymbol name="ArrowLeftIcon" size={20} color={theme.icon} />
        </TouchableOpacity>

        <Text style={styles.title}>Order Details</Text>

        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* CANCELLED NOTICE */}
        {data.status?.toLowerCase() === "cancelled" && (
          <View
            style={{
              backgroundColor: theme.error + "15",
              borderColor: theme.error,
              borderWidth: 1,
              padding: 14,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: theme.error,
                fontWeight: "700",
                fontSize: 15,
              }}
            >
              This order was cancelled
            </Text>

            <Text
              style={{
                color: "#991b1b",
                marginTop: 4,
              }}
            >
              No further processing will occur for this order.
            </Text>
          </View>
        )}

        {/* ORDER CARD */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>#{data.id}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Status</Text>

            <View
              style={[
                styles.badge,
                { backgroundColor: getStatusColor(data.status) },
              ]}
            >
              <Text style={styles.badgeText}>{data.status ?? "Unknown"}</Text>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Branch</Text>
            <Text style={styles.value}>{data.branch_name ?? "N/A"}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Created</Text>

            <Text
              style={[
                styles.value,
                {
                  flex: 1,
                  textAlign: "right",
                  marginLeft: 12,
                },
              ]}
            >
              {data.created_at
                ? new Date(data.created_at).toLocaleString()
                : "N/A"}
            </Text>
          </View>

          {!!data.branch_address && (
            <View
              style={[
                styles.rowBetween,
                {
                  alignItems: "flex-start",
                },
              ]}
            >
              <Text style={styles.label}>Address</Text>

              <Text
                style={[
                  styles.value,
                  {
                    flex: 1,
                    textAlign: "right",
                    marginLeft: 12,
                  },
                ]}
              >
                {data.branch_address}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          {!!data.picked_up_by_user && (
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Delivery Method</Text>

              <Text
                style={[
                  styles.value,
                  {
                    color: theme.success,
                    fontWeight: "700",
                  },
                ]}
              >
                Picked up by you
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          {!!data.driver_name && (
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Driver</Text>

              <Text style={styles.value}>{data.driver_name}</Text>
            </View>
          )}

          {!!data.driver_phone_number && (
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Driver Phone Number</Text>

              <TouchableOpacity
                onPress={handleCallDriver}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons name="call-outline" size={18} color={theme.primary} />

                <Text
                  style={[
                    styles.value,
                    {
                      color: theme.primary,
                      marginLeft: 6,
                      textDecorationLine: "underline",
                    },
                  ]}
                >
                  {data.driver_phone_number}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {!!data.driver_vehicle && (
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Vehicle</Text>

              <Text style={styles.value}>
                {data.driver_vehicle.charAt(0).toUpperCase() +
                  data.driver_vehicle.slice(1)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Grand Total</Text>

            <Text style={styles.total}>
              ₦
              {Number(data.grand_total ?? data.total ?? 0).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}
            </Text>
          </View>
        </View>

        {/* ITEMS CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items</Text>

          {items.length ? (
            items.map((item: any, index: number) => {
              const snapshot = item.snapshot || {};
              const product = snapshot.item || {};

              return (
                <View
                  key={index}
                  style={{
                    paddingVertical: 14,
                    borderBottomWidth: index !== items.length - 1 ? 1 : 0,
                    borderBottomColor: theme.border,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                    }}
                  >
                    {product.image ? (
                      <Image
                        source={{ uri: product.image }}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 12,
                          marginRight: 12,
                        }}
                        resizeMode="cover"
                      />
                    ) : null}

                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemName}>
                        {product.name ?? "Unknown Item"}
                      </Text>

                      <Text style={styles.itemQty}>
                        Quantity: {item.quantity ?? 1}
                      </Text>

                      <Text
                        style={[
                          styles.itemQty,
                          {
                            marginTop: 6,
                            fontWeight: "600",
                          },
                        ]}
                      >
                        Line Total: ₦
                        {Number(item.line_total ?? 0).toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </View>
                  </View>

                  {/* OPTIONS */}
                  {snapshot.options?.length > 0 && (
                    <View style={{ marginTop: 12 }}>
                      <Text
                        style={[
                          styles.itemQty,
                          {
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Selected Options
                      </Text>

                      {snapshot.options.map(
                        (option: string, optionIndex: number) => (
                          <Text
                            key={optionIndex}
                            style={[
                              styles.itemQty,
                              {
                                marginTop: 4,
                                marginLeft: 8,
                              },
                            ]}
                          >
                            • {option}
                          </Text>
                        ),
                      )}
                    </View>
                  )}

                  {/* ADDONS */}
                  {snapshot.addons?.length > 0 && (
                    <View style={{ marginTop: 12 }}>
                      <Text
                        style={[
                          styles.itemQty,
                          {
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Addons
                      </Text>

                      {snapshot.addons.map((addon: any, addonIndex: number) => (
                        <Text
                          key={addonIndex}
                          style={[
                            styles.itemQty,
                            {
                              marginTop: 4,
                              marginLeft: 8,
                            },
                          ]}
                        >
                          •{" "}
                          {typeof addon === "string"
                            ? addon
                            : addon?.name || "Addon"}
                        </Text>
                      ))}
                    </View>
                  )}
                  {!!item.addtional_note && (
                    <View style={{ marginTop: 12 }}>
                      <Text
                        style={[
                          styles.itemQty,
                          {
                            fontWeight: "700",
                          },
                        ]}
                      >
                        Additional Note
                      </Text>

                      <Text
                        style={[
                          styles.itemQty,
                          {
                            marginTop: 4,
                            marginLeft: 8,
                          },
                        ]}
                      >
                        {item.addtional_note}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <Text style={styles.itemQty}>No items found.</Text>
          )}
        </View>

        {/* DELIVERY CODE */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Code</Text>

          {deliveryPassphrase ? (
            <View style={styles.rowBetween}>
              <Text style={styles.label}>
                <IconSymbol name="BikeIcon" size={22} color={theme.icon} />
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

                <Ionicons name="copy-outline" size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={theme.textSecondary}
              />

              <Text
                style={[
                  styles.value,
                  {
                    flex: 1,
                    marginLeft: 8,
                    color: theme.textSecondary,
                  },
                ]}
              >
                {(() => {
                  const status = String(data.status).toUpperCase();

                  switch (status) {
                    case "DELIVERED":
                      return "This order has been delivered. The delivery code is no longer available.";

                    case "CANCELLED":
                      return "This order was cancelled. No delivery code is available.";

                    case "READY":
                    case "OUT_FOR_DELIVERY":
                      return "Your delivery code will appear here shortly.";

                    default:
                      return "Your delivery code will be available once your order is ready.";
                  }
                })()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Feedback</Text>

          {data.status?.toLowerCase() !== "delivered" ? (
            <Text style={styles.itemQty}>
              Ratings become available once your order has been delivered.
            </Text>
          ) : hasRatedOrder ? (
            <>
              {renderStars(orderRating.stars)}

              {!!orderRating.review && (
                <>
                  <Text
                    style={[
                      styles.label,
                      {
                        marginTop: 18,
                      },
                    ]}
                  >
                    Your Review
                  </Text>

                  <Text style={styles.value}>{orderRating.review}</Text>
                </>
              )}

              {!!formattedComplaint && (
                <>
                  <Text
                    style={[
                      styles.label,
                      {
                        marginTop: 18,
                      },
                    ]}
                  >
                    Issue Reported
                  </Text>

                  <Text style={styles.value}>{formattedComplaint}</Text>
                </>
              )}

              {!!formattedRatedDate && (
                <>
                  <Text
                    style={[
                      styles.label,
                      {
                        marginTop: 18,
                      },
                    ]}
                  >
                    Rated On
                  </Text>

                  <Text style={styles.value}>{formattedRatedDate}</Text>
                </>
              )}

              <View style={styles.alreadyRatedCard}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.success}
                />

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text
                    style={[
                      styles.alreadyRatedText,
                      {
                        fontWeight: "700",
                      },
                    ]}
                  >
                    Thank you for your feedback!
                  </Text>

                  <Text
                    style={[
                      styles.itemQty,
                      {
                        marginTop: 4,
                      },
                    ]}
                  >
                    Your rating has been submitted successfully.
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.itemQty}>
                You haven't rated this order yet.
              </Text>

              <TouchableOpacity
                style={styles.rateButton}
                onPress={() => setRatingModalVisible(true)}
              >
                <Ionicons
                  name="star-outline"
                  size={18}
                  color={theme.background}
                />

                <Text style={styles.rateButtonText}>Rate this order</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
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

      <RatingModal
        visible={ratingModalVisible}
        loading={submittingRating}
        showDriverRating={!data.picked_up_by_user}
        onClose={() => setRatingModalVisible(false)}
        onSubmit={handleSubmitRating}
      />
    </View>
  );
}
