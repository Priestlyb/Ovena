// dashboardTab.tsx

import { useRouter } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FeedbackModal from "@/components/FeedbackModal";
import { FloatingChatButton } from "@/components/FloatingChatButton";
import { StatsCard } from "@/components/StatsCard";
import { ToggleSwitch } from "@/components/ToggleSwitch";

import { CARD_WIDTH, styles } from "@/constants/staffDashboardTab.styles";

import useBranchStatus from "@/hooks/staff/useBranchStatus";
import useDashboardCarousel from "@/hooks/staff/useDashboardCarousel";
import useDashboardStaff from "@/hooks/staff/useDashboardStaff";

const PERIODS = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "12 Months", value: "12m" },
];

export default function DashboardScreen() {
  const router = useRouter();

  const {
    scrollViewRef,
    showSales,
    setShowSales,
    currentCardIndex,
    selectedPeriod,
    setSelectedPeriod,
    handleScroll,
    scrollToCard,
  } = useDashboardCarousel();

  // Refetches automatically whenever selectedPeriod changes
  const { staff, loading, refreshing, error } =
    useDashboardStaff(selectedPeriod);

  const { isOpen, updating, feedback, setFeedback, toggleBranch } =
    useBranchStatus();

  const dashboard = staff ?? {
    username: "User",
    today_sales: 0,
    today_sales_count: 0,
    total_orders: {
      filter: "",
      count: 0,
      amount: 0,
    },
    total_shipment: {
      filter: "",
      count: 0,
      amount: 0,
    },
  };

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    if (staff && !initialLoadComplete) {
      setInitialLoadComplete(true);
    }
  }, [staff, initialLoadComplete]);

  if (!initialLoadComplete && loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FF5920" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>

            <Text style={styles.welcomeText}>
              Welcome back, {dashboard.username}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <ToggleSwitch
              value={isOpen}
              onChange={toggleBranch}
              activeColor="#FF6B35"
              inactiveColor="#D1D5DB"
              disabled={updating}
            />
          </View>
        </View>

        {/* Today's Sales */}
        <StatsCard
          title="TODAY'S SALES"
          value={
            showSales ? `₦${dashboard.today_sales.toLocaleString()}` : "₦••,•••"
          }
          subtitle="SALES"
          subtitleValue={dashboard.today_sales_count}
          masked={refreshing}
        />

        {/* Period Filters */}
        <View style={styles.periodsContainer}>
          {PERIODS.map((period) => {
            const isActive = selectedPeriod === period.value;

            return (
              <TouchableOpacity
                key={period.value}
                style={[styles.periodChip, isActive && styles.activePeriodChip]}
                onPress={() => setSelectedPeriod(period.value)}
                disabled={refreshing}
                activeOpacity={0.7}
              >
                {isActive && refreshing ? (
                  <ActivityIndicator size="small" color="#FF5920" />
                ) : (
                  <Text
                    style={[
                      styles.periodText,
                      isActive && styles.activePeriodText,
                    ]}
                  >
                    {period.label}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Stats Carousel */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH}
          snapToAlignment="center"
          contentContainerStyle={styles.statsScrollContainer}
        >
          <View style={styles.cardWrapper}>
            <StatsCard
              title="TOTAL REVENUE"
              value={`₦${dashboard.total_orders.amount.toLocaleString()}`}
              subtitle="REVENUE"
              masked={refreshing}
            />
          </View>

          <View style={styles.cardWrapper}>
            <StatsCard
              title="TOTAL ORDERS"
              value={dashboard.total_orders.count}
              subtitle="ORDERS"
              masked={refreshing}
            />
          </View>
        </ScrollView>

        {/* Pagination */}
        <View style={styles.paginationContainer}>
          {[0, 1].map((_, index) => (
            <TouchableOpacity key={index} onPress={() => scrollToCard(index)}>
              <View
                style={[
                  styles.paginationDot,
                  currentCardIndex === index && styles.activeDot,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Chat */}
      <FloatingChatButton
        icon={<MessageCircle size={28} color="#fff" />}
        onPress={() => router.push("/screens/staffs/SupportPage")}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedback.visible}
        variant={feedback.variant}
        message={feedback.message}
        onClose={() =>
          setFeedback((prev) => ({
            ...prev,
            visible: false,
          }))
        }
      />
    </SafeAreaView>
  );
}
