// components/TrendRevenueChart.tsx
import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/atoms/Text";
import { Spacer } from "@/components/atoms/Spacer";

type TrendItem = {
  date: string;
  amount: number;
};

type Props = {
  trend: TrendItem[];
};

export const TrendRevenueChart = ({ trend }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // ================= PREP DATA =================
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const weekData = Array(7).fill(0);

  trend.forEach((item) => {
    const date = new Date(item.date);
    const dayIndex = date.getDay();
    weekData[dayIndex] = item.amount;
  });

  const chartData = days.map((day, index) => ({
    day,
    value: weekData[index],
    label: `₦${Number(weekData[index]).toLocaleString()}`,
  }));

  const maxValue =
    chartData.length > 0
      ? Math.max(...chartData.map((i) => i.value), 1)
      : 1;

  // ================= UI =================
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>
        Trend Revenue
      </Text>

      <Spacer size="lg" />

      <View style={{ height: 260, width: "95%" }}>
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
            <Text key={i} style={{ color: "#777" }}>
              ₦ {Math.round(maxValue * m).toLocaleString()}
            </Text>
          ))}
        </View>

        {/* BARS */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginLeft: 70,
            height: "100%",
          }}
        >
          {chartData.map((item, i) => {
            const height = (item.value / maxValue) * 180;
            const isActive = activeIndex === i;

            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() =>
                  setActiveIndex(isActive ? null : i)
                }
                style={{ alignItems: "center" }}
              >
                {/* Tooltip */}
                {isActive && (
                  <View
                    style={{
                      width: 80,
                      position: "absolute",
                      bottom: height + 45,
                      backgroundColor: "#FACC15",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ fontWeight: "600", textAlign: "center" }}>
                      {item.label}
                    </Text>
                  </View>
                )}

                {/* Bar */}
                <View
                  style={{
                    width: 12,
                    height,
                    borderRadius: 6,
                    backgroundColor: isActive
                      ? "#FF7A45"
                      : "#FF5A1F",
                  }}
                />

                {/* Day */}
                <Text
                  style={{
                    marginTop: 10,
                    fontWeight: "600",
                    width: 20,
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