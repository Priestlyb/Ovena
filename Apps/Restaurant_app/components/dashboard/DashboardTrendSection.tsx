import { TrendRevenueChart } from "@/components/TrendRevenueChart";
import { View } from "react-native";
import { InlineSkeleton } from "./InlineSkeleton";

export const DashboardTrendSection = ({
  loading,
  trendData,
  selectedPeriod,
  cardWidth,
}: any) => {
  return (
    <View style={{ marginTop: 10 }}>
      {loading ? (
        <View style={{ paddingHorizontal: 16 }}>
          <InlineSkeleton width={cardWidth} height={260} />
        </View>
      ) : (
        <TrendRevenueChart trend={trendData} selectedPeriod={selectedPeriod} />
      )}
    </View>
  );
};
