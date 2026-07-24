import { Text } from "@/components/atoms/Text";
import { Wallet } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

type WithdrawButtonProps = {
  canWithdraw: boolean;
  onPress: () => void;
};

export function WithdrawButton({ canWithdraw, onPress }: WithdrawButtonProps) {
  return (
    <TouchableOpacity
      disabled={!canWithdraw}
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: canWithdraw ? "#FF5A1F" : "#FCA5A5",
        paddingVertical: 14,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Wallet size={18} color="#fff" />

      <Text
        style={{
          color: "#fff",
          fontWeight: "600",
        }}
      >
        Withdraw
      </Text>
    </TouchableOpacity>
  );
}
