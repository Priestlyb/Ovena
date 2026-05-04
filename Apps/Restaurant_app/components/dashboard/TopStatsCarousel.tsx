import { StatsCard } from "@/components/StatsCard";
import { Eye } from "lucide-react-native";
import React from "react";
import {
    ScrollView,
    TouchableOpacity,
    View
} from "react-native";

export const TopStatsCarousel = ({
  refScroll,
  onScroll,
  CARD_WIDTH,
  showSales,
  setShowSales,
  loading,
  data,
  InlineSkeleton,
  styles,
}: any) => {
  return (
    <ScrollView
      ref={refScroll}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      snapToInterval={CARD_WIDTH}
      decelerationRate="fast"
      contentContainerStyle={styles.statsScrollContainer}
    >
      <View style={{ width: CARD_WIDTH }}>
        <StatsCard
          title="TODAY'S SALES"
          value={
            showSales ? (
              loading ? (
                <InlineSkeleton width={120} height={24} />
              ) : (
                `₦${data?.today_sales?.toLocaleString()}`
              )
            ) : (
              "₦••,•••.••"
            )
          }
          subtitle="SALES"
          subtitleValue={
            loading ? (
              <InlineSkeleton width={40} height={16} />
            ) : (
              data?.today_sales_count || 0
            )
          }
          icon={
            <TouchableOpacity onPress={() => setShowSales(!showSales)}>
              <Eye color="#666" size={20} />
            </TouchableOpacity>
          }
        />
      </View>

      <View style={{ width: CARD_WIDTH }}>
        <StatsCard
          title="TOTAL REVENUE"
          value={
            loading ? (
              <InlineSkeleton width={120} height={24} />
            ) : (
              `₦${data?.amount_made?.toLocaleString()}`
            )
          }
          subtitle="REVENUE"
        />
      </View>

      <View style={{ width: CARD_WIDTH }}>
        <StatsCard
          title="TOTAL ORDERS"
          value={
            loading ? (
              <InlineSkeleton width={80} height={24} />
            ) : (
              data?.sales_count || 0
            )
          }
          subtitle="ORDERS"
        />
      </View>
    </ScrollView>
  );
};
