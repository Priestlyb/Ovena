import { CustomDropdown } from "@/components/CustomDropDown";
import { CustomInput } from "@/components/CustomInput";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

/* ================================
   TYPES
================================ */
type CategorySectionProps = {
  categories: string[];
  category: string;
  setCategory: (value: string) => void;
  showAddCategory: boolean;
  setShowAddCategory: (value: boolean) => void;
  newCategory: string;
  setNewCategory: (value: string) => void;
  handleAddCategory: () => void;
};

/* ================================
   COMPONENT
================================ */
export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  category,
  setCategory,
  showAddCategory,
  setShowAddCategory,
  newCategory,
  setNewCategory,
  handleAddCategory,
}) => {
  return (
    <>
      <CustomDropdown
        options={categories}
        value={category}
        onChange={setCategory}
        placeholder="Select category"
        renderOptionRight={(option, selected) => (
          <TouchableOpacity onPress={() => console.log("Delete:", option)}>
            <IconSymbol
              name="TrashOutline"
              size={20}
              color={selected ? "#FF5920" : "#999"}
            />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity onPress={() => setShowAddCategory(!showAddCategory)}>
        <Text style={{ color: "orange", marginVertical: 20 }}>
          + Add Category
        </Text>
      </TouchableOpacity>

      {showAddCategory && (
        <>
          <CustomInput
            placeholder="New category"
            value={newCategory}
            onChange={setNewCategory}
          />
          <TouchableOpacity onPress={handleAddCategory}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                padding: 20,
                backgroundColor: "#FF8C42",
                color: "#ffffff",
                fontWeight: 600,
                borderRadius: 15,
                marginTop: 20,
              }}
            >
              Add Category
            </Text>
          </TouchableOpacity>
        </>
      )}
    </>
  );
};
