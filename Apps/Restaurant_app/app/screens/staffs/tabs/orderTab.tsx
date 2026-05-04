import { FilterChips } from "@/components/FilterChips";
import { FloatingChatButton } from "@/components/FloatingChatButton";
import { OrderCard } from "@/components/OrderCard";
import { TabSelector } from "@/components/TabSelector";
import { Order } from "@/data/mockOrders";
import { getAccessToken } from "@/utils/authStorage";
import { useRouter } from "expo-router";
import { MessageCircle, Search } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrdersScreen() {
  const router = useRouter();

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [orderType, setOrderType] = useState<"food" | "rooms">("food");
  const [statusFilter, setStatusFilter] = useState("incoming");
  const [historyFilter, setHistoryFilter] = useState("completed");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const typeTabs = [
    { key: "food", label: "Food" },
    { key: "rooms", label: "Rooms" },
  ];

  const statusFilters = [
    { key: "incoming", label: "Incoming" },
    { key: "preparing", label: "Preparing" },
    { key: "ready", label: "Ready" },
    { key: "history", label: "History" },
  ];

  const mapBackendStatus = (status: string) => {
    switch (status) {
      case "pending":
      case "payment_pending":
        return "incoming";
      case "preparing":
        return "preparing";
      case "ready":
        return "ready";
      case "completed":
        return "completed";
      case "cancelled":
        return "rejected";
      default:
        return "incoming";
    }
  };

  const handleSocketData = (payload: any) => {
    if (!payload?.type) return;

    if (payload.type === "notification") {
      const event = payload.data;

      if (!event?.order_id) return;

      setOrders((prev) => {
        const id = String(event.order_id);
        const index = prev.findIndex((o) => o.id === id);

        const updatedOrder: Order = {
          id,
          order_id: event.order_number ?? id,
          item_name: event.item_name ?? `Order #${id}`,
          price: event.amount ?? 0,
          created_at: event.timestamp ?? new Date().toISOString(),
          status: mapBackendStatus(event.status),
          type: "food",
          customer_name: event.customer_name ?? "Customer",
          customer_phone: event.customer_phone ?? "N/A",
        };

        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            status: updatedOrder.status,
            price: updatedOrder.price ?? updated[index].price,
          };
          return updated;
        }

        return [updatedOrder, ...prev];
      });
    }

    if (payload.type === "active_orders") {
      const mapped: Order[] = (payload.data || []).map((o: any) => ({
        id: String(o.id),
        order_id: o.order_number,
        item_name: o.orderer__user__name || `Order #${o.id}`,
        price: o.last_event_metadata?.amount || 0,
        created_at: o.created_at,
        status: mapBackendStatus(o.status),
        type: "food",
        customer_name: o.orderer__user__name || "Customer",
        customer_phone: "N/A",
      }));

      setOrders(mapped);
    }
  };

  useEffect(() => {
    if (orderType !== "food") return;

    let isMounted = true;

    const connectSocket = async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;

        const rawToken = token.replace(/^Bearer\s+/i, "");
        const url = `wss://ovena-backend-production.up.railway.app/ws/branch/?token=${rawToken}`;

        if (socketRef.current) {
          socketRef.current.close();
        }

        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleSocketData(data);
          } catch (err) {
            console.log("❌ WS parse error:", err);
          }
        };

        socket.onerror = (err) => {
          console.log("❌ WS error:", err);
        };

        socket.onclose = () => {
          if (!isMounted) return;

          reconnectTimer.current = setTimeout(connectSocket, 30000);
        };
      } catch (err) {
        console.log("❌ WS setup error:", err);
      }
    };

    connectSocket();

    return () => {
      isMounted = false;

      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, [orderType]);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (statusFilter === "history") {
      filtered = filtered.filter((o) => o.status === historyFilter);
    } else {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [orders, statusFilter, historyFilter]);

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

  const handleOrderAction = async (
    orderId: string,
    action: "accept" | "cancel" | "made",
  ) => {
    try {
      const token = await getAccessToken();

      await fetch(
        "https://ovena-backend-production.up.railway.app/menu/restaurant-order/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({
            action,
            order_id: Number(orderId),
          }),
        },
      );

      // Optional: optimistic UI update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status:
                  action === "accept"
                    ? "preparing"
                    : action === "made"
                      ? "ready"
                      : "rejected",
              }
            : o,
        ),
      );
    } catch (err) {
      console.log("❌ Order action error:", err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Orders</Text>
          <TouchableOpacity>
            <Search color="#000" size={24} />
          </TouchableOpacity>
        </View>

        {/* TABS */}
        <View style={styles.typeTabsContainer}>
          <TabSelector
            tabs={typeTabs}
            activeTab={orderType}
            onTabChange={(key) => setOrderType(key as "food" | "rooms")}
          />
        </View>

        {/* FILTERS */}
        <View style={styles.filtersContainer}>
          <FilterChips
            filters={statusFilters}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </View>

        {statusFilter === "history" && (
          <View style={styles.historyFiltersContainer}>
            <FilterChips
              filters={[
                { key: "completed", label: "Completed" },
                { key: "rejected", label: "Rejected" },
                { key: "in_transit", label: "In transit" },
              ]}
              activeFilter={historyFilter}
              onFilterChange={setHistoryFilter}
            />
          </View>
        )}

        {/* LIST */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : filteredOrders.length === 0 ? (
            <Text style={styles.emptyText}>No orders found</Text>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                itemName={order.item_name}
                orderId={order.order_id}
                price={order.price}
                time={formatTime(order.created_at)}
                status={order.status}
                type={order.type}
                customerName={order.customer_name}
                customerPhone={order.customer_phone}
                created_at={order.created_at}
                onStatusPress={(action) => handleOrderAction(order.id, action)}
              />
            ))
          )}
        </ScrollView>

        {/* CHAT */}
        <FloatingChatButton
          icon={<MessageCircle size={28} color="#fff" />}
          onPress={() => router.push("/screens/staffs/SupportPage")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },

  typeTabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  filtersContainer: {
    paddingLeft: 16,
  },

  historyFiltersContainer: {
    paddingLeft: 16,
    marginTop: -8,
  },

  scrollView: { flex: 1 },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  loadingText: {
    textAlign: "center",
    marginTop: 32,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 32,
  },
});
