// components/ReviewsCard.tsx
import React from "react";
import { View } from "react-native";
import { Text } from "@/components/atoms/Text";
import { Spacer } from "@/components/atoms/Spacer";

type Props = {
  rating?: number;
  count?: number;
};

export const ReviewsCard = ({ rating, count }: Props) => {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Reviews</Text>

      <Spacer size="md" />

      <View
        style={{
          flexDirection: "row",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <View style={{ flex: 1, backgroundColor: "#E5E5E5", padding: 16 }}>
          <Text>Your Rating</Text>
        </View>

        <View style={{ flex: 2, backgroundColor: "#FF5A1F", padding: 16 }}>
          <Text style={{ color: "#fff", fontSize: 20 }}>
            ★★★★★ {rating ?? "0.0"}
          </Text>
          <Text style={{ color: "#fff" }}>
            {count ? `${count} reviews` : "No ratings yet"}
          </Text>
        </View>
      </View>
    </View>
  );
};