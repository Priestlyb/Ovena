import { OrderCard } from "@/components/OrderCard";
import { styles } from "@/constants/ordertabs";
import { Order } from "@/data/mockOrders";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

type OrderAction = "accept" | "cancel" | "made" | "pickup" | "complete";

type Props = {
  loading: boolean;
  orders: Order[];
  formatTime: (date?: string) => string;
  showFulfillmentBadge?: boolean;
  onAction: (orderId: string, action: OrderAction, pickupCode?: string) => void;
};

export const OrdersList = ({
  loading,
  orders,
  formatTime,
  showFulfillmentBadge = true,
  onAction,
}: Props) => {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {loading ? (
        <SafeAreaView style={styles.safeArea}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#F84E10" />
          </View>
        </SafeAreaView>
      ) : orders.length === 0 ? (
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.emptyText}>No orders found</Text>
        </SafeAreaView>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            id={String(order.id)}
            orderId={order.order_id ?? order.id}
            itemName={order.product_name ?? order.item_name ?? order.branch}
            reference={order.reference}
            price={Number(order.grand_total ?? order.price) * 100 || 0}
            time={formatTime(order.created_at)}
            status={order.status}
            type={order.type ?? "food"}
            customerName={order.customer_name}
            customerPhone={order.customer_phone}
            created_at={order.created_at}
            picked_up_by_user={order.picked_up_by_user}
            showFulfillmentBadge={showFulfillmentBadge}
            onStatusPress={(action) => onAction(String(order.id), action)}
          />
        ))
      )}
    </ScrollView>
  );
};
