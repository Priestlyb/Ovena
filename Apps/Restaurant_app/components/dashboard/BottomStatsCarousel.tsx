import { StatsCard } from "@/components/StatsCard";
import React from "react";
import {
    ScrollView,
    View
} from "react-native";

export const BottomStatsCarousel = ({
  refScroll,
  onScroll,
  CARD_WIDTH,
  data,
  loading,
  InlineSkeleton,
  styles,
}: any) => {
  if (loading) {
    return (
      <View style={{ flexDirection: "row", gap: 16, paddingHorizontal: 16 }}>
        <InlineSkeleton width={CARD_WIDTH} height={120} />
        <InlineSkeleton width={CARD_WIDTH} height={120} />
      </View>
    );
  }

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
          title="TOTAL REVENUE"
          value={`₦${data?.total_shipment?.amount.toLocaleString()}`}
          subtitle="REVENUE"
        />
      </View>

      <View style={{ width: CARD_WIDTH }}>
        <StatsCard
          title="TOTAL ORDERS"
          value={data?.total_shipment?.count || 0}
          subtitle="ORDERS"
        />
      </View>
    </ScrollView>
  );
};
