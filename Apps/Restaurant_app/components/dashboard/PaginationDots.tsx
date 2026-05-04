import React from "react";
import { TouchableOpacity, View } from "react-native";

export const PaginationDots = ({
  count,
  activeIndex,
  onPress,
  styles,
}: any) => {
  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <TouchableOpacity key={index} onPress={() => onPress(index)}>
          <View
            style={[
              styles.paginationDot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};
