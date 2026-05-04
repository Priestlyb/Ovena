import { IconSymbol } from "@/components/ui/icon-symbol";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router/build/exports";

const TABS = ["Your Referrals", "Invited friends"];
const REFERRAL_CODE = "SUJITH08617";

const dummyUsers = Array.from({ length: 8 }).map((_, i) => ({
  id: i.toString(),
  name: "Ife Dunnie",
  date: i % 2 === 0 ? "Joined Today" : "Joined August 24",
  points: 1000,
}));

export default function ReferralScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const scale = useSharedValue(1);
  const tabTranslate = useSharedValue(0);

  const totalPoints = dummyUsers.reduce((acc, u) => acc + u.points, 0);

  const buttonAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const indicatorAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: tabTranslate.value }],
  }));

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    tabTranslate.value = withTiming(index * 160); // adjust if needed
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(REFERRAL_CODE);
    Alert.alert("Copied!", "Referral code copied to clipboard");
  };

  const handleWhatsAppShare = () => {
    const message = `Join this app and earn rewards! Use my referral code: ${REFERRAL_CODE}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 50,
          alignItems: "center",
          marginBottom: 20,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/profile")}
          style={{
            padding: 10,
            borderColor: "#000",
            borderWidth: 1,
            borderRadius: 50,
          }}
        >
          <IconSymbol name="ArrowLeftIcon" size={22} color={"#000"} />
        </TouchableOpacity>

        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Invite friends</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* POINTS SUMMARY */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Points</Text>
        <Text style={styles.summaryPoints}>{totalPoints.toLocaleString()}</Text>
      </View>

      {/* TABS */}
      <View style={styles.tabContainer}>
        <Animated.View style={[styles.indicator, indicatorAnim]} />

        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => handleTabPress(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <ReferralEmpty onCopy={handleCopy} />
          </ScrollView>
        ) : (
          <FlatList
            data={dummyUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <UserItem item={item} />}
            contentContainerStyle={{ paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>

      {/* CTA BUTTON */}
      <View style={{ marginTop: 20, marginBottom: 40 }}>
        <Animated.View style={buttonAnim}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleWhatsAppShare}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              <IconSymbol name="ShareAltIcon" size={18} color="#FFBC44" /> Share
              my Referral Code
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

/* ---------------- COMPONENTS ---------------- */

const ReferralEmpty = ({ onCopy }: any) => {
  return (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../../assets/images/referralImage.png")}
        style={{ width: "85%" }}
      />

      <Text style={styles.title}>
        Invite friends, {"\n"}Get 1,000 Points per friend!
      </Text>

      {/* CODE BOX */}
      <TouchableOpacity style={styles.codeBox} onPress={onCopy}>
        <Text style={styles.codeLabel}>Your Referral Code</Text>
        <Text style={styles.code}>SUJITH08617</Text>
        <Text style={{ fontSize: 12, color: "#888", marginTop: 5 }}>
          Tap to copy
        </Text>
      </TouchableOpacity>

      {/* INFO */}
      <View style={styles.info}>
        <View style={styles.infoRow}>
          <IconSymbol name="StarIcon" size={20} color="#EEC234" />
          <View>
            <Text style={styles.infoTitle}>Invite your friends</Text>
            <Text style={styles.infoText}>
              Send your friends your personal link.
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <IconSymbol name="StarIcon" size={20} color="#EEC234" />
          <View>
            <Text style={styles.infoTitle}>You get free points</Text>
            <Text style={styles.infoText}>
              When they join, you can unlock points per friend.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const UserItem = ({ item }: any) => {
  return (
    <Animated.View entering={FadeIn.delay(50)} style={styles.userItem}>
      <View style={styles.avatar} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sub}>{item.date}</Text>
      </View>

      <Text style={styles.points}>{item.points.toLocaleString()} pts</Text>
    </Animated.View>
  );
};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 55,
    backgroundColor: "#f7f7f7",
  },

  header: {
    fontSize: 20,
    fontWeight: "700",
  },

  summaryCard: {
    backgroundColor: "#D9502E",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },

  summaryTitle: {
    color: "#fff",
    fontSize: 12,
  },

  summaryPoints: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },

  indicator: {
    position: "absolute",
    width: "50%",
    height: "100%",
    backgroundColor: "#D9502E",
    borderRadius: 10,
  },

  tab: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    zIndex: 2,
  },

  tabText: {
    color: "#555",
    fontWeight: "600",
  },

  activeTabText: {
    color: "#fff",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  title: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 28,
    fontWeight: "600",
    marginBottom: 20,
  },

  codeBox: {
    width: "85%",
    backgroundColor: "#eaeaea",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  codeLabel: {
    fontSize: 12,
    color: "#666",
  },

  code: {
    fontSize: 18,
    fontWeight: "700",
    color: "#D9502E",
  },

  info: {
    width: "100%",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },

  infoTitle: {
    fontWeight: "600",
  },

  infoText: {
    color: "#777",
    fontSize: 12,
  },

  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 10,
  },

  name: {
    fontWeight: "600",
  },

  sub: {
    fontSize: 12,
    color: "#777",
  },

  points: {
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#F63607",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
