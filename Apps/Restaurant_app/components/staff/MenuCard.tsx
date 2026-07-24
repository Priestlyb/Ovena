import { styles } from "@/constants/foodTab";
import { MenuItem } from "@/types/menu";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  item: MenuItem;
  onEdit: () => void;
  onToggle: () => void;
};

export default function MenuCard({ item, onEdit, onToggle }: Props) {
  return (
    <View style={styles.card}>
      {item.image ? (
        <Image
          source={{
            uri: item.image,
          }}
          style={styles.image}
        />
      ) : (
        <View style={styles.image} />
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.productName}>{item.custom_name}</Text>

        <View style={styles.priceRow}>
          <Text>{item.price}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <Text
          style={[
            styles.inStock,
            {
              backgroundColor: item.inStock ? "#F84E10" : "#ccc",
            },
          ]}
        >
          {item.inStock ? "In Stock" : "Out of Stock"}
        </Text>
        {/* <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <Ionicons name="create-outline" size={16} />
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.checkbox, item.selected && styles.checked]}
          onPress={onToggle}
        />
      </View>
    </View>
  );
}
