// StoreAnalyticsPage.tsx
import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, MessageCircle } from "lucide-react-native";

import api from "@/services/apiClient";

import { Text } from "@/components/atoms/Text";
import { Spacer } from "@/components/atoms/Spacer";
import { Header } from "@/components/molecules/Header";
import { FloatingChatButton } from "@/components/FloatingChatButton";

// ✅ COMPONENTS
import { TopPerformingBranchCard } from "@/components/TopPerformingBranchCard";
import { ReviewsCard } from "@/components/ReviewsCard";
import { TrendRevenueChart } from "@/components/TrendRevenueChart";
import { TopProductCard } from "@/components/TopProductCard"; // ✅ NEW

export default function StoreAnalyticsPage() {
  const router = useRouter();

  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get("/business/analysis/store/", {
          params: { period: selectedPeriod },
        });

        console.log("✅ ANALYTICS FETCHED:", res?.data);
        console.log("📊 ANALYTICS DATA:", res?.data?.data);

        setAnalytics(res?.data?.data);
      } catch (err: any) {
        console.error("❌ ANALYTICS ERROR:", err?.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedPeriod]);

  // ================= STATS =================
  const stats = [
    {
      label: "Total Revenue",
      value: `₦${Number(
        analytics?.revenue_breakdown?.total_revenue_ngn || 0
      ).toLocaleString()}`,
      highlight: true,
    },
    {
      label: "Total Orders",
      value: analytics?.revenue_breakdown?.orders_count || 0,
    },
  ];

  // ================= CHART =================
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const weekData = Array(7).fill(0);
  const trend = analytics?.trend_revenue || [];

  trend.forEach((item: any) => {
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
    chartData.length > 0 ? Math.max(...chartData.map((i) => i.value), 1) : 1;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F7EFE5", paddingTop: 50 }}
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
          <Text variant="h3" style={{ fontSize: 20, fontWeight: "600" }}>
            Analytics
          </Text>
        </View>

        <Spacer size="lg" />

        {/* STATS */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {stats.map((item, i) => (
              <View key={i} style={{ width: "50%", marginBottom: 18 }}>
                <Text style={{ color: "#00000080" }}>{item.label}</Text>

                <Text
                  style={{
                    fontWeight: "800",
                    fontSize: 22,
                    marginTop: 4,
                    color: item.highlight ? "#FF5A1F" : "#111",
                  }}
                >
                  {loading ? "..." : item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Spacer size="lg" />

        {/* TREND */}
        <TrendRevenueChart trend={analytics?.trend_revenue || []} />

        <Spacer size="lg" />
        <Spacer size="lg" />

        {/* ✅ TOP PRODUCT (NEW) */}
        <TopProductCard
          name={analytics?.top_product?.name}
          orders={analytics?.top_product?.orders}
          quantity={analytics?.top_product?.quantity_sold}
          revenue={analytics?.top_product?.revenue}
          loading={loading}
        />

        <Spacer size="lg" />
        <Spacer size="lg" />

        {/* ✅ TOP PERFORMING BRANCH */}
        <TopPerformingBranchCard
          branchName={analytics?.topseller_branch?.branch_name}
          revenue={analytics?.topseller_branch?.amount}
          orders={analytics?.topseller_branch?.orders_count}
        />

        <Spacer size="lg" />
        <Spacer size="lg" />

        {/* ✅ REVIEWS */}
        <ReviewsCard
          rating={analytics?.reviews?.average_rating}
          count={analytics?.reviews?.count}
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