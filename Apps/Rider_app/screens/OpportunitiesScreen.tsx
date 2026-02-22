// screens/OpportunitiesScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";

interface OpportunitiesScreenProps {
  onBack: () => void;
}

const OPPORTUNITIES = [
  {
    id: "1",
    title: "Refer a Friend Bonus",
    description: "Earn ₦1,500 for every new driver you refer. Share your code and start earning now!",
    icon: "PersonPinCircleIcon",
  },
  {
    id: "2",
    title: "Earn More During Peak Hours",
    description: "During peak hours, ride-sharing and delivery services often use surge pricing or dynamic pricing.",
    icon: "ClockIcon",
  },
  {
    id: "3",
    title: "New City Expansion",
    description: "New service areas are highlighted, offering incentives for drivers to deliver in new locations.",
    icon: "LocationArrowIcon",
  },
  {
    id: "4",
    title: "Delivery Challenges",
    description: "Deliveries and tasks that offer bonuses for completion, such as high-demand area deliveries.",
    icon: "ClockIcon",
  },
  {
    id: "5",
    title: "Bonus Earnings",
    description: "Complete a set number of deliveries to unlock bonus pay this week.",
    icon: "PaymentIcon",
  },
  {
    id: "6",
    title: "Top Driver Rewards",
    description: "Maintain a high satisfaction rate to earn exclusive top driver rewards and bonuses.",
    icon: "ThumbsUpIcon",
  },
];

const OpportunitiesScreen: React.FC<OpportunitiesScreenProps> = ({ onBack }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero header */}
      <View style={styles.hero}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol name="ArrowLeftIcon" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.heroTitle}>Opportunities</Text>
        <Text style={styles.heroSubtitle}>
          {"How to Increase\nYour Earnings:\nYour Guide to Higher Pay"}
        </Text>
      </View>

      {/* Grid of cards */}
      <View style={styles.grid}>
        {OPPORTUNITIES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.85}
          >
            <IconSymbol name={item.icon} size={36} color="#111" />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default OpportunitiesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  hero: {
    backgroundColor: "#555",
    paddingTop: Platform.OS === "ios" ? 64 : 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    gap: 12,
    minHeight: 220,
    justifyContent: "flex-end",
  },
  backBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 44,
    left: 24,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 34,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 10,
  },
  card: {
    backgroundColor: "#FFDA71",
    borderRadius: 16,
    padding: 18,
    width: "47%",
    gap: 10,
    minHeight: 180,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    lineHeight: 20,
  },
  cardDesc: {
    fontSize: 12,
    color: "#444",
    lineHeight: 18,
  },
});