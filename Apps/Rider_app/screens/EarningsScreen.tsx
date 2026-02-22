// screens/EarningsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import PageHeader from "../components/PageHeader";
import ScreenWrapper from "../components/ScreenWrapper";

interface EarningsScreenProps {
  onBack: () => void;
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
// Relative heights 0-1 for the bar chart
const BAR_HEIGHTS = [0.35, 0.2, 1, 0.3, 0.4, 0.55, 0.5];
const SELECTED_DAY = 2; // Tuesday

const EarningsScreen: React.FC<EarningsScreenProps> = ({ onBack }) => {
  const [selectedDay, setSelectedDay] = useState(SELECTED_DAY);

  return (
    <ScreenWrapper scrollable>
      <PageHeader title="Earnings" onBack={onBack} />

      {/* Balance */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Balance:</Text>
        <Text style={styles.balanceAmount}>₦10,537 . 63</Text>
        <Text style={styles.paymentDate}>Payment scheduled for 19 Dec</Text>
        <TouchableOpacity style={styles.cashOutBtn} activeOpacity={0.8}>
          <Text style={styles.cashOutText}>Cash Out</Text>
        </TouchableOpacity>
      </View>

      {/* Chart card */}
      <View style={styles.chartCard}>
        <Text style={styles.dateRange}>12 Dec - 19 Dec</Text>
        <Text style={styles.chartTotal}>₦10,537.63</Text>

        {/* Bar chart */}
        <View style={styles.chartArea}>
          {/* Tooltip above selected bar */}
          <View
            style={[
              styles.tooltip,
              { left: `${(selectedDay / DAYS.length) * 100 - 6}%` as any },
            ]}
          >
            <Text style={styles.tooltipText}>₦ 10,537.63</Text>
          </View>

          <View style={styles.barsRow}>
            {BAR_HEIGHTS.map((h, i) => (
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
                        height: `${h * 100}%`,
                        backgroundColor:
                          i === selectedDay ? "#D44C0C" : "#E8A87C",
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.dayLabel,
                    i === selectedDay && styles.dayLabelActive,
                  ]}
                >
                  {DAYS[i]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.chartDivider} />

        {/* Summary stats */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryTitle}>Total Trips</Text>
            <Text style={styles.summaryValue}>137</Text>
          </View>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryTitle}>Total Time-online</Text>
            <Text style={styles.summaryValue}>6d 18h</Text>
          </View>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryTitle}>Total Distance</Text>
            <Text style={styles.summaryValue}>112 km</Text>
          </View>
        </View>
      </View>

      {/* Daily breakdown */}
      <View style={styles.breakdownSection}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Online</Text>
          <Text style={styles.breakdownValue}>3h 23m 48s</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Trips</Text>
          <Text style={styles.breakdownValue}>2</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Points</Text>
          <Text style={styles.breakdownValue}>———</Text>
        </View>
      </View>

      {/* More ways to earn */}
      <Text style={styles.moreTitle}>More ways to earn</Text>
      <View style={styles.moreRow}>
        <View style={styles.moreIcon} />
        <Text style={styles.moreLabel}>Invite someone</Text>
      </View>
    </ScreenWrapper>
  );
};

export default EarningsScreen;

const styles = StyleSheet.create({
  balanceSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 6,
  },
  balanceLabel: {
    fontSize: 15,
    color: "#555",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111",
    letterSpacing: -0.5,
  },
  paymentDate: {
    fontSize: 13,
    color: "#999",
    marginBottom: 4,
  },
  cashOutBtn: {
    backgroundColor: "#FFDA71",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 8,
  },
  cashOutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  /* Chart card */
  chartCard: {
    marginHorizontal: 16,
    backgroundColor: "#FFF8EE",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  dateRange: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
  },
  chartTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 20,
  },
  chartArea: {
    height: 140,
    position: "relative",
    marginBottom: 12,
  },
  tooltip: {
    position: "absolute",
    top: 0,
    backgroundColor: "#FFDA71",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 10,
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: "100%",
    gap: 4,
    paddingTop: 28,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
  },
  barTrack: {
    flex: 1,
    width: "60%",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  dayLabelActive: {
    color: "#111",
    fontWeight: "700",
  },
  chartDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryBlock: {
    alignItems: "center",
    gap: 2,
  },
  summaryTitle: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },

  /* Breakdown */
  breakdownSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 4,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  breakdownLabel: {
    fontSize: 15,
    color: "#111",
  },
  breakdownValue: {
    fontSize: 15,
    color: "#111",
    fontWeight: "500",
  },

  /* More */
  moreTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  moreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  moreIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  moreLabel: {
    fontSize: 15,
    color: "#111",
  },
});