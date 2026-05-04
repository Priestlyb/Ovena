import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Wallet,
  SlidersHorizontal,
  MessageCircle,
} from "lucide-react-native";
import { Modal, TextInput, ActivityIndicator } from "react-native";
import { Text } from "@/components/atoms/Text";
import { Header } from "@/components/molecules/Header";
import api from "@/services/apiClient";
import uuid from "react-native-uuid";

// ✅ Wallet Type
type Wallet = {
  available_balance_kobo: number;
  available_balance_ngn: number;
  can_withdraw: boolean;
  minimum_ngn: number;
  minimum_withdrawal_kobo: number;
  needed_to_withdraw_kobo: number;
  pending_withdrawal_kobo: number;
  total_balance_kobo: number;
  total_balance_ngn: number;
};

type Transaction = {
  id: string;
  amount: number;
  type: "credit" | "debit";
  status: string;
  created_at: string;
  description?: string;
  reference?: string;
};

export default function YourFinancesPage() {
  const router = useRouter();
  
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasTransactionPin, setHasTransactionPin] = useState<boolean | null>(
    null,
  );

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [accountDetails, setAccountDetails] = useState<any>(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (showWithdrawModal) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [showWithdrawModal]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const walletRes = await api.get<Wallet>("/business/wallet/balance/");
        setWallet(walletRes.data);

        // ✅ Transactions
        const txRes = await api.get("/business/wallet/transactions/");
        const rawTransactions = txRes.data?.results?.data || [];

        const formattedTransactions: Transaction[] = rawTransactions.map(
          (tx: any) => ({
            id: `tx-${tx.id}`,
            amount: tx.amount_kobo,
            type: tx.transaction_type,
            status: tx.status,
            reference: tx.reference,
            created_at: tx.created_at,
            description: tx.description,
          }),
        );

        // ✅ Withdrawals
        const wdRes = await api.get("/business/wallet/withdrawals/");
        const rawWithdrawals = wdRes.data?.results || [];

        const formattedWithdrawals: Transaction[] = rawWithdrawals.map(
          (wd: any) => ({
            id: `wd-${wd.id}`, // prevent ID clash
            amount: wd.amount_kobo,
            type: "debit",
            status: wd.status,
            reference: wd.reference,
            created_at: wd.created_at,
            description: "Withdrawal",
          }),
        );

        // ✅ Merge + Sort
        const merged = [...formattedTransactions, ...formattedWithdrawals];

        merged.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setTransactions(merged);

        // ✅ Transaction PIN
        const pinRes = await api.get("/business/wallet/transaction-pin/");
        setHasTransactionPin(pinRes.data?.data?.has_transaction_pin ?? false);
      } catch (error: any) {
        console.error("API error:", error?.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWithdraw = async () => {
    const fullPin = pin.join("");

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    if (fullPin.length !== 4) {
      alert("Enter your 4-digit PIN");
      return;
    }

    try {
      setWithdrawing(true);

      const idempotencyKey = uuid.v4();

      await api.post(
        "/business/wallet/withdraw/",
        {
          amount_kobo: Number(amount) * 100,
          transaction_pin: fullPin,
        },
        {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        },
      );

      alert("Withdrawal successful");

      setShowWithdrawModal(false);
      setAmount("");
      setPin(["", "", "", ""]);

      const walletRes = await api.get("/business/wallet/balance/");
      setWallet(walletRes.data);
    } catch (error: any) {
      const errMsg = error?.response?.data?.error || "Withdrawal failed";

      console.error("Withdraw error:", errMsg);
      if (errMsg.toLowerCase().includes("transaction_pin")) {
        setWithdrawError("Incorrect PIN. Please try again.");
      } else {
        setWithdrawError(errMsg);
      }
    } finally {
      setWithdrawing(false);
    }
  };

  const balance =
    wallet?.available_balance_ngn ??
    (wallet?.available_balance_kobo ? wallet.available_balance_kobo / 100 : 0);

  const canWithdraw = wallet?.can_withdraw ?? false;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F6EFE7", paddingTop: 55 }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          title="Your Finances"
          leftIcon={<ArrowLeft size={22} color="#111" />}
          onLeftIconPress={() => router.back()}
          backgroundColor="#F6EFE7"
        />

        {/* Balance */}
        <View style={{ paddingHorizontal: 20, marginTop: 25 }}>
          <View
            style={{
              backgroundColor: "#F1F1F1",
              borderRadius: 14,
              paddingVertical: 22,
              paddingHorizontal: 16,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
              alignItems: "center",
              height: 120,
            }}
          >
            <Text style={{ color: "#6B7280", fontSize: 14 }}>
              Available Balance
            </Text>

            <Text
              style={{
                fontSize: 26,
                fontWeight: "700",
                marginTop: 6,
                color: "#111",
              }}
            >
              {loading
                ? "Loading..."
                : `₦${balance.toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}`}
            </Text>

            {!loading && wallet && !canWithdraw && (
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "#EF4444",
                }}
              >
                Minimum withdrawal is ₦
                {wallet.minimum_ngn.toLocaleString("en-NG")}
              </Text>
            )}
          </View>
        </View>

        {/* Withdraw Button */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            paddingHorizontal: 20,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            disabled={!canWithdraw}
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
            onPress={async () => {
              if (!canWithdraw) return;

              try {
                const res = await api.get("/business/payment/");
                setAccountDetails(res.data?.data);
                setShowWithdrawModal(true);
                console.log("Payment details:", res.data);
              } catch (err) {
                console.error("Failed to fetch account:", err);
              }
            }}
          >
            <Wallet size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "600" }}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* PIN */}
        {!loading && hasTransactionPin === false && (
          <TouchableOpacity
            onPress={() => router.push("/screens/resetPassword")}
            style={{ marginTop: 20 }}
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

        {/* Header */}
        <View
          style={{
            marginTop: 28,
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Transaction History
          </Text>

          <TouchableOpacity style={{ flexDirection: "row", gap: 6 }}>
            <SlidersHorizontal size={18} color="#111" />
            <Text style={{ fontSize: 14 }}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        {!loading && transactions.length > 0 && (
          <View style={{ marginTop: 10 }}>
            {transactions.map((tx) => {
              const isCredit = tx.type === "credit";

              return (
                <View
                  key={tx.id}
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
                      {tx.description || (isCredit ? "Credit" : "Debit")}
                    </Text>

                    {tx.reference && (
                      <Text style={{ fontSize: 12, color: "#6B7280" }}>
                        Ref: {tx.reference}
                      </Text>
                    )}

                    <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontWeight: "600",
                      color: isCredit ? "#16A34A" : "#DC2626",
                    }}
                  >
                    {isCredit ? "+" : "-"}₦
                    {(tx.amount / 100).toLocaleString("en-NG")}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Empty */}
        {!loading && transactions.length === 0 && (
          <View
            style={{
              alignItems: "center",
              marginTop: 60,
              paddingHorizontal: 20,
            }}
          >
            <Image
              source={require("@/assets/images/wallet 1.png")}
              style={{ width: 160, height: 160 }}
              resizeMode="contain"
            />

            <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 12 }}>
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
        )}
      </ScrollView>

      {/* Modal */}

      <Modal visible={showWithdrawModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 14,
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              Withdraw Funds
            </Text>

            {/* Account Info */}
            {accountDetails && (
              <Text style={{ marginTop: 8, color: "#6B7280" }}>
                {accountDetails.bank_name} • {accountDetails.account_number}
              </Text>
            )}

            {/* Amount */}
            <TextInput
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 8,
                padding: 12,
                marginTop: 16,
              }}
            />

            {/* PIN Boxes */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              {pin.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  value={digit}
                  onChangeText={(val) => {
                    const newPin = [...pin];
                    const cleaned = val.slice(-1);

                    newPin[index] = cleaned;
                    setPin(newPin);

                    if (withdrawError) setWithdrawError(null);

                    // ✅ Move forward
                    if (cleaned && index < pin.length - 1) {
                      inputRefs.current[index + 1]?.focus();
                    }
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    // ✅ Move backward on delete
                    if (
                      nativeEvent.key === "Backspace" &&
                      !pin[index] &&
                      index > 0
                    ) {
                      inputRefs.current[index - 1]?.focus();
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  style={{
                    width: 50,
                    height: 50,
                    borderWidth: 1,
                    borderColor: withdrawError ? "#DC2626" : "#E5E7EB",
                    borderRadius: 8,
                    textAlign: "center",
                    fontSize: 18,
                  }}
                />
              ))}
            </View>
            {withdrawError && (
              <Text
                style={{
                  marginTop: 20,
                  color: "#DC2626",
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: "500",
                }}
              >
                {withdrawError}
              </Text>
            )}

            {/* Actions */}
            <View style={{ flexDirection: "row", marginTop: 24, gap: 10 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 10,
                  backgroundColor: "#E5E7EB",
                  alignItems: "center",
                }}
                onPress={() => setShowWithdrawModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 10,
                  backgroundColor: "#FF5A1F",
                  alignItems: "center",
                }}
                onPress={handleWithdraw}
              >
                {withdrawing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Confirm
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Chat */}
      <View style={{ position: "absolute", bottom: 65, right: 30 }}>
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
    </SafeAreaView>
  );
}
