// Dashboard
import { FloatingChatButton } from "@/components/FloatingChatButton";
import { BottomStatsCarousel } from "@/components/dashboard/BottomStatsCarousel";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTopBranchSection } from "@/components/dashboard/DashboardTopBranchSection";
import { DashboardTrendSection } from "@/components/dashboard/DashboardTrendSection";
import { InlineSkeleton } from "@/components/dashboard/InlineSkeleton";
import { PaginationDots } from "@/components/dashboard/PaginationDots";
import { PeriodFilters } from "@/components/dashboard/PeriodFilters";
import { TopStatsCarousel } from "@/components/dashboard/TopStatsCarousel";
import { useDashboardScreen } from "@/hooks/dashboard/useDashboardScreen";
import { MessageCircle } from "lucide-react-native";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

export default function DashboardScreen() {
  const {
    router,
    isOpen,
    setIsOpen,
    showSales,
    setShowSales,
    data,
    loading,
    analysis,
    loadingAnalysis,
    trendData,
    top,
    bottom,
    periods,
    selectedPeriod,
    setSelectedPeriod,
    bottomCardIndex,
    scrollToBottomCard,
  } = useDashboardScreen();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <DashboardHeader
          username={data?.username}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          styles={styles}
        />

        <TopStatsCarousel
          refScroll={top.ref}
          onScroll={top.onScroll}
          CARD_WIDTH={top.CARD_WIDTH}
          showSales={showSales}
          setShowSales={setShowSales}
          loading={loading}
          data={data}
          InlineSkeleton={InlineSkeleton}
          styles={styles}
        />

        <DashboardTrendSection
          loading={loadingAnalysis}
          trendData={trendData}
          cardWidth={top.CARD_WIDTH}
        />

        <PeriodFilters
          periods={periods}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          styles={styles}
        />

        <BottomStatsCarousel
          refScroll={bottom.ref}
          onScroll={bottom.onScroll}
          CARD_WIDTH={top.CARD_WIDTH}
          data={data}
          loading={loading}
          InlineSkeleton={InlineSkeleton}
          styles={styles}
        />

        <PaginationDots
          count={2}
          activeIndex={bottomCardIndex}
          onPress={scrollToBottomCard}
          styles={styles}
        />

        <DashboardTopBranchSection
          loading={loadingAnalysis}
          analysis={analysis}
          cardWidth={top.CARD_WIDTH}
        />
      </ScrollView>

      <FloatingChatButton
        icon={<MessageCircle size={28} color="#fff" />}
        onPress={() => router.push("/screens/SupportPage")}
      />
    </SafeAreaView>
  );
}

// --- Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF", paddingTop: 50 },
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { paddingBottom: 120 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },

  welcomeText: { fontSize: 14, color: "#666" },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  periodsContainer: {
    marginTop: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },

  periodChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  activePeriodChip: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },

  periodText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },

  activePeriodText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  statsScrollContainer: { paddingRight: 16 },
  cardWrapper: { width: "100%" },

  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDD",
  },

  activeDot: {
    width: 24,
    backgroundColor: "#FF6B35",
  },
});
