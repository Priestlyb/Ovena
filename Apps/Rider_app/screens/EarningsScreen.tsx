// screens/EarningsScreen.tsx
import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import { useTheme } from "../context/ThemeContext";
import { useAppData } from "../context/appDataContext";

interface EarningsScreenProps {
  onOpenBank?: () => void;
  onBack: () => void;
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const EarningsScreen: React.FC<EarningsScreenProps> = ({ onBack, onOpenBank }) => {
  const { colors, isDark }    = useTheme();
  const { data }              = useAppData();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const chartCardBg = isDark ? colors.cardSecondary : "#FFF8EE";

  // ── Real data from context ─────────────────────────────────────────────────

  const summary     = data?.earningsSummary?.data;
  const performance = data?.performance?.data;
  const wallet      = data?.dashboard?.data?.wallet;

  // Balance — prefer summary's available_balance, fall back to wallet
  const availableBalance = summary
    ? parseFloat(summary.available_balance)
    : wallet?.available_balance ?? 0;

  const formattedBalance = `₦${availableBalance.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
  })}`;

  const totalEarned = summary
    ? `₦${parseFloat(summary.total_earned).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
    : "—";

  // Period label
  const periodLabel = summary
    ? (() => {
        const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const s = new Date(summary.period_start);
        const e = new Date(summary.period_end);
        return `${s.getDate()} ${MONTHS[s.getMonth()]} - ${e.getDate()} ${MONTHS[e.getMonth()]}`;
      })()
    : "—";

  // Earnings trend → bar chart heights normalised 0–1
  const trend = performance?.earnings_trend ?? [];
  const trendMax  = trend.length > 0 ? Math.max(...trend.map((t) => t.total)) : 1;
  // We have up to 7 bars; if fewer entries just pad with 0
  const barCount  = Math.max(trend.length, 1);
  const barHeights: number[] = trend.map((t) => t.total / trendMax);

  // Default selected to the highest bar
  const defaultSelected = barHeights.indexOf(Math.max(...barHeights));
  const activeDayIdx = selectedDay !== null ? selectedDay : defaultSelected;

  // Label for each bar — day-of-week initial from the bucket date
  const barDayLabels: string[] = trend.map((t) => {
    const d = new Date(t.bucket);
    return DAYS[d.getDay()];
  });

  // Tooltip amount for selected bar
  const selectedAmount = trend[activeDayIdx]
    ? `₦${trend[activeDayIdx].total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
    : "—";

  // Summary stats
  const totalDeliveries = performance?.completed_deliveries ?? data?.dashboard?.data?.profile?.total_deliveries ?? 0;
  const activeHours     = performance ? `${performance.active_hours.toFixed(1)}h` : "—";
  const onlineHours     = performance ? `${performance.online_hours.toFixed(1)}h` : "—";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.separatorColor }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <IconSymbol name="ArrowBack" size={22} color={colors.iconColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Earnings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Balance */}
        <View style={styles.balanceSection}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Balance:</Text>
          <Text style={[styles.balanceAmount, { color: colors.textPrimary }]}>{formattedBalance}</Text>
          <Text style={[styles.paymentDate, { color: colors.textMuted }]}>{periodLabel}</Text>
          <TouchableOpacity
            style={[styles.cashOutBtn, { backgroundColor: colors.accentYellow }]}
            onPress={onOpenBank}
            activeOpacity={0.8}
          >
            <Text style={[styles.cashOutText, { color: "#1a1a1a" }]}>Cash Out</Text>
          </TouchableOpacity>
        </View>

        {/* Chart card */}
        {trend.length > 0 && (
          <View style={[styles.chartCard, { backgroundColor: chartCardBg }]}>
            <Text style={[styles.dateRange, { color: colors.textMuted }]}>{periodLabel}</Text>
            <Text style={[styles.chartTotal, { color: colors.textPrimary }]}>{totalEarned}</Text>

            <View style={styles.chartArea}>
              {/* Tooltip */}
              {trend.length > 0 && (
                <View
                  style={[
                    styles.tooltip,
                    {
                      backgroundColor: colors.accentYellow,
                      left: `${((activeDayIdx + 0.5) / trend.length) * 100 - 8}%` as any,
                    },
                  ]}
                >
                  <Text style={[styles.tooltipText, { color: "#1a1a1a" }]}>{selectedAmount}</Text>
                </View>
              )}

              <View style={styles.barsRow}>
                {barHeights.map((h, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.barCol}
                    onPress={() => setSelectedDay(i)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: `${Math.max(h * 100, 4)}%`,
                            backgroundColor: i === activeDayIdx
                              ? colors.accentOrange
                              : (isDark ? "#5A3020" : "#E8A87C"),
                          },
                        ]}
                      />
                    </View>
                    <Text style={[
                      styles.dayLabel,
                      { color: colors.textMuted },
                      i === activeDayIdx && { color: colors.textPrimary, fontWeight: "700" },
                    ]}>
                      {barDayLabels[i] ?? DAYS[i % 7]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.chartDivider, { backgroundColor: colors.separatorColor }]} />

            {/* Summary stats */}
            <View style={styles.summaryRow}>
              {[
                { title: "Total Trips",       value: String(totalDeliveries) },
                { title: "Active hours",       value: activeHours },
                { title: "Online hours",       value: onlineHours },
              ].map((s) => (
                <View key={s.title} style={styles.summaryBlock}>
                  <Text style={[styles.summaryTitle, { color: colors.textMuted }]}>{s.title}</Text>
                  <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{s.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Daily breakdown */}
        <View style={styles.breakdownSection}>
          {[
            { label: "Total earned",    value: totalEarned },
            { label: "Total withdrawn", value: summary ? `₦${parseFloat(summary.total_withdrawn).toLocaleString("en-NG", { minimumFractionDigits: 2 })}` : "—" },
            { label: "Pending",         value: summary ? `₦${parseFloat(summary.pending_balance).toLocaleString("en-NG", { minimumFractionDigits: 2 })}` : "—" },
          ].map((row) => (
            <View key={row.label} style={[styles.breakdownRow, { borderBottomColor: colors.separatorColor }]}>
              <Text style={[styles.breakdownLabel, { color: colors.textPrimary }]}>{row.label}</Text>
              <Text style={[styles.breakdownValue, { color: colors.textPrimary }]}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* More ways to earn */}
        <Text style={[styles.moreTitle, { color: colors.textPrimary }]}>More ways to earn</Text>
        <View style={styles.moreRow}>
          <View style={[styles.moreIcon, { backgroundColor: colors.inputBg }]} />
          <Text style={[styles.moreLabel, { color: colors.textPrimary }]}>Invite someone</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default EarningsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn:        { width: 36 },
  headerTitle:    { fontSize: 18, fontWeight: "700" },
  balanceSection: { alignItems: "center", paddingVertical: 24, paddingHorizontal: 20, gap: 6 },
  balanceLabel:   { fontSize: 15 },
  balanceAmount:  { fontSize: 32, fontWeight: "700", letterSpacing: -0.5 },
  paymentDate:    { fontSize: 13, marginBottom: 4 },
  cashOutBtn:     { borderRadius: 50, paddingVertical: 12, paddingHorizontal: 40, marginTop: 8 },
  cashOutText:    { fontSize: 16, fontWeight: "700" },
  chartCard:      { marginHorizontal: 16, borderRadius: 20, padding: 20, marginBottom: 20 },
  dateRange:      { fontSize: 13, marginBottom: 4 },
  chartTotal:     { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  chartArea:      { height: 140, position: "relative", marginBottom: 12 },
  tooltip: {
    position: "absolute", top: 0,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, zIndex: 10,
  },
  tooltipText:    { fontSize: 12, fontWeight: "600" },
  barsRow:        { flexDirection: "row", alignItems: "flex-end", height: "100%", gap: 4, paddingTop: 28 },
  barCol:         { flex: 1, alignItems: "center", height: "100%" },
  barTrack:       { flex: 1, width: "60%", justifyContent: "flex-end" },
  bar:            { width: "100%", borderRadius: 4 },
  dayLabel:       { fontSize: 12, marginTop: 6 },
  chartDivider:   { height: 1, marginVertical: 14 },
  summaryRow:     { flexDirection: "row", justifyContent: "space-between" },
  summaryBlock:   { alignItems: "center", gap: 2 },
  summaryTitle:   { fontSize: 11, textAlign: "center" },
  summaryValue:   { fontSize: 14, fontWeight: "600" },
  breakdownSection: { paddingHorizontal: 16, marginBottom: 24, gap: 4 },
  breakdownRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 12, borderBottomWidth: 1,
  },
  breakdownLabel: { fontSize: 15 },
  breakdownValue: { fontSize: 15, fontWeight: "500" },
  moreTitle:      { fontSize: 17, fontWeight: "700", paddingHorizontal: 16, marginBottom: 12 },
  moreRow:        { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, marginBottom: 32 },
  moreIcon:       { width: 40, height: 40, borderRadius: 20 },
  moreLabel:      { fontSize: 15 },
});