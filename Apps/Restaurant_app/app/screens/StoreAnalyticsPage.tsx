// StoreAnalyticsPage.tsx
import { useRouter } from "expo-router";
import { ArrowLeft, MessageCircle } from "lucide-react-native";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { FloatingChatButton } from "@/components/FloatingChatButton";
import { Header } from "@/components/molecules/Header";

import { ReviewsCard } from "@/components/ReviewsCard";
import { TopPerformingBranchCard } from "@/components/TopPerformingBranchCard";
import { TopProductCard } from "@/components/TopProductCard";
import { TrendRevenueChart } from "@/components/TrendRevenueChart";

import { useDashboardScreen } from "@/hooks/dashboard/useDashboardScreen";

export default function StoreAnalyticsPage() {
  const router = useRouter();

  const { analysis, loadingAnalysis, trendData, selectedPeriod } =
    useDashboardScreen();

  // ================= STATS =================
  const stats = [
    {
      label: "Total Revenue",
      value: `₦${Number(
        analysis?.revenue_breakdown?.total_revenue_ngn || 0,
      ).toLocaleString()}`,
      highlight: true,
    },
    {
      label: "Total Orders",
      value: analysis?.revenue_breakdown?.orders_count || 0,
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F7EFE5",
        paddingTop: 50,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <Header
          title="Store Analytics"
          leftIcon={<ArrowLeft size={22} color="#111" />}
          onLeftIconPress={() => router.back()}
          backgroundColor="#F6EFE7"
        />

        <Spacer size="lg" />

        {/* TITLE */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            variant="h3"
            style={{
              fontSize: 20,
              fontWeight: "600",
            }}
          >
            Analytics
          </Text>
        </View>

        <Spacer size="lg" />

        {/* STATS */}
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {stats.map((item, i) => (
              <View
                key={i}
                style={{
                  width: "50%",
                  marginBottom: 18,
                }}
              >
                <Text style={{ color: "#00000080" }}>{item.label}</Text>

                <Text
                  style={{
                    fontWeight: "800",
                    fontSize: 22,
                    marginTop: 4,
                    color: item.highlight ? "#FF5A1F" : "#111",
                  }}
                >
                  {loadingAnalysis ? "..." : item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Spacer size="lg" />

        {/* TREND */}
        <TrendRevenueChart trend={trendData} selectedPeriod={selectedPeriod} />

        <Spacer size="lg" />
        <Spacer size="lg" />

        {/* TOP PRODUCT */}
        <TopProductCard
          name={analysis?.top_product?.name}
          orders={analysis?.top_product?.orders}
          quantity={analysis?.top_product?.quantity_sold}
          revenue={analysis?.top_product?.revenue}
          loading={loadingAnalysis}
        />

        <Spacer size="lg" />
        <Spacer size="lg" />

        {/* TOP PERFORMING BRANCH */}
        <TopPerformingBranchCard
          branchName={analysis?.topseller_branch?.branch_name}
          revenue={analysis?.topseller_branch?.amount}
          orders={analysis?.topseller_branch?.orders_count}
        />

        <Spacer size="lg" />
        <Spacer size="lg" />

        {/* REVIEWS */}
        <ReviewsCard
          rating={analysis?.reviews?.average_rating}
          count={analysis?.reviews?.count}
        />

        <Spacer size="xxl" />
      </ScrollView>

      <FloatingChatButton
        icon={<MessageCircle size={24} color="#fff" />}
        onPress={() => {}}
      />
    </SafeAreaView>
  );
}
