// dashboardTab.tsx
import { useRouter } from "expo-router";
import { Eye, MessageCircle } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FeedbackModal from "@/components/FeedbackModal";
import { FloatingChatButton } from "@/components/FloatingChatButton";
import { StatsCard } from "@/components/StatsCard";
import { ToggleSwitch } from "@/components/ToggleSwitch";

import api from "@/services/apiClient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32;

export default function DashboardScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [branchDay, setBranchDay] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);

  const [showSales, setShowSales] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("Today");

  const [feedback, setFeedback] = useState<{
    visible: boolean;
    variant: "success" | "error" | "warning" | "info";
    message: string;
  }>({
    visible: false,
    variant: "info",
    message: "",
  });

  const getMockData = (period: string) => {
    switch (period) {
      case "Today":
        return { revenue: 12000, orders: 8, shipments: 5 };
      case "7 Days":
        return { revenue: 45000, orders: 30, shipments: 18 };
      case "30 Days":
        return { revenue: 120000, orders: 75, shipments: 50 };
      case "12 Months":
        return { revenue: 850000, orders: 420, shipments: 310 };
      default:
        return { revenue: 0, orders: 0, shipments: 0 };
    }
  };

  const data = getMockData(selectedPeriod);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setCurrentCardIndex(index);
  };

  const scrollToCard = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * CARD_WIDTH,
      animated: true,
    });
    setCurrentCardIndex(index);
  };

  const [userProfile, setUserProfile] = useState<{
    name?: string;
    phone_number?: string;
  }>({});

  const [loadingProfile, setLoadingProfile] = useState(false);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);

        const response = await api.get("/accounts/profile/", {
          params: { profile_type: "businessstaff" },
        });

        const data = response.data;

        console.log("Profile datails", data);

        setUserProfile({
          name: data.user?.name,
          phone_number: data.user?.phone_number,
        });
      } catch (error: any) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch branch status
  useEffect(() => {
    const fetchBranchStatus = async () => {
      try {
        const response = await api.get("/business/branches/close/");

        console.log("Branch status response:", response.data);

        const isClosed = response.data?.is_closed;
        const day = response.data?.day;

        setIsOpen(!isClosed);
        setBranchDay(day);
      } catch (error: any) {
        console.error("Branch status fetch error:", error);
      }
    };

    fetchBranchStatus();
  }, []);

  // Toggle handler with FeedbackModal
  const handleToggle = async (value: boolean) => {
    if (updating || branchDay === null) return;

    setIsOpen(value);
    setUpdating(true);

    try {
      const payload = {
        day: branchDay,
        is_closed: !value,
        open_time: "20:41:32.036Z",
        close_time: "20:41:32.036Z",
      };

      await api.patch("/business/branches/close/", payload);

      setFeedback({
        visible: true,
        variant: "success",
        message: value ? "Branch is now OPEN" : "Branch is now CLOSED",
      });
    } catch (error: any) {
      console.error("Toggle update error:", error);

      // rollback
      setIsOpen(!value);

      setFeedback({
        visible: true,
        variant: "error",
        message: "Failed to update branch status. Try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

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
              Welcome back,{" "}
              {loadingProfile ? "..." : userProfile?.name || "User"}!
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <ToggleSwitch
              value={isOpen}
              onChange={handleToggle}
              activeColor="#FF6B35"
              inactiveColor="#D1D5DB"
              disabled={updating}
            />
          </View>
        </View>

        {/* Today's Sales */}
        <StatsCard
          title="TODAY'S SALES"
          value={showSales ? `₦${data.revenue.toLocaleString()}` : "₦••,•••"}
          subtitle="SALES"
          subtitleValue={data.orders}
          icon={
            <TouchableOpacity onPress={() => setShowSales(!showSales)}>
              <Eye color="#666" size={20} />
            </TouchableOpacity>
          }
        />

        {/* Period Filters */}
        <View style={styles.periodsContainer}>
          {["Today", "7 Days", "30 Days", "12 Months"].map((label) => {
            const isActive = selectedPeriod === label;
            return (
              <TouchableOpacity
                key={label}
                style={[styles.periodChip, isActive && styles.activePeriodChip]}
                onPress={() => setSelectedPeriod(label)}
              >
                <Text
                  style={[
                    styles.periodText,
                    isActive && styles.activePeriodText,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Stats Cards */}
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
              value={`₦${data.revenue.toLocaleString()}`}
              subtitle="REVENUE"
            />
          </View>

          <View style={styles.cardWrapper}>
            <StatsCard
              title="TOTAL ORDERS"
              value={`${data.orders}`}
              subtitle="ORDERS"
            />
          </View>

          <View style={styles.cardWrapper}>
            <StatsCard
              title="TOTAL SHIPMENT"
              value={`${data.shipments}`}
              subtitle="SHIPMENTS"
            />
          </View>
        </ScrollView>

        {/* Pagination */}
        <View style={styles.paginationContainer}>
          {[0, 1, 2].map((_, index) => (
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

      {/* ✅ Feedback Modal */}
      <FeedbackModal
        visible={feedback.visible}
        variant={feedback.variant}
        message={feedback.message}
        onClose={() => setFeedback((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContent: {
    paddingBottom: 120,
  },
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
  welcomeText: {
    fontSize: 14,
    color: "#666",
  },
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
  statsScrollContainer: {
    paddingRight: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
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
