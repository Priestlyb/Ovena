import { FilterChips } from "@/components/FilterChips";
import { FloatingChatButton } from "@/components/FloatingChatButton";
import { OrdersHeader } from "@/components/staff/OrdersHeader";
import { OrdersList } from "@/components/staff/OrdersList";
import { TabSelector } from "@/components/TabSelector";

import { styles } from "@/constants/ordertabs";

import { Order } from "@/data/mockOrders";

import { useFilteredOrders } from "@/hooks/staff/useFilteredOrders";
import { useOrderActions } from "@/hooks/staff/useOrderActions";
import { useOrdersSocket } from "@/hooks/staff/useOrdersSocket";

import { useStaffOrderHistory } from "@/hooks/staff/useStaffOrderHistory";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Animated,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrdersScreen() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading] = useState(false);

  const [orderType, setOrderType] = useState<"food" | "rooms">("food");

  const [statusFilter, setStatusFilter] = useState("incoming");

  const [historyFilter, setHistoryFilter] = useState("preparing");

  const typeTabs = [{ key: "food", label: "Food" }];

  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [showRefreshHint, setShowRefreshHint] = useState(true);
  const [fulfillmentModalVisible, setFulfillmentModalVisible] = useState(false);

  const [pickupModalVisible, setPickupModalVisible] = useState(false);

  const [pendingAction, setPendingAction] = useState<"pickup" | "complete">(
    "pickup",
  );

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [pickupCode, setPickupCode] = useState("");

  const bounceAnim = useState(new Animated.Value(0))[0];
  const fadeAnim = useState(new Animated.Value(1))[0];

  const statusFilters = [
    { key: "incoming", label: "Incoming" },
    { key: "preparing", label: "Preparing" },
    { key: "ready", label: "Ready" },
    { key: "driver_assigned", label: "Driver Assigned" },
    { key: "picked_up", label: "Picked Up" },
    { key: "on_the_way", label: "On the Way" },
    { key: "history", label: "History" },
  ];

  useOrdersSocket({
    orderType,
    setOrders,
  });

  const {
    data: historyOrders = [],
    isLoading: historyLoading,
    isRefetching,
    refetch,
  } = useStaffOrderHistory();

  const onRefresh = useCallback(async () => {
    setShowRefreshHint(false);
    await refetch();
  }, [refetch]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 10,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowRefreshHint(false);
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const { handleOrderAction } = useOrderActions(setOrders);

  const onOrderAction = (
    orderId: string,
    action: "accept" | "cancel" | "made" | "complete" | "pickup",
    pickupCode?: string,
  ) => {
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      console.log("Order not found:", orderId);
      return;
    }

    /**
     * Ready action:
     * Ask staff whether this is delivery or customer pickup
     */
    if (action === "pickup" || action === "complete") {
      setSelectedOrder(order);
      setFulfillmentModalVisible(true);
      return;
    }

    handleOrderAction(order, action, pickupCode);
  };

  const handleFulfillmentChoice = (type: "delivery" | "pickup") => {
    setFulfillmentModalVisible(false);

    /**
     * Existing backend actions:
     *
     * pickup   = delivery flow
     * complete = customer pickup flow
     */
    setPendingAction(type === "delivery" ? "pickup" : "complete");

    setPickupCode("");
    setPickupModalVisible(true);
  };

  const handlePickupSubmit = () => {
    const code = pickupCode.trim();

    if (!code || !selectedOrder) {
      return;
    }

    handleOrderAction(selectedOrder, pendingAction, code);

    setPickupModalVisible(false);
    setPickupCode("");
    setSelectedOrder(null);
    setPendingAction("pickup");
  };

  const handlePickupCancel = () => {
    setPickupModalVisible(false);
    setPickupCode("");
    setSelectedOrder(null);
    setPendingAction("pickup");
  };

  const handleFulfillmentCancel = () => {
    setFulfillmentModalVisible(false);
    setSelectedOrder(null);
  };

  const activeOrders = useFilteredOrders(orders, statusFilter, historyFilter);

  const mappedHistoryOrders: Order[] = useMemo(() => {
    return historyOrders.map((order: any) => ({
      id: String(order.id),

      item_name: order.product_name ?? order.branch ?? `Order #${order.id}`,

      product_name: order.product_name,
      product_image: order.product_image,
      branch: order.branch,
      extra_items: order.extra_items,

      // Keep both values from the API if available
      subtotal: order.subtotal,
      grand_total: order.grand_total,

      order_id:
        order.order_number && order.order_number > 0
          ? String(order.order_number)
          : String(order.id),

      reference: "",

      // OrderCard expects the value in kobo
      price: Math.round(
        Number(order.grand_total ?? order.subtotal ?? order.amount ?? 0) * 100,
      ),

      type: "food",

      status: order.status,

      customer_name: order.customer_name || "Customer",

      customer_phone: order.customer_phone ?? "",

      created_at: order.created_at,

      picked_up_by_user: order.picked_up_by_user,
    }));
  }, [historyOrders]);

  const filteredHistoryOrders = useMemo(() => {
    return mappedHistoryOrders.filter(
      (order) => order.status === historyFilter,
    );
  }, [mappedHistoryOrders, historyFilter]);

  const displayedOrders: Order[] = useMemo(() => {
    const baseOrders =
      statusFilter === "history" ? filteredHistoryOrders : activeOrders;

    const query = search.trim().toLowerCase();

    if (!query) return baseOrders;

    return baseOrders.filter((order) => {
      const id = String(order.id ?? "").toLowerCase();
      const orderId = String(order.order_id ?? "").toLowerCase();

      return id.includes(query) || orderId.includes(query);
    });
  }, [search, statusFilter, activeOrders, filteredHistoryOrders]);

  const currentLoading = statusFilter === "history" ? historyLoading : loading;

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
      >
        <OrdersHeader search={search} onSearchChange={setSearch} />

        <View style={styles.typeTabsContainer}>
          <TabSelector
            tabs={typeTabs}
            activeTab={orderType}
            onTabChange={(key) => setOrderType(key as "food" | "rooms")}
          />
        </View>

        <View style={styles.filtersContainer}>
          <FilterChips
            filters={statusFilters}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </View>

        {showRefreshHint && (
          <Animated.View
            style={{
              alignItems: "center",
              marginTop: 8,
              marginBottom: 10,
              opacity: fadeAnim,
              transform: [{ translateY: bounceAnim }],
            }}
          >
            <Ionicons name="arrow-down-circle-outline" size={24} color="#666" />

            <Text
              style={{
                fontSize: 12,
                color: "#666",
                marginTop: 4,
              }}
            >
              Pull down to refresh
            </Text>
          </Animated.View>
        )}

        {statusFilter === "history" && (
          <View style={styles.historyFiltersContainer}>
            <FilterChips
              filters={[
                {
                  key: "preparing",
                  label: "Preparing",
                },
                {
                  key: "ready",
                  label: "Ready",
                },
                {
                  key: "picked_up",
                  label: "Picked Up",
                },
                {
                  key: "on_the_way",
                  label: "On the Way",
                },
                {
                  key: "delivered",
                  label: "Delivered",
                },
                {
                  key: "cancelled",
                  label: "Cancelled",
                },
              ]}
              activeFilter={historyFilter}
              onFilterChange={setHistoryFilter}
            />
          </View>
        )}

        <OrdersList
          loading={currentLoading}
          orders={displayedOrders}
          formatTime={formatTime}
          onAction={onOrderAction}
          showFulfillmentBadge={statusFilter !== "history"}
        />

        <FloatingChatButton
          icon={<MessageCircle size={28} color="#fff" />}
          onPress={() => router.push("/screens/staffs/SupportPage")}
        />

        <Modal
          visible={pickupModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handlePickupCancel}
        >
          <View style={modalStyles.overlay}>
            <View style={modalStyles.container}>
              <Text style={modalStyles.title}>
                {pendingAction === "pickup"
                  ? "Enter Delivery Code"
                  : "Enter Pickup Code"}
              </Text>

              <Text style={modalStyles.subtitle}>
                {pendingAction === "pickup"
                  ? "Enter the customer's delivery code before sending the order."
                  : "Enter the customer's pickup code before completing the order."}
              </Text>

              <TextInput
                style={modalStyles.input}
                value={pickupCode}
                onChangeText={setPickupCode}
                placeholder={
                  pendingAction === "pickup" ? "Delivery code" : "Pickup code"
                }
                placeholderTextColor="#999"
                autoFocus
                maxLength={25}
              />

              <View style={modalStyles.actions}>
                <TouchableOpacity
                  style={modalStyles.cancelButton}
                  onPress={handlePickupCancel}
                >
                  <Text style={modalStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    modalStyles.confirmButton,
                    pickupCode.trim().length === 0 &&
                      modalStyles.confirmButtonDisabled,
                  ]}
                  disabled={pickupCode.trim().length === 0}
                  onPress={handlePickupSubmit}
                >
                  <Text style={modalStyles.confirmButtonText}>
                    {pendingAction === "pickup"
                      ? "Send Delivery"
                      : "Complete Pickup"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={fulfillmentModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleFulfillmentCancel}
        >
          <View style={modalStyles.overlay}>
            <View style={modalStyles.container}>
              <Text style={modalStyles.title}>
                How will this order be fulfilled?
              </Text>

              <Text style={modalStyles.subtitle}>
                Choose how the customer will receive this order.
              </Text>

              {/* Delivery */}
              <TouchableOpacity
                style={modalStyles.optionButton}
                onPress={() => handleFulfillmentChoice("delivery")}
              >
                <Ionicons name="bicycle-outline" size={24} color="#F84E10" />

                <View style={modalStyles.optionContent}>
                  <Text style={modalStyles.optionTitle}>Delivery</Text>

                  <Text style={modalStyles.optionSubtitle}>
                    Send the order to the customer.
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Customer Pickup */}
              <TouchableOpacity
                style={modalStyles.optionButton}
                onPress={() => handleFulfillmentChoice("pickup")}
              >
                <Ionicons name="bag-handle-outline" size={24} color="#F84E10" />

                <View style={modalStyles.optionContent}>
                  <Text style={modalStyles.optionTitle}>Customer Pickup</Text>

                  <Text style={modalStyles.optionSubtitle}>
                    Customer will collect the order.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={modalStyles.cancelFullButton}
                onPress={handleFulfillmentCancel}
              >
                <Text style={modalStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 20,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111",
    backgroundColor: "#FAFAFA",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },

  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },

  optionContent: {
    marginLeft: 14,
    flex: 1,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  optionSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  cancelFullButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4,
  },

  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginRight: 12,
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },

  confirmButton: {
    backgroundColor: "#F84E10",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },

  confirmButtonDisabled: {
    opacity: 0.5,
  },

  confirmButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
