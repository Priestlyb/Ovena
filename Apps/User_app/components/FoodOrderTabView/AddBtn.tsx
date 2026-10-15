import React from "react";

import { TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { styles } from "@/constants/styles/FoodOrderTabView.styles";

type AddBtnProps = {
  onPress?: () => void;
  disabled?: boolean;
};

export const AddBtn = ({ onPress, disabled = false }: AddBtnProps) => {
  return (
    <TouchableOpacity
      style={styles.addBtn}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Ionicons name="add" size={18} color="#fff" />
    </TouchableOpacity>
  );
};
