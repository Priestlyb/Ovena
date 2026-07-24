import { Text } from "@/components/atoms/Text";
import { Transaction } from "@/types/finances";
import React from "react";
import { View } from "react-native";

type Props = {
  transaction: Transaction;
};

export function TransactionItem({ transaction }: Props) {
  const isCredit = transaction.type === "credit";

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: "#E5E7EB",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "600" }}>
          {transaction.description || (isCredit ? "Credit" : "Debit")}
        </Text>

        {transaction.reference && <Text>Ref: {transaction.reference}</Text>}

        <Text>{new Date(transaction.created_at).toLocaleDateString()}</Text>
      </View>

      <Text
        style={{
          color: isCredit ? "#16A34A" : "#DC2626",
        }}
      >
        {isCredit ? "+" : "-"}₦
        {(transaction.amount / 100).toLocaleString("en-NG")}
      </Text>
    </View>
  );
}
