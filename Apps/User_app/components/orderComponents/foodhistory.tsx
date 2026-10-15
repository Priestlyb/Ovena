import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { createFoodHistoryStyles } from "@/constants/styles/ordersStyles";
import { useTheme } from "@/constants/theme";
import { IconSymbol } from "../ui/icon-symbol";

/* =========================================
   TYPES
========================================= */

export interface FoodOrder {
  id?: string | number;

  product_name?: string | null;

  product_image?: string | null;

  grand_total?: string | number;

  branch?: string | null;

  status?: string;
  created_at?: string;

  // Optional future field from your API
  is_rated?: boolean;
}

/* =========================================
   PROPS
========================================= */

interface FoodHistoryCardProps {
  order: FoodOrder;

  onRate?: (order: FoodOrder) => void;
  onReOrder?: (order: FoodOrder) => void;

  // NEW
  reordering?: boolean;
}

/* =========================================
   COMPONENT
========================================= */

const FoodHistoryCard: React.FC<FoodHistoryCardProps> = ({
  order,
  onRate,
  onReOrder,
  reordering = false,
}) => {
  const theme = useTheme();
  const styles = createFoodHistoryStyles(theme);
  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleString()
    : "";

  const formattedPrice = Number(order.grand_total ?? 0).toLocaleString();

  const imageUrl = order.product_image ?? null;

  const canRate =
    String(order.status).toUpperCase() === "DELIVERED" && !order.is_rated;

  return (
    <View style={styles.foodCardRed}>
      {/* STATUS */}
      {order.status ? (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>
      ) : null}

      {/* CONTENT */}
      <View style={styles.contentRow}>
        {/* IMAGE */}
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <IconSymbol
              name="FastFoodIcon"
              size={36}
              color={theme.background}
            />
          </View>
        )}

        {/* DETAILS */}
        <View style={styles.detailsContainer}>
          {/* <Text style={styles.cardTitleWhite} numberOfLines={2}>
            {order.product_name || "Food Order"}
          </Text> */}

          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={"#ffffff"} />
            <Text style={styles.locationTextWhite} numberOfLines={1}>
              {order.branch || ""}
            </Text>
          </View>

          {!!formattedDate && (
            <Text style={styles.cardDescriptionWhite}>{formattedDate}</Text>
          )}

          <Text style={styles.priceTextWhite}>₦{formattedPrice}</Text>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.buttonRow}>
        {canRate && onRate && (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => onRate(order)}
            disabled={reordering}
          >
            <Text style={styles.rateButtonText}>Rate</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.reOrderButton,
            reordering && {
              opacity: 0.6,
            },
          ]}
          onPress={() => onReOrder?.(order)}
          disabled={reordering}
          activeOpacity={0.8}
        >
          <Text style={styles.reOrderButtonText}>
            {reordering ? "Reordering..." : "Re-Order"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FoodHistoryCard;
