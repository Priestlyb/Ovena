import { ImagePlus } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

type Props = {
  value: string | null;
  onPress: () => void;
};

export const AddonImagePicker: React.FC<Props> = ({ value, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 120,
        borderRadius: 12,
        backgroundColor: "#f2f2f2",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        overflow: "hidden",
      }}
    >
      {value ? (
        <Image
          source={{ uri: value }}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <>
          <ImagePlus size={18} color="#666" />
          <Text style={{ fontSize: 10, color: "#666" }}>Add</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
