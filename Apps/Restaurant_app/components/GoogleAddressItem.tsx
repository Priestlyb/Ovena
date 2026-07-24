import { MapPin } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { PlacePrediction } from "@/types/google";

interface GoogleAddressItemProps {
  item: PlacePrediction;
  onPress: (item: PlacePrediction) => void;
}

const GoogleAddressItem: React.FC<GoogleAddressItemProps> = ({
  item,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      onPress={() => onPress(item)}
    >
      <View style={styles.iconContainer}>
        <MapPin size={18} color="#FF6B35" />
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>
          {item.structured_formatting?.main_text ?? item.description}
        </Text>

        {!!item.structured_formatting?.secondary_text && (
          <Text numberOfLines={2} style={styles.subtitle}>
            {item.structured_formatting.secondary_text}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default GoogleAddressItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
    paddingVertical: 14,

    backgroundColor: "#FFFFFF",

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },

  iconContainer: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    marginLeft: 8,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#6B7280",
  },
});
