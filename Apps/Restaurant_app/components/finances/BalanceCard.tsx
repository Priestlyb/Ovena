import { Text } from "@/components/atoms/Text";
import { Wallet } from "@/types/finances";
import React from "react";
import { View } from "react-native";

type Props = {
  wallet: Wallet | null;
  loading: boolean;
};

export function BalanceCard({ wallet, loading }: Props) {
  const balance =
    wallet?.available_balance_ngn ??
    (wallet?.available_balance_kobo ? wallet.available_balance_kobo / 100 : 0);

  return (
    <View
      style={{
        backgroundColor: "#F1F1F1",
        borderRadius: 14,
        paddingVertical: 22,
        alignItems: "center",
        height: 120,
      }}
    >
      <Text>Available Balance</Text>

      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
        }}
      >
        {loading
          ? "Loading..."
          : `₦${balance.toLocaleString("en-NG", {
              minimumFractionDigits: 2,
            })}`}
      </Text>

      {!wallet?.can_withdraw && wallet && (
        <Text style={{ color: "#EF4444" }}>
          Minimum withdrawal is ₦{wallet.minimum_ngn.toLocaleString("en-NG")}
        </Text>
      )}
    </View>
  );
}
