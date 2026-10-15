import React from "react";

import { TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { styles } from "@/constants/styles/FoodOrderTabView.styles";

export const AddonsAddBtn = () => {
  return (
    <TouchableOpacity style={styles.addonsAddBtn}>
      <Ionicons
        name="add"
        size={20}
        color="#fff"
      />
    </TouchableOpacity>
  );
};