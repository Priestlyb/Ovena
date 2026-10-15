import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import EmptyLeaderboard from "@/components/Point/EmptyLeaderboard";
import HeroCard from "@/components/Point/HeroCard";
import LeaderboardRow from "@/components/Point/LeaderboardRow";
import LeaderboardSkeleton from "@/components/Point/LeaderboardSkeleton";
import Podium from "@/components/Point/Podium";
import WithdrawalModal from "@/components/Point/WithdrawalModal";
import FeedbackModal from "@/components/FeedbackModal";

import { usePointsBalance } from "@/hooks/points/usePointsBalance";
import { usePointsLeaderboard } from "@/hooks/points/usePointsLeaderboard";
import { useMyLeaderboardPosition } from "@/hooks/points/useMyLeaderboardPosition";
import { useCreateWithdrawal } from "@/hooks/points/useCreateWithdrawal";

import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/theme";

const LeaderboardTestScreen = () => {
  const theme = useTheme();

  const {
    data: leaderboard = [],
    isLoading: leaderboardLoading,
    error: leaderboardError,
    refetch: refetchLeaderboard,
    isRefetching: leaderboardRefreshing,
  } = usePointsLeaderboard();

  const {
    data: myPosition,
    isLoading: myPositionLoading,
    error: myPositionError,
    refetch: refetchMyPosition,
  } = useMyLeaderboardPosition();

  const {
    data: balance,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = usePointsBalance();

  const withdrawalMutation = useCreateWithdrawal();

  const [withdrawalVisible, setWithdrawalVisible] = useState(false);

  const [feedback, setFeedback] = useState<{
    visible: boolean;
    title: string;
    message: string;
    variant: "success" | "error" | "warning" | "info";
  }>({
    visible: false,
    title: "",
    message: "",
    variant: "info",
  });

  const closeFeedback = () => {
    setFeedback((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const handleWithdraw = async (points: number) => {
    try {
      const response = await withdrawalMutation.mutateAsync({
        points_requested: points,
      });

      setWithdrawalVisible(false);

      setFeedback({
        visible: true,
        title: "Withdrawal Successful",
        message:
          response?.message ??
          "Your withdrawal request has been submitted successfully.",
        variant: "success",
      });

      await Promise.all([
        refetchBalance(),
        refetchLeaderboard(),
        refetchMyPosition(),
      ]);
    } catch (error: any) {
      const responseData = error?.response?.data;

      let message = "Something went wrong. Please try again.";

      if (responseData) {
        if (typeof responseData === "string") {
          message = responseData;
        } else if (responseData.message) {
          message = responseData.message;
        } else if (responseData.points_requested) {
          message = Array.isArray(responseData.points_requested)
            ? responseData.points_requested.join("\n")
            : responseData.points_requested;
        }
      }

      setFeedback({
        visible: true,
        title: "Withdrawal Failed",
        message,
        variant: "error",
      });
    }
  };

  const loading = leaderboardLoading || myPositionLoading || balanceLoading;

  const error = leaderboardError || myPositionError || balanceError;

  const onRefresh = async () => {
    await Promise.all([
      refetchLeaderboard(),
      refetchMyPosition(),
      refetchBalance(),
    ]);
  };

  if (loading) {
    return <LeaderboardSkeleton />;
  }

  if (error) {
    return (
      <SafeAreaView
        style={[
          styles.center,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <Text
          style={[
            styles.errorTitle,
            {
              color: theme.error,
            },
          ]}
        >
          Failed to load leaderboard
        </Text>

        <Text
          style={[
            styles.retry,
            {
              color: theme.primary,
            },
          ]}
          onPress={onRefresh}
        >
          Tap to Retry
        </Text>
      </SafeAreaView>
    );
  }

  if (!leaderboard.length) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <EmptyLeaderboard />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.user_id}
        refreshControl={
          <RefreshControl
            refreshing={leaderboardRefreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => router.replace("/(tabs)/profile")}
                style={[
                  styles.backButton,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.surface,
                  },
                ]}
              >
                <IconSymbol
                  name="ArrowLeftIcon"
                  size={22}
                  color={theme.textPrimary}
                />
              </TouchableOpacity>

              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: theme.textPrimary,
                  },
                ]}
              >
                Rewards Leaderboard
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/screens/pointHistorysScreen")}
              >
                <IconSymbol
                  name="HistoryIcon"
                  size={27}
                  color={theme.textPrimary}
                />
              </TouchableOpacity>
            </View>

            <HeroCard
              points={balance?.points_balance ?? 0}
              rank={myPosition?.rank ?? 0}
              totalUsers={leaderboard.length}
              onWithdraw={() => setWithdrawalVisible(true)}
              withdrawing={withdrawalMutation.isPending}
            />

            <Podium
              first={
                leaderboard[0]
                  ? {
                      rank: 1,
                      name: leaderboard[0].name,
                      points: leaderboard[0].points,
                    }
                  : undefined
              }
              second={
                leaderboard[1]
                  ? {
                      rank: 2,
                      name: leaderboard[1].name,
                      points: leaderboard[1].points,
                    }
                  : undefined
              }
              third={
                leaderboard[2]
                  ? {
                      rank: 3,
                      name: leaderboard[2].name,
                      points: leaderboard[2].points,
                    }
                  : undefined
              }
            />

            <Text
              style={[
                styles.sectionTitle,
                {
                  color: theme.textPrimary,
                },
              ]}
            >
              Leaderboard
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <LeaderboardRow
            rank={item.rank}
            name={item.name}
            points={item.points}
            isCurrentUser={item.user_id === myPosition?.user_id}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        ListFooterComponent={<View style={{ height: 40 }} />}
        showsVerticalScrollIndicator={false}
      />

      <WithdrawalModal
        visible={withdrawalVisible}
        availablePoints={balance?.points_balance ?? 0}
        loading={withdrawalMutation.isPending}
        onClose={() => setWithdrawalVisible(false)}
        onSubmit={handleWithdraw}
      />

      <FeedbackModal
        visible={feedback.visible}
        title={feedback.title}
        message={feedback.message}
        variant={feedback.variant}
        onClose={closeFeedback}
      />
    </SafeAreaView>
  );
};

export default LeaderboardTestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  backButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 50,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 18,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  retry: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
});