// components/OrderCard.tsx
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusButton } from "./StatusButton";

type OrderAction = "accept" | "cancel" | "made";

interface OrderCardProps {
  id: string;
  itemName?: string;
  orderId?: string | number;
  price?: number;
  time?: string;
  status: string;
  type: string;
  customerName?: string;
  customerPhone?: string;
  created_at?: string;

  onStatusPress?: (action: OrderAction) => void;
}

export function OrderCard({
  id,
  itemName,
  orderId,
  price,
  time,
  status,
  type,
  customerName,
  customerPhone,
  created_at,
  onStatusPress,
}: OrderCardProps) {
  const router = useRouter();

  const handleCardPress = () => {
    const payload = {
      id,
      itemName,
      orderId,
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

  const displayTitle = customerName || itemName || `Order #${orderId || id}`;

  const showPrice = typeof price === "number" && price > 0;
  const showPhone = !!customerPhone && customerPhone !== "N/A";

  // ✅ Decide what action(s) to show
  const getActions = (): OrderAction[] => {
    switch (status) {
      case "incoming":
        return ["accept", "cancel"];
      case "preparing":
        return ["made"];
      default:
        return [];
    }
  };

  const actions = getActions();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <View style={styles.leftSection}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{displayTitle}</Text>

            {status === "incoming" && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
          </View>

          {orderId !== undefined && (
            <>
              <Text style={styles.label}>Order ID</Text>
              <Text style={styles.metaText}>#{orderId}</Text>
            </>
          )}

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
            <Text style={styles.price}>₦{price!.toLocaleString()}</Text>
          ) : (
            <Text style={styles.pendingPrice}>Pending</Text>
          )}

          {/* ✅ ACTION BUTTONS */}
          {actions.length === 1 ? (
            <StatusButton
              status={status}
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
                    e.stopPropagation(); // 🚫 prevent card click
                    onStatusPress?.(action);
                  }}
                >
                  <Text style={styles.actionText}>
                    {action === "accept"
                      ? "Accept"
                      : action === "cancel"
                        ? "Cancel"
                        : "Ready"}
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
    marginBottom: 12,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftSection: { flex: 1, paddingRight: 10 },
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

  /* ✅ Multi-action styles */
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
