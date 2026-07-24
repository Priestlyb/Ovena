import { Text } from "@/components/atoms/Text";
import React from "react";
import { Image, View } from "react-native";

export function EmptyTransactions() {
  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 60,
        paddingHorizontal: 20,
      }}
    >
      <Image
        source={require("@/assets/images/wallet.png")}
        style={{
          width: 160,
          height: 160,
        }}
        resizeMode="contain"
      />

      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          marginTop: 12,
        }}
      >
        No transactions yet
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#6B7280",
          marginTop: 6,
          textAlign: "center",
        }}
      >
        Your transactions will appear here
      </Text>
    </View>
  );
}
