// components/TrendRevenueChart.tsx
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import React, { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

type TrendItem = {
  date: string;
  amount: number;
};

type Props = {
  trend: TrendItem[];
  selectedPeriod: string;
};

type ChartItem = {
  day: string;
  value: number;
  label: string;
};

export const TrendRevenueChart = ({ trend, selectedPeriod }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = useMemo<ChartItem[]>(() => {
    // ---------------- TODAY ----------------
    if (selectedPeriod === "today") {
      const hours = Array.from({ length: 24 }, (_, i) => ({
        day: `${i}`,
        value: 0,
        label: "₦0",
      }));

      trend.forEach((item) => {
        const date = new Date(item.date);
        const hour = date.getHours();

        hours[hour] = {
          day: `${hour}`,
          value: item.amount,
          label: `₦${Number(item.amount).toLocaleString()}`,
        };
      });

      // Show every 3rd hour to avoid crowding
      return hours.filter((_, index) => index % 3 === 0);
    }

    // ---------------- 7 DAYS ----------------
    if (selectedPeriod === "7d") {
      const labels = ["S", "M", "T", "W", "T", "F", "S"];
      const values = Array(7).fill(0);

      trend.forEach((item) => {
        const date = new Date(item.date);
        values[date.getDay()] += item.amount;
      });

      return labels.map((label, index) => ({
        day: label,
        value: values[index],
        label: `₦${values[index].toLocaleString()}`,
      }));
    }

    // ---------------- 30 DAYS ----------------
    if (selectedPeriod === "30d") {
      return trend.map((item) => {
        const date = new Date(item.date);

        return {
          day: date.getDate().toString(),
          value: item.amount,
          label: `₦${Number(item.amount).toLocaleString()}`,
        };
      });
    }

    // ---------------- 12 MONTHS ----------------
    if (selectedPeriod === "12m") {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const values = Array(12).fill(0);

      trend.forEach((item) => {
        const date = new Date(item.date);
        values[date.getMonth()] += item.amount;
      });

      return months.map((month, index) => ({
        day: month,
        value: values[index],
        label: `₦${values[index].toLocaleString()}`,
      }));
    }

    // ---------------- FALLBACK ----------------
    return trend.map((item) => ({
      day: item.date,
      value: item.amount,
      label: `₦${Number(item.amount).toLocaleString()}`,
    }));
  }, [trend, selectedPeriod]);

  const maxValue =
    chartData.length > 0 ? Math.max(...chartData.map((i) => i.value), 1) : 1;

  const barWidth = chartData.length <= 7 ? 12 : chartData.length <= 12 ? 10 : 8;

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Trend Revenue</Text>

      <Spacer size="lg" />

      <View style={{ height: 260 }}>
        {/* Y AXIS */}
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 40,
            justifyContent: "space-between",
          }}
        >
          {[1, 0.8, 0.6, 0.4, 0.2, 0].map((m, i) => (
            <Text key={i} style={{ color: "#777", fontSize: 12 }}>
              ₦ {Math.round(maxValue * m).toLocaleString()}
            </Text>
          ))}
        </View>

        {/* CHART */}
        <View
          style={{
            marginLeft: 70,
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {chartData.map((item, index) => {
            const height =
              maxValue === 0 ? 0 : Math.max((item.value / maxValue) * 180, 2);

            const isActive = activeIndex === index;

            return (
              <TouchableOpacity
                key={`${item.day}-${index}`}
                activeOpacity={0.7}
                onPress={() => setActiveIndex(isActive ? null : index)}
                style={{
                  alignItems: "center",
                  flex: 1,
                }}
              >
                {/* Tooltip */}
                {isActive && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: height + 45,
                      backgroundColor: "#FACC15",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 6,
                      minWidth: 80,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: 12,
                      }}
                    >
                      {item.label}
                    </Text>
                  </View>
                )}

                {/* Bar */}
                <View
                  style={{
                    width: barWidth,
                    height,
                    borderRadius: 6,
                    backgroundColor: isActive ? "#FF7A45" : "#FF5A1F",
                  }}
                />

                {/* Label */}
                <Text
                  numberOfLines={1}
                  style={{
                    marginTop: 10,
                    fontSize: chartData.length > 12 ? 10 : 12,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {item.day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};
