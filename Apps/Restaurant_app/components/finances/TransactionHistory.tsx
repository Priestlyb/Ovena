import { Transaction } from "@/types/finances";
import React from "react";
import { View } from "react-native";
import { TransactionItem } from "./TransactionItem";

type Props = {
  transactions: Transaction[];
};

export function TransactionHistory({ transactions }: Props) {
  return (
    <View>
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </View>
  );
}
