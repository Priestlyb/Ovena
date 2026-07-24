// components/profile/ProfileHeader.tsx

import { Edit } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface Props {
  image?: string;
  onEdit: () => void;
}

export const ProfileHeader = ({ image, onEdit }: Props) => {
  return (
    <View>
      <Image
        source={{ uri: image }}
        resizeMode="cover"
        style={{
          width: "100%",
          height: 250,
          backgroundColor: "#E2E2E2",
        }}
      />

      <TouchableOpacity
        onPress={onEdit}
        style={{
          backgroundColor: "#F3F4F6",
          position: "absolute",
          right: 20,
          bottom: 20,
          padding: 10,
          borderRadius: 20,
        }}
      >
        <Edit size={22} color="#F84E10" />
      </TouchableOpacity>
    </View>
  );
};
