// components/OrderCard.tsx

import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusButton } from "./StatusButton";

type OrderAction = "accept" | "cancel" | "made" | "complete" | "pickup";

interface OrderCardProps {
  id: string;
  itemName?: string;
  orderId?: string | number;
  reference?: string;
  price?: number;
  time?: string;
  status: string;
  type: string;
  customerName?: string;
  customerPhone?: string;
  created_at?: string;
  picked_up_by_user?: boolean;
  showFulfillmentBadge?: boolean;
  onStatusPress?: (action: OrderAction) => void;
}

export function OrderCard({
  id,
  itemName,
  orderId,
  reference,
  price,
  time,
  status,
  type,
  customerName,
  customerPhone,
  created_at,
  picked_up_by_user,
  showFulfillmentBadge = true,
  onStatusPress,
}: OrderCardProps) {
  const router = useRouter();

  const handleCardPress = () => {
    const payload = {
      id,
      itemName,
      orderId,
      reference,
      price,
      time,
      status,
      type,
      customerName,
      customerPhone,
      created_at,
    };

    router.push({
      pathname: "/screens/OrderDetailsPage",
      params: {
        order: encodeURIComponent(JSON.stringify(payload)),
      },
    });
  };

  const displayTitle =
    customerName || itemName || `Order #${customerName || id}`;

  const showPrice = typeof price === "number" && !isNaN(price) && price > 0;

  const showPhone = !!customerPhone && customerPhone !== "N/A";

  const formattedPrice = showPrice
    ? new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price / 100)
    : null;

  const getActions = (): OrderAction[] => {
    switch (status) {
      case "incoming":
        return ["accept", "cancel"];

      case "preparing":
        return ["made"];

      case "ready":
        return [picked_up_by_user ? "complete" : "pickup"];

      case "picked_up":
        return ["pickup"];

      default:
        return [];
    }
  };

  const actions = getActions();

  const getActionLabel = (action: OrderAction) => {
    switch (action) {
      case "accept":
        return "Accept";

      case "cancel":
        return "Cancel";

      case "made":
        return "Ready";

      case "complete":
        return "Complete";

      case "pickup":
        return "Deliver";

      default:
        return action;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <View style={styles.leftSection}>
          {showFulfillmentBadge && (
            <View
              style={[
                styles.fulfillmentBadge,
                picked_up_by_user ? styles.pickupBadge : styles.deliveryBadge,
              ]}
            >
              <Text style={styles.fulfillmentBadgeText}>
                {picked_up_by_user ? "Pickup" : "Delivery"}
              </Text>
            </View>
          )}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{displayTitle}</Text>

            {status === "incoming" && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
          </View>

          {id ? (
            <>
              <Text style={styles.label}>Order ID</Text>
              <Text style={styles.metaText}>{id}</Text>
            </>
          ) : reference !== undefined ? (
            <>
              <Text style={styles.label}>Reference</Text>
              <Text style={styles.metaText}>#{reference}</Text>
            </>
          ) : null}

          {showPhone && (
            <>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.metaText}>{customerPhone}</Text>
            </>
          )}
        </View>

        <View style={styles.rightSection}>
          {time && <Text style={styles.time}>{time}</Text>}

          {showPrice ? (
            <Text style={styles.price}>{formattedPrice}</Text>
          ) : (
            <Text style={styles.pendingPrice}>{status}</Text>
          )}

          {actions.length === 1 ? (
            <StatusButton
              status={status}
              label={getActionLabel(actions[0])}
              onPress={() => onStatusPress?.(actions[0])}
            />
          ) : actions.length > 1 ? (
            <View style={styles.multiActions}>
              {actions.map((action) => (
                <TouchableOpacity
                  key={action}
                  style={[
                    styles.actionButton,
                    action === "accept"
                      ? styles.accept
                      : action === "cancel"
                        ? styles.cancel
                        : styles.made,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    onStatusPress?.(action);
                  }}
                >
                  <Text style={styles.actionText}>
                    {getActionLabel(action)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <StatusButton status={status} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },

  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  leftSection: {
    flex: 1,
    paddingRight: 10,
  },

  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginRight: 8,
  },

  fulfillmentBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },

  pickupBadge: {
    backgroundColor: "#F5E675",
  },

  deliveryBadge: {
    backgroundColor: "#FF592050",
  },

  fulfillmentBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },

  badge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  label: {
    fontSize: 11,
    color: "#999",
    marginTop: 6,
  },

  metaText: {
    fontSize: 13,
    color: "#444",
  },

  time: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },

  pendingPrice: {
    fontSize: 13,
    color: "#999",
    marginBottom: 8,
    fontStyle: "italic",
  },

  multiActions: {
    flexDirection: "row",
    gap: 6,
  },

  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  accept: {
    backgroundColor: "#34C759",
  },

  cancel: {
    backgroundColor: "#FF3B30",
  },

  made: {
    backgroundColor: "#007AFF",
  },

  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
