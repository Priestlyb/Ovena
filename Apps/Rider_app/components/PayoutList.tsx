// components/PayoutList.tsx
// Renders a grouped, day-separated list of payout transactions.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { IconSymbol } from "./ui/icon-symbol";
import { EarningsHistoryEntry } from "../services/appDataApi";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Payout {
  id: string;
  label: string;   // e.g. "Payout from Ovena"
  time: string;    // e.g. "4:15 pm"
  amount: number;  // positive Naira value
  date: string;    // "YYYY-MM-DD" — used for grouping
}

interface PayoutGroup {
  dayLabel: string;
  dayTotal: number;
  payouts: Payout[];
}

// ── Converter: API entry → Payout ─────────────────────────────────────────────
// Call this in the screen to transform raw API data before passing to PayoutList.

export function historyEntryToPayout(entry: EarningsHistoryEntry): Payout {
  const d = new Date(entry.created_at);

  const hours   = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm    = hours >= 12 ? "pm" : "am";
  const h12     = hours % 12 || 12;
  const time    = `${h12}:${minutes} ${ampm}`;

  // Date as "YYYY-MM-DD" in local time — ensures grouping matches the user's timezone
  const year  = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day   = String(d.getDate()).padStart(2, "0");
  const date  = `${year}-${month}-${day}`;

  return {
    id:     String(entry.id),
    label:  entry.entry_type === "credit" ? "Payout from Ovena" : "Deduction",
    time,
    amount: parseFloat(entry.amount),
    date,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatAmount(n: number): string {
  return `+₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const DAY_NAMES    = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES  = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function groupPayouts(payouts: Payout[]): PayoutGroup[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const map = new Map<string, PayoutGroup>();

  for (const payout of payouts) {
    // Parse the "YYYY-MM-DD" key as local midnight to avoid timezone shifting
    const [y, mo, dy] = payout.date.split("-").map(Number);
    const d = new Date(y, mo - 1, dy);
    d.setHours(0, 0, 0, 0);

    const diffDays = Math.round((today.getTime() - d.getTime()) / 86_400_000);

    let dayLabel: string;
    if      (diffDays === 0) dayLabel = "Today";
    else if (diffDays === 1) dayLabel = "Yesterday";
    else if (diffDays <  7)  dayLabel = DAY_NAMES[d.getDay()];
    else                     dayLabel = `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;

    if (!map.has(payout.date)) {
      map.set(payout.date, { dayLabel, dayTotal: 0, payouts: [] });
    }
    const group = map.get(payout.date)!;
    group.payouts.push(payout);
    group.dayTotal += payout.amount;
  }

  // Most-recent day first
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, g]) => g);
}

// ── Component ─────────────────────────────────────────────────────────────────

interface PayoutListProps {
  payouts: Payout[];
}

const PayoutList: React.FC<PayoutListProps> = ({ payouts }) => {
  const { colors } = useTheme();
  const groups = groupPayouts(payouts);

  if (groups.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>No transactions yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {groups.map((group, gi) => (
        <View key={gi} style={styles.group}>
          {/* ── Day header ── */}
          <View style={styles.dayHeader}>
            <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
              {group.dayLabel}
            </Text>
            <Text style={[styles.dayTotal, { color: colors.textSecondary }]}>
              {formatAmount(group.dayTotal)}
            </Text>
          </View>

          {/* ── Payout rows ── */}
          {group.payouts.map((payout, pi) => (
            <View
              key={payout.id}
              style={[
                styles.payoutRow,
                {
                  borderBottomColor: colors.separatorColor,
                  borderBottomWidth: pi < group.payouts.length - 1
                    ? StyleSheet.hairlineWidth
                    : 0,
                },
              ]}
            >
              <View style={[styles.iconWrap, { backgroundColor: colors.inputBg }]}>
                <IconSymbol name="Bicycle" size={22} color={colors.iconColor} />
              </View>
              <View style={styles.payoutInfo}>
                <Text style={[styles.payoutLabel, { color: colors.textPrimary }]}>
                  {payout.label}
                </Text>
                <Text style={[styles.payoutTime, { color: colors.textMuted }]}>
                  {payout.time}
                </Text>
              </View>
              <Text style={[styles.payoutAmount, { color: colors.accentGreen }]}>
                {formatAmount(payout.amount)}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default PayoutList;

const styles = StyleSheet.create({
  container:   { paddingBottom: 32 },
  empty:       { paddingVertical: 48, alignItems: "center" },
  emptyText:   { fontSize: 15 },
  group:       { marginBottom: 8 },
  dayHeader:   {
    flexDirection: "row", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 12,
  },
  dayLabel:    { fontSize: 15, fontWeight: "500" },
  dayTotal:    { fontSize: 15, fontWeight: "500" },
  payoutRow:   {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 14, gap: 14,
  },
  iconWrap:    { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  payoutInfo:  { flex: 1 },
  payoutLabel: { fontSize: 15, fontWeight: "600", marginBottom: 3 },
  payoutTime:  { fontSize: 13 },
  payoutAmount:{ fontSize: 15, fontWeight: "700" },
});