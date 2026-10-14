// screens/OvenaBankScreen.tsx
import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, Modal, TextInput,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { useAppData } from "../context/appDataContext";
import { IconSymbol } from "../components/ui/icon-symbol";
import PayoutList, { historyEntryToPayout, Payout } from "../components/PayoutList";
import ScreenWrapper from "../components/ScreenWrapper";
import { submitWithdrawal } from "../services/appDataApi";
import {
 getOrCreateWithdrawalIdempotencyKey,
  clearWithdrawalIdempotencyKey,
} from "../utils/idempotencyKey";

interface OvenaBankScreenProps {
  onBack: () => void;
}

// ── Withdraw Modal ────────────────────────────────────────────────────────────

interface WithdrawModalProps {
  visible:  boolean;
  onClose:  () => void;
  balance:  number;
  minAmount: number;
  eligible: boolean;
  onSuccess?: () => void; // let the parent screen refresh balance/history
}

function WithdrawModal({ visible, onClose, balance, minAmount, eligible, onSuccess }: WithdrawModalProps) {
  const { colors } = useTheme();
  const [amount, setAmount]   = useState("");
  const [loading, setLoading] = useState(false);
  // Hard synchronous guard against double-tap — `loading` state alone isn't
  // enough because a very fast second press can fire before the re-render
  // that disables the button has actually happened.
  const submittingRef = React.useRef(false);

  const formatted     = `₦${balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
  const numericAmount = parseFloat(amount.replace(/,/g, ""));

  const handleWithdraw = async () => {
    if (submittingRef.current) return;

    if (!eligible) {
      Alert.alert("Not Eligible", "Your account is not currently eligible for withdrawal.");
      return;
    }
    if (!amount.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid withdrawal amount.");
      return;
    }
    if (numericAmount < minAmount) {
      Alert.alert("Below Minimum", `Minimum withdrawal is ₦${minAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}.`);
      return;
    }
    if (numericAmount > balance) {
      Alert.alert("Insufficient Funds", `Your available balance is ${formatted}.`);
      return;
    }

    submittingRef.current = true;
    setLoading(true);
   try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Session Expired", "Please sign in again to continue.");
        return;
      }

      // Reuses the same key on a retry of this exact amount; only
      // rotates to a new key once the amount changes or the previous
 // attempt succeeded.
      const idempotencyKey = await getOrCreateWithdrawalIdempotencyKey(numericAmount);

      const response = await submitWithdrawal(numericAmount, idempotencyKey, token);

      // Success is the ONLY point the key gets cleared — this guarantees
      // a failed or ambiguous (e.g. network drop mid-request) attempt
      // still has its key available for a safe retry.
      await clearWithdrawalIdempotencyKey();

      setAmount("");
      onClose();
      onSuccess?.();

      const confirmedAmount = response?.data?.amount ?? numericAmount;
      Alert.alert(
        "Withdrawal Requested",
        `₦${Number(confirmedAmount).toLocaleString("en-NG", { minimumFractionDigits: 2 })} will be processed shortly.`
      );
    } catch (err: any) {
      console.warn("[Withdraw] Failed:", err);
     // Modal stays open, key stays persisted — user can tap Confirm
     // again and the retry will carry the same idempotency key.
     Alert.alert("Withdrawal Failed", err?.message || "Please try again.");
    } finally {
      setLoading(false);
     submittingRef.current = false;
   }
  };

  // Quick-fill amounts based on balance
  const quickAmounts = [1000, 5000, 10000, 50000].filter((q) => q <= balance);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalBackdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

        <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
          <View style={[styles.sheetHandle, { backgroundColor: colors.separatorColor }]} />

          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Withdraw</Text>
          <Text style={[styles.modalBalance, { color: colors.textMuted }]}>
            Available: {formatted}
          </Text>

          {/* Eligibility notice */}
          {!eligible && (
            <View style={[styles.ineligibleBanner, { backgroundColor: colors.inputBg }]}>
              <Text style={[styles.ineligibleText, { color: colors.accentRed }]}>
                Your account is not currently eligible for withdrawal.
              </Text>
            </View>
          )}

          <View style={[styles.amountInputWrap, { backgroundColor: colors.inputBg, borderColor: colors.separatorColor }]}>
            <Text style={[styles.nairaSign, { color: colors.textPrimary }]}>₦</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.textPrimary }]}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              autoFocus
              editable={eligible}
            />
          </View>

          {quickAmounts.length > 0 && (
            <View style={styles.quickRow}>
              {quickAmounts.map((q) => (
                <TouchableOpacity
                  key={q}
                  style={[styles.quickPill, { backgroundColor: colors.inputBg, borderColor: colors.separatorColor }]}
                  onPress={() => setAmount(q.toString())}
                  activeOpacity={0.7}
                  disabled={!eligible}
                >
                  <Text style={[styles.quickPillText, { color: colors.textSecondary }]}>
                    ₦{q.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.confirmBtn,
              { backgroundColor: eligible ? colors.accentDark : colors.separatorColor },
              loading && { opacity: 0.6 },
            ]}
            onPress={handleWithdraw}
            disabled={loading || !eligible}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={colors.card} />
              : <Text style={[styles.confirmBtnText, { color: eligible ? colors.card : colors.textMuted }]}>
                  Confirm Withdrawal
                </Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

const OvenaBankScreen: React.FC<OvenaBankScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { data, loading, refresh } = useAppData();
  const [withdrawVisible, setWithdrawVisible] = useState(false);

  // ── Derived values from context ────────────────────────────────────────────

  // Available balance — prefer summary, fall back to dashboard wallet
  const summaryData     = data?.earningsSummary?.data;
  const walletData      = data?.dashboard?.data?.wallet;
  const eligibilityData = data?.withdrawalEligibility?.data;

  const balance   = summaryData
    ? parseFloat(summaryData.available_balance)
    : walletData?.available_balance ?? 0;

  const minAmount = eligibilityData
    ? parseFloat(eligibilityData.minimum_amount)
    : 1000;

  const eligible  = eligibilityData?.eligible ?? false;

  const formattedBalance = `₦${balance.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // ── Payout list from earnings history ─────────────────────────────────────

  const historyEntries = data?.earningsHistory?.results?.data ?? [];
  const payouts: Payout[] = historyEntries.map(historyEntryToPayout);

  // ── Period label for display ───────────────────────────────────────────────

  const periodLabel = summaryData
    ? (() => {
        const start = new Date(summaryData.period_start);
        const end   = new Date(summaryData.period_end);
        const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return `${start.getDate()} ${MONTHS[start.getMonth()]} - ${end.getDate()} ${MONTHS[end.getMonth()]}`;
      })()
    : "—";

  const totalEarned = summaryData
    ? `₦${parseFloat(summaryData.total_earned).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
    : "—";

  return (
    
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.accentYellow }]}>
      <ScreenWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={colors.accentYellow} />

      {/* ── Yellow hero header ── */}
      <View style={[styles.hero, { backgroundColor: colors.accentYellow }]}>
        <View style={styles.heroNav}>
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <IconSymbol name="ArrowBack" size={22} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.heroTitle}>Ovena Bank</Text>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <IconSymbol name="SettingsIcon" size={22} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        {loading && !data ? (
          <ActivityIndicator color="#1a1a1a" style={{ marginVertical: 32 }} />
        ) : (
          <>
            <Text style={styles.balanceAmount}>{formattedBalance}</Text>
            <Text style={styles.paymentNote}>{periodLabel}</Text>
            {eligible && minAmount > 0 && (
              <Text style={styles.feeNote}>
                Min withdrawal ₦{minAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </Text>
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.withdrawBtn}
          onPress={() => setWithdrawVisible(true)}
          activeOpacity={0.85}
        >
          <IconSymbol name="BankIcon" size={20} color="#fff" />
          <Text style={styles.withdrawBtnText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      {/* ── Payout list ── */}
      <View style={[styles.listContainer, { backgroundColor: colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading && !data ? (
            <ActivityIndicator
              color={colors.accentOrange}
              size="large"
              style={{ marginTop: 48 }}
            />
          ) : (
            <PayoutList payouts={payouts} />
          )}
        </ScrollView>
      </View>

      {/* ── Withdraw modal ── */}
      <WithdrawModal
        visible={withdrawVisible}
        onClose={() => setWithdrawVisible(false)}
        balance={balance}
        minAmount={minAmount}
        eligible={eligible}
        onSuccess={refresh}
      />
       </ScreenWrapper>
    </SafeAreaView>
   
  );
};

export default OvenaBankScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  hero: { paddingHorizontal: 20, paddingBottom: 28 },
  heroNav: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", paddingVertical: 14,
  },
  heroTitle:      { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  balanceAmount:  { fontSize: 36, fontWeight: "800", color: "#1a1a1a", letterSpacing: -0.5, marginTop: 8, marginBottom: 6 },
  paymentNote:    { fontSize: 14, color: "#3a3a3a", marginBottom: 2 },
  feeNote:        { fontSize: 13, color: "#5a5a5a", marginBottom: 24 },
  withdrawBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, backgroundColor: "#1a1a1a", borderRadius: 50,
    paddingVertical: 18, paddingHorizontal: 32, alignSelf: "stretch", marginTop: 20,
  },
  withdrawBtnText: { color: "#fff", fontSize: 18, fontWeight: "700", letterSpacing: 0.2 },
  listContainer:   { flex: 1 },

  // Modal
  modalBackdrop:   { flex: 1, justifyContent: "flex-end" },
  modalSheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 48 : 32,
    paddingTop: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12, shadowRadius: 20, elevation: 24,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 20 },
  modalTitle:  { fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 4 },
  modalBalance:{ fontSize: 14, textAlign: "center", marginBottom: 24 },
  ineligibleBanner: { borderRadius: 12, padding: 12, marginBottom: 16 },
  ineligibleText:   { fontSize: 14, textAlign: "center", fontWeight: "600" },
  amountInputWrap: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderRadius: 16,
    paddingHorizontal: 16, height: 64, marginBottom: 16,
  },
  nairaSign:   { fontSize: 24, fontWeight: "700", marginRight: 6 },
  amountInput: { flex: 1, fontSize: 28, fontWeight: "700" },
  quickRow:    { flexDirection: "row", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  quickPill:   { borderWidth: 1, borderRadius: 50, paddingVertical: 8, paddingHorizontal: 16 },
  quickPillText: { fontSize: 13, fontWeight: "600" },
  confirmBtn:  { borderRadius: 50, paddingVertical: 18, alignItems: "center" },
  confirmBtnText: { fontSize: 17, fontWeight: "700" },
});