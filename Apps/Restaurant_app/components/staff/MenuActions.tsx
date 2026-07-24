import { styles } from "@/constants/foodTab";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  selectAll: () => void;
  handleBulkUpdate: () => void;
  isMixed: boolean;
  selectedCount: number;
  allInStock: boolean;
  allOutOfStock: boolean;
};

export default function MenuActions({
  selectAll,
  handleBulkUpdate,
  isMixed,
  selectedCount,
  allInStock,
  allOutOfStock,
}: Props) {
  return (
    <View style={styles.actions}>
      <TouchableOpacity style={styles.selectAllBtn} onPress={selectAll}>
        <Text>Select All</Text>
      </TouchableOpacity>

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={[
            styles.outOfStockBtn,
            isMixed && {
              backgroundColor: "#ccc",
            },
            allOutOfStock && {
              backgroundColor: "#F84E10",
            },
          ]}
          disabled={isMixed || selectedCount === 0}
          onPress={handleBulkUpdate}
        >
          <Text
            style={{
              color: isMixed ? "#666" : allOutOfStock ? "#fff" : "#000",
              fontWeight: "bold",
            }}
          >
            {allInStock
              ? "Mark out of stock"
              : allOutOfStock
                ? "Mark in stock"
                : "Bulk Update"}
          </Text>
        </TouchableOpacity>

        {isMixed && (
          <Text
            style={{
              fontSize: 11,
              color: "#666",
              marginTop: 2,
            }}
          >
            ⚠️ Select items with the same status
          </Text>
        )}
      </View>
    </View>
  );
}
