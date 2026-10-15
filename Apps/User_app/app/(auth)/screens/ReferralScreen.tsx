import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Share,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import FeedbackModal from "@/components/FeedbackModal";
import { createStyles } from "@/constants/styles/ReferralScreen.styles";
import { useTheme, ThemeColors } from "@/constants/theme";

import { useGenerateReferralLink } from "@/hooks/referralService/useGenerateReferralLink";
import { useMyReferralList } from "@/hooks/referralService/useMyReferralList";

const TABS = ["Your Referrals", "Invited friends"];

export default function ReferralScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [activeTab, setActiveTab] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const scale = useSharedValue(1);
  const tabTranslate = useSharedValue(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  /* =========================
     API HOOKS
  ========================= */

  const { generateLink, loading, data } = useGenerateReferralLink();

  const {
    fetchReferrals,
    data: referralList,
    loading: listLoading,
  } = useMyReferralList();

  useEffect(() => {
    generateLink();
    fetchReferrals();
  }, [generateLink, fetchReferrals]);

  const referralCode = data?.code;
  const referralLink = data?.referral_link;

  const users =
    referralList?.map((item: any, index: number) => ({
      id: item.id?.toString() || index.toString(),
      name: item.referee_user_name || "Unknown User",
      date: item.date || "Joined recently",
      points: item.points || 0,
    })) || [];

  const totalPoints = users.reduce((acc, u) => acc + u.points, 0);

  const horizontalPadding = 8;

  const tabWidth =
    containerWidth > 0 ? (containerWidth - horizontalPadding) / TABS.length : 0;

  const buttonAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const indicatorAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: tabTranslate.value }],
  }));

  const handleTabPress = (index: number) => {
    setActiveTab(index);

    if (tabWidth > 0) {
      tabTranslate.value = withTiming(index * tabWidth);
    }
  };

  const showModal = (
    title: string,
    message: string,
    variant: "success" | "error" | "warning" | "info" = "info",
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVariant(variant);
    setModalVisible(true);
  };

  const handleCopy = async () => {
    if (!referralCode) {
      showModal("Referral unavailable", "Referral code not ready yet", "error");
      return;
    }

    await Clipboard.setStringAsync(referralCode);

    showModal("Copied!", "Referral code copied to clipboard", "success");
  };

  const handleShare = async () => {
    if (!referralLink) {
      showModal("Referral unavailable", "Referral link not ready yet", "error");
      return;
    }

    const message = `You're invited to join Ovena! Use my referral code: ${referralCode} Or join directly using my referral link: ${referralLink}

See you on Ovena!`;

    try {
      await Share.share({
        message,
        title: "Invite Friends",
      });
    } catch (error) {
      console.log(error);

      showModal(
        "Share Failed",
        "Unable to open the share dialog. Please try again.",
        "error",
      );
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      {/* HEADER */}

      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/profile")}
          style={[
            styles.backButton,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderWidth: 1,
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
          Invite friends
        </Text>

        <View style={{ width: 34 }} />
      </View>

      {/* POINTS SUMMARY 

      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            borderWidth: 1,
          },
        ]}
      >
        <Text
          style={[
            styles.summaryTitle,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          Total Points
        </Text>

        <Text
          style={[
            styles.summaryPoints,
            {
              color: theme.primary,
            },
          ]}
        >
          {totalPoints.toLocaleString()}
        </Text>
      </View>
      */}

      {/* TABS */}

      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            borderWidth: 1,
          },
        ]}
        onLayout={(e) => {
          setContainerWidth(e.nativeEvent.layout.width);
        }}
      >
        <Animated.View
          style={[
            styles.indicator,
            {
              width: tabWidth,
              backgroundColor: theme.primary,
            },
            indicatorAnim,
          ]}
        />

        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => handleTabPress(index)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === index ? "#FFFFFF" : theme.textSecondary,
                },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CONTENT */}

      <Animated.View
        key={activeTab}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
        layout={Layout.springify()}
        style={{ flex: 1 }}
      >
        {activeTab === 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 10,
            }}
          >
            <ReferralEmpty
              onCopy={handleCopy}
              code={referralCode}
              loading={loading}
              theme={theme}
            />
          </ScrollView>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <UserItem item={item} theme={theme} />}
            contentContainerStyle={{
              paddingBottom: 0,
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              listLoading ? (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    color: theme.textSecondary,
                  }}
                >
                  Loading referrals...
                </Text>
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    color: theme.textSecondary,
                  }}
                >
                  No referrals yet
                </Text>
              )
            }
          />
        )}
      </Animated.View>

      {/* CTA BUTTON */}

      <View
        style={{
          marginTop: 20,
          marginBottom: 40,
        }}
      >
        <Animated.View style={buttonAnim}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleShare}
            style={[
              styles.button,
              {
                backgroundColor: theme.primary,
              },
            ]}
          >
            <Text style={styles.buttonText}>
              <IconSymbol name="ShareAltIcon" size={18} color="#FFBC44" /> Share
              my Referral Code
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <FeedbackModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        variant={modalVariant}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

/* ---------------- COMPONENTS ---------------- */

const ReferralEmpty = ({
  onCopy,
  code,
  loading,
  theme,
}: {
  onCopy: () => void;
  code?: string;
  loading?: boolean;
  theme: ThemeColors;
}) => {
  const styles = createStyles(theme);
  return (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../../assets/images/referralImage.png")}
        style={{
          width: "85%",
          height: 260,
          resizeMode: "contain",
          marginBottom: 16,
        }}
      />

      <Text
        style={[
          styles.title,
          {
            color: theme.textPrimary,
          },
        ]}
      >
        Invite friends, {"\n"}Get 1,000 Points per friend!
      </Text>

      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.codeBox,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            borderWidth: 1,
          },
        ]}
        onPress={onCopy}
      >
        <Text
          style={[
            styles.codeLabel,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          Your Referral Code
        </Text>

        <Text
          style={[
            styles.code,
            {
              color: theme.primary,
            },
          ]}
        >
          {loading ? "Generating..." : code || "N/A"}
        </Text>

        <Text
          style={{
            fontSize: 12,
            color: theme.textSecondary,
            marginTop: 6,
          }}
        >
          Tap to copy
        </Text>
      </TouchableOpacity>

      <View
        style={[
          styles.info,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 18,
            paddingVertical: 8,
          },
        ]}
      >
        <View style={styles.infoRow}>
          <IconSymbol name="StarIcon" size={20} color="#EEC234" />

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.infoTitle,
                {
                  color: theme.textPrimary,
                },
              ]}
            >
              Invite your friends
            </Text>

            <Text
              style={[
                styles.infoText,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              Send your friends your personal referral code or referral link.
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <IconSymbol name="StarIcon" size={20} color="#EEC234" />

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.infoTitle,
                {
                  color: theme.textPrimary,
                },
              ]}
            >
              They sign up
            </Text>

            <Text
              style={[
                styles.infoText,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              Your friend creates an Ovena account using your referral.
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <IconSymbol name="StarIcon" size={20} color="#EEC234" />

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.infoTitle,
                {
                  color: theme.textPrimary,
                },
              ]}
            >
              Earn rewards
            </Text>

            <Text
              style={[
                styles.infoText,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              Receive 1,000 reward points for every successful referral.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const UserItem = ({ item, theme }: { item: any; theme: ThemeColors }) => {
  const styles = createStyles(theme);
  return (
    <Animated.View
      entering={FadeIn.delay(50)}
      style={[
        styles.userItem,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
        },
      ]}
    >
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: theme.decorCircle,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text
          style={{
            color: theme.primary,
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          {item.name?.charAt(0).toUpperCase() ?? "U"}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.name,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          {item.name}
        </Text>

        <Text
          style={[
            styles.sub,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          {item.date}
        </Text>
      </View>

      <Text
        style={[
          styles.points,
          {
            color: theme.primary,
          },
        ]}
      >
        {item.points.toLocaleString()} pts
      </Text>
    </Animated.View>
  );
};
