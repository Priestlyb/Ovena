import { styles } from "@/constants/foodTab";
import React from "react";
import { TextInput } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({ value, onChangeText }: Props) {
  return (
    <TextInput
      placeholder="Search products..."
      value={value}
      onChangeText={onChangeText}
      style={styles.searchInput}
    />
  );
}
