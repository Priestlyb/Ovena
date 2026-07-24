import { styles } from "@/constants/foodTab";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  onSearchPress: () => void;
};

export default function FoodHeader({ onSearchPress }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Products Management</Text>

      <TouchableOpacity onPress={onSearchPress}>
        <Ionicons name="search-outline" size={22} />
      </TouchableOpacity>
    </View>
  );
}
