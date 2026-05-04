import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/atoms/Text";
import { Package } from "lucide-react-native";

interface TopProductCardProps {
  name?: string;
  orders?: number;
  quantity?: number;
  revenue?: number;
  loading?: boolean;
}

export const TopProductCard = ({
  name,
  orders,
  quantity,
  revenue,
  loading = false,
}: TopProductCardProps) => {
  return (
    <View style={styles.container}>
      {/* TITLE */}
      <Text style={styles.title}>Top Product</Text>

      {/* CARD */}
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Package size={18} color="#FF5A1F" />
          </View>

          <Text style={styles.productName}>
            {loading ? "..." : name || "N/A"}
          </Text>
        </View>

        {/* DETAILS */}
        <View style={styles.row}>
          <Text style={styles.label}>Orders</Text>
          <Text style={styles.value}>{loading ? "..." : orders || 0}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Quantity Sold</Text>
          <Text style={styles.value}>{loading ? "..." : quantity || 0}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Revenue</Text>
          <Text style={styles.revenue}>
            {loading
              ? "..."
              : `₦${Number(revenue || 0).toLocaleString()}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFF2EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  productName: {
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  label: {
    color: "#00000080",
    fontSize: 13,
  },

  value: {
    fontSize: 14,
    fontWeight: "500",
  },

  revenue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF5A1F",
  },
});