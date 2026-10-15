import { useRouter } from "expo-router";
import React, { useState, useEffect, useMemo } from "react";
import { Animated, ScrollView, Text, View, RefreshControl } from "react-native";

import FoodHistoryCardWithDetails from "@/components/orderComponents/FoodHistoryCardWithDetails";
import FoodOrderCard from "@/components/orderComponents/foodorder";
import FilterPills from "@/components/orderComponents/filterpills";
import RoomOrderCard from "@/components/orderComponents/roomorder";
import TabSwitch from "@/components/orderComponents/tabswitch";

import { useOrderHistory } from "@/hooks/orders/useOrderHistory";
import { useFoodOrders } from "@/hooks/orders/useFoodOrders";
import { useRoomOrders } from "@/hooks/orders/useRoomOrders";
import { useOrderSocketsManager } from "@/hooks/orders/useOrderSocketsManager";
import useRateOrder from "@/hooks/ratings/useRateOrder";
import type { RatingPayload } from "@/hooks/ratings/useRateOrder";
import { useReorder } from "@/hooks/orders/useReorder";

import { normalizeOrders } from "@/src/utils/orders/normalizeOrders";
import { createOrdersStyles } from "@/constants/styles/ordersStyles";
import { useTheme } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import FeedbackModal from "@/components/FeedbackModal";
import { useAuth } from "@/context/AuthContext";
import RatingModal from "@/src/modals/RatingModal";

import {
  saveDeliveryPassphrase,
  removeDeliveryPassphrase,
} from "@/src/utils/deliveryPassphraseStorage";

type TabType = "Foods" | "Rooms";
type FilterType = "Upcoming" | "History";

const TERMINAL_STATUSES = ["DELIVERED", "COMPLETED", "CANCELLED"];

export default function OrdersTab() {
  const theme = useTheme();
  const styles = createOrdersStyles(theme);
  const router = useRouter();

  /* =========================================
     UI STATE
  ========================================= */

  const [activeTab, setActiveTab] = useState<TabType>("Foods");

  const [foodFilter, setFoodFilter] = useState<FilterType>("Upcoming");

  const [roomFilter, setRoomFilter] = useState<FilterType>("Upcoming");

  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const [ratingModalVisible, setRatingModalVisible] = useState(false);

  const [ratingLoading, setRatingLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [reorderingOrderId, setReorderingOrderId] = useState<
    number | string | null
  >(null);

  const [feedbackData, setFeedbackData] = useState({
    title: "",
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  /* =========================================
     ORDER HISTORY
  ========================================= */

  const { orders, loading, error, refetch } = useOrderHistory();

  /*
   * Normalize only when the source orders actually change.
   */
  const normalizedOrders = useMemo(() => {
    return normalizeOrders(orders ?? []);
  }, [orders]);

  /* =========================================
     AUTH
  ========================================= */

  const { accessToken } = useAuth();

  /* =========================================
     LIVE ORDERS
  ========================================= */

  const [liveOrders, setLiveOrders] = useState<any[]>(normalizedOrders);

  /**
   * Keep local live orders synchronized with
   * React Query orders.
   *
   * IMPORTANT:
   * Do not blindly call setLiveOrders().
   *
   * If React Query gives us a new array reference
   * containing the same data, blindly updating state
   * causes unnecessary renders and can create an
   * effect loop with the socket manager.
   */
  useEffect(() => {
    setLiveOrders((previous) => {
      const previousString = JSON.stringify(previous);
      const nextString = JSON.stringify(normalizedOrders);

      if (previousString === nextString) {
        return previous;
      }

      return normalizedOrders;
    });
  }, [normalizedOrders]);

  /**
   * Only send active/non-terminal orders to
   * the socket manager.
   *
   * useMemo is important because .filter()
   * creates a new array every render.
   */
  const socketOrders = useMemo(() => {
    return liveOrders.filter((order) => {
      const status = String(order.status).toUpperCase();

      return !TERMINAL_STATUSES.includes(status);
    });
  }, [liveOrders]);

  /* =========================================
     ORDER SOCKETS
  ========================================= */

  useOrderSocketsManager({
    orders: socketOrders,
    token: accessToken ?? "",
    enabled: !!accessToken,

    onOrderUpdate: (orderId, update) => {
      setLiveOrders((previous) => {
        let changed = false;

        const updatedOrders = previous.map((order) => {
          if (String(order.id) !== String(orderId)) {
            return order;
          }

          changed = true;

          return {
            ...order,
            ...update,
            isLive: true,
          };
        });

        /*
         * If there was no matching order, don't
         * create a new state reference.
         */
        if (!changed) {
          return previous;
        }

        return updatedOrders;
      });
    },
  });

  /* =========================================
     DELIVERY PASSPHRASE CLEANUP
  ========================================= */

  useEffect(() => {
    let cancelled = false;

    const cleanupPassphrases = async () => {
      if (cancelled) return;

      const completedOrders = liveOrders.filter((order) => {
        const status = String(order.status).toUpperCase();

        return TERMINAL_STATUSES.includes(status);
      });

      if (completedOrders.length === 0) {
        return;
      }

      await Promise.all(
        completedOrders.map((order) => removeDeliveryPassphrase(order.id)),
      );
    };

    cleanupPassphrases();

    return () => {
      cancelled = true;
    };
  }, [liveOrders]);

  /* =========================================
     DERIVED ORDERS
  ========================================= */

  const foodOrders = useFoodOrders(liveOrders, foodFilter);

  const roomOrders = useRoomOrders(liveOrders, roomFilter);

  /* =========================================
     REORDER
  ========================================= */

  const { mutate: reorder } = useReorder();

  const handleReOrder = (orderId: number | string) => {
    if (reorderingOrderId !== null) {
      return;
    }

    setReorderingOrderId(orderId);

    reorder(orderId, {
      onSuccess: async (data) => {
        console.log("[REORDER RESPONSE]", data);

        if (data.delivery_passphrase) {
          await saveDeliveryPassphrase(data.order_id, data.delivery_passphrase);

          console.log(
            "[REORDER] Saved delivery passphrase:",
            data.delivery_passphrase,
          );
        }

        setReorderingOrderId(null);

        router.push({
          pathname: "/screens/PaymentScreen",
          params: {
            paymentUrl: data.payment_url,
            orderId: String(data.order_id),
          },
        });
      },

      onError: (error: any) => {
        setReorderingOrderId(null);

        setFeedbackData({
          title: "Reorder Failed",
          message:
            error?.response?.data?.message ??
            "Unable to reorder at the moment.",
          variant: "error",
        });

        setFeedbackVisible(true);
      },
    });
  };

  /* =========================================
     ORDER RATING
  ========================================= */

  const { submitRating } = useRateOrder();

  const handleRate = (order: any) => {
    setSelectedOrder(order);
    setRatingModalVisible(true);
  };

  const handleSubmitRating = async (
    payload: Omit<RatingPayload, "order_id">,
  ) => {
    if (!selectedOrder) {
      return;
    }

    setRatingLoading(true);

    try {
      const result = await submitRating({
        order_id: Number(selectedOrder.id),
        ...payload,
      });

      if (result.success) {
        setRatingModalVisible(false);
        setSelectedOrder(null);

        setFeedbackData({
          title: "Rating Submitted",
          message: "Thank you for your feedback.",
          variant: "success",
        });

        setFeedbackVisible(true);

        console.log("[ORDER RATING SUCCESS]", result.data);
      } else {
        setFeedbackData({
          title: "Unable to Submit Rating",
          message: result.error || "Something went wrong.",
          variant: "error",
        });

        setFeedbackVisible(true);
      }
    } catch (error: any) {
      setFeedbackData({
        title: "Unable to Submit Rating",
        message: error?.message || "Something went wrong.",
        variant: "error",
      });

      setFeedbackVisible(true);

      console.log("[ORDER RATING ERROR]", error);
    } finally {
      setRatingLoading(false);
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <View style={styles.container}>
      {loading && (
        <View
          style={{
            height: 2,
            backgroundColor: theme.border,
          }}
        >
          <Animated.View
            style={{
              height: "100%",
              width: "40%",
              backgroundColor: theme.primary,
              opacity: 0.6,
              position: "absolute",
              left: 0,
            }}
          />
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerSpacer} />

          <Text style={styles.headerTitle}>Craving It Again?!</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* TAB SWITCH */}

        <TabSwitch
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={["Foods"]}
        />

        {/* FOOD TAB */}

        {activeTab === "Foods" && (
          <View
            style={{
              opacity: loading ? 0.6 : 1,
            }}
          >
            <FilterPills
              activeFilter={foodFilter}
              onFilterChange={setFoodFilter}
              filters={["Upcoming", "History"]}
            />

            {foodOrders.length === 0 ? (
              <View style={styles.centerContent}>
                <IconSymbol
                  name="FastFoodIcon"
                  size={100}
                  color={theme.textSecondary}
                />

                <Text style={styles.infoText}>No food orders found</Text>
              </View>
            ) : (
              foodOrders.map((order: any) =>
                foodFilter === "Upcoming" ? (
                  <FoodOrderCard key={order.id} order={order} />
                ) : (
                  <FoodHistoryCardWithDetails
                    key={order.id}
                    order={order}
                    onRate={handleRate}
                    onReOrder={() => handleReOrder(order.id)}
                    reordering={reorderingOrderId === order.id}
                  />
                ),
              )
            )}
          </View>
        )}

        {/* ROOM TAB */}

        {activeTab === "Rooms" && (
          <View
            style={{
              opacity: loading ? 0.6 : 1,
            }}
          >
            <FilterPills
              activeFilter={roomFilter}
              onFilterChange={setRoomFilter}
              filters={["Upcoming", "History"]}
            />

            {roomOrders.length === 0 ? (
              <View style={styles.centerContent}>
                <IconSymbol
                  name="BedRoomIcon"
                  size={100}
                  color={theme.textSecondary}
                />

                <Text style={styles.infoText}>No room bookings found</Text>
              </View>
            ) : (
              roomOrders.map((order: any) => (
                <RoomOrderCard
                  key={order.id}
                  order={order}
                  isHistory={roomFilter === "History"}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* RATING MODAL */}

      <RatingModal
        visible={ratingModalVisible}
        loading={ratingLoading}
        showDriverRating={!selectedOrder?.picked_up_by_user}
        onClose={() => {
          setRatingModalVisible(false);
          setSelectedOrder(null);
        }}
        onSubmit={handleSubmitRating}
      />

      {/* FEEDBACK MODAL */}

      <FeedbackModal
        visible={feedbackVisible}
        title={feedbackData.title}
        message={feedbackData.message}
        variant={feedbackData.variant}
        onClose={() => setFeedbackVisible(false)}
      />
    </View>
  );
}
