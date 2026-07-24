import { useRouter } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export function FloatingSupportButton() {
  const router = useRouter();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 65,
        right: 30,
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "#FF5A1F",
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: "center",
          alignItems: "center",
          elevation: 6,
        }}
        onPress={() => router.push("/screens/SupportPage")}
      >
        <MessageCircle size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
