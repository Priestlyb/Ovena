import React from "react";

import { View, Text, TouchableOpacity, Image } from "react-native";

import { Counter } from "./Counter";
import { CartItem } from "@/src/types";
import { IconSymbol } from "../ui/icon-symbol";

import { createStyles } from "@/constants/styles/CartItemComponent.styles";

import { useTheme } from "@/constants/theme";

interface CartItemComponentProps {
  item: CartItem;
  onPress: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onDelete: () => void;
}

export const CartItemComponent: React.FC<CartItemComponentProps> = ({
  item,
  onPress,
  onIncrement,
  onDecrement,
  onDelete,
}) => {
  const theme = useTheme();

  const styles = createStyles(theme);

  const itemName = item.product_name || "Unnamed item";

  const restaurantName = item.business_name || "Restaurant";

  const lineTotal = Number(item.line_total || 0);

  const image = item.image;

  return (
    <View style={styles.cartItemContainer}>
      {/* ITEM CONTENT */}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.cartItemContent}
      >
        {/* IMAGE */}

        {image ? (
          <Image
            source={{
              uri: image,
            }}
            style={styles.cartItemImage}
          />
        ) : (
          <View style={styles.cartItemImage} />
        )}

        {/* DETAILS */}

        <View style={styles.cartItemDetails}>
          <Text style={styles.cartItemName}>{itemName}</Text>

          <Text style={styles.cartItemRestaurant}>{restaurantName}</Text>

          {(item.variants?.length ?? 0) > 0 && (
            <Text style={styles.optionText}>
              {item.variants!.map((v) => v.name).join(", ")}
            </Text>
          )}

          {(item.addons?.length ?? 0) > 0 && (
            <Text style={styles.optionText}>
              + {item.addons!.map((a) => a.name).join(", ")}
            </Text>
          )}

          <Text style={styles.lineTotal}>
            ₦{lineTotal.toLocaleString("en-NG")}
          </Text>
        </View>

        {/* DELETE */}

        <TouchableOpacity onPress={onDelete} style={styles.deleteIconButton}>
          <IconSymbol name="TrashOutline" size={22} color={theme.error} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* QUANTITY */}

      <View style={styles.cartItemActions}>
        <Counter
          value={item.quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          minValue={1}
        />
      </View>
    </View>
  );
};
