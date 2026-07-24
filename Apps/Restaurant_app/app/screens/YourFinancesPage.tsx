import { useRouter } from "expo-router";
import { ArrowLeft, SlidersHorizontal } from "lucide-react-native";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";

import { Text } from "@/components/atoms/Text";
import { Header } from "@/components/molecules/Header";

import { BalanceCard } from "@/components/finances/BalanceCard";
import { EmptyTransactions } from "@/components/finances/EmptyTransactions";
import { FloatingSupportButton } from "@/components/finances/FloatingSupportButton";
import { TransactionHistory } from "@/components/finances/TransactionHistory";
import { WithdrawButton } from "@/components/finances/WithdrawButton";
import { WithdrawModal } from "@/components/finances/WithdrawModal";

import { useTransactionPin } from "@/hooks/finances/useTransactionPin";
import { useTransactions } from "@/hooks/finances/useTransactions";
import { useWallet } from "@/hooks/finances/useWallet";
import { useWithdraw } from "@/hooks/finances/useWithdraw";

import api from "@/services/apiClient";

export default function YourFinancesPage() {
  const router = useRouter();

  const { wallet, loading: walletLoading, refreshWallet } = useWallet();

  const { transactions, loading: transactionsLoading } = useTransactions();

  const { hasTransactionPin } = useTransactionPin();

  const { withdraw, withdrawing, withdrawError, setWithdrawError } =
    useWithdraw(refreshWallet);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [accountDetails, setAccountDetails] = useState<any>(null);

  const loading = walletLoading || transactionsLoading;

  const handleOpenWithdraw = async () => {
    if (!wallet?.can_withdraw) return;

    try {
      const res = await api.get("/business/payment/");

      setAccountDetails(res.data?.data);
      setShowWithdrawModal(true);
    } catch (error) {
      console.error("Failed to fetch account:", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdraw(amount, pin);

      alert("Withdrawal successful");

      setAmount("");
      setPin(["", "", "", ""]);
      setShowWithdrawModal(false);
    } catch {
      // handled inside hook
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F6EFE7",
        paddingTop: 55,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          title="Your Finances"
          leftIcon={<ArrowLeft size={22} color="#111" />}
          onLeftIconPress={() => router.back()}
          backgroundColor="#F6EFE7"
        />

        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 25,
          }}
        >
          <BalanceCard wallet={wallet} loading={loading} />
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 20,
          }}
        >
          <WithdrawButton
            canWithdraw={wallet?.can_withdraw ?? false}
            onPress={handleOpenWithdraw}
          />
        </View>

        {!loading && hasTransactionPin === false && (
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => router.push("/screens/resetPassword")}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#6B7280",
                fontSize: 14,
              }}
            >
              Create Transaction PIN {">"}
            </Text>
          </TouchableOpacity>
        )}

        <View
          style={{
            marginTop: 28,
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Transaction History
          </Text>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: 6,
            }}
          >
            <SlidersHorizontal size={18} color="#111" />

            <Text
              style={{
                fontSize: 14,
              }}
            >
              Filter
            </Text>
          </TouchableOpacity>
        </View>

        {!loading && transactions.length > 0 && (
          <TransactionHistory transactions={transactions} />
        )}

        {!loading && transactions.length === 0 && <EmptyTransactions />}
      </ScrollView>

      <WithdrawModal
        visible={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={handleWithdraw}
        amount={amount}
        setAmount={setAmount}
        pin={pin}
        setPin={setPin}
        withdrawing={withdrawing}
        withdrawError={withdrawError}
        clearError={() => setWithdrawError(null)}
        accountDetails={accountDetails}
      />

      <FloatingSupportButton />
    </SafeAreaView>
  );
}
