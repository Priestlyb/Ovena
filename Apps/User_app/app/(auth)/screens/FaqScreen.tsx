import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

// 📌 DATA
const FAQ_SECTIONS = [
  {
    title: "HELP & SUPPORT",
    data: [
      {
        id: 1,
        question: "How can I contact support?",
        answer:
          "You can reach out to our support team via the help section in your profile.",
      },
      {
        id: 2,
        question: "What should I do if the app crashes?",
        answer: "Try restarting the app or updating to the latest version.",
      },
    ],
  },
  {
    title: "METHOD OF PAYMENTS AND INCIDENTS",
    data: [
      {
        id: 3,
        question: "What payment methods are accepted?",
        answer:
          "We accept cards, bank transfers, and other supported gateways.",
      },
      {
        id: 4,
        question: "I was charged but didn’t get service",
        answer: "Contact support immediately with your transaction details.",
      },
    ],
  },
  {
    title: "OTHER QUESTIONS",
    data: [
      {
        id: 5,
        question: "Can I change my account details?",
        answer: "Yes, you can update your account details in your profile.",
      },
      {
        id: 6,
        question: "Is my data secure?",
        answer: "Yes, we use encryption to protect all user data.",
      },
    ],
  },
];

// 🔥 ITEM
const AccordionItem = ({
  item,
  isOpen,
  onPress,
}: {
  item: any;
  isOpen: boolean;
  onPress: () => void;
}) => {
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  const [contentHeight, setContentHeight] = useState(0);

  React.useEffect(() => {
    height.value = withTiming(isOpen ? contentHeight : 0, { duration: 300 });
    opacity.value = withTiming(isOpen ? 1 : 0, { duration: 200 });
    rotate.value = withTiming(isOpen ? 90 : 0, { duration: 300 });
  }, [isOpen, contentHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <View
      style={[
        styles.card,
        isOpen && { borderColor: "#eb7207", borderWidth: 1 },
      ]}
    >
      <TouchableOpacity
        style={styles.questionRow}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.question,
            isOpen && { color: "#eb7207", fontWeight: "600" },
          ]}
        >
          {item.question}
        </Text>

        <Animated.View style={rotateStyle}>
          <IconSymbol name="ChevronRightIcon" size={20} color={"black"} />
        </Animated.View>
      </TouchableOpacity>

      {/* HIDDEN MEASURE VIEW */}
      <View
        style={styles.hidden}
        onLayout={(e) => {
          if (contentHeight === 0) {
            setContentHeight(e.nativeEvent.layout.height);
          }
        }}
      >
        <Text style={styles.answer}>{item.answer}</Text>
      </View>

      {/* ANIMATED VIEW */}
      <Animated.View style={[styles.answerContainer, animatedStyle]}>
        <Text style={styles.answer}>{item.answer}</Text>
      </Animated.View>
    </View>
  );
};

export default function FaqScreen() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setActiveIndex(activeIndex === id ? null : id);
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

        <Text style={{ fontSize: 24, fontWeight: "bold" }}>FAQs</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {FAQ_SECTIONS.map((section, index) => (
          <View key={index}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.data.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                isOpen={activeIndex === item.id}
                onPress={() => toggleItem(item.id)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 55,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },

  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    marginTop: 20,
    marginBottom: 8,
  },

  card: {
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },

  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  question: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },

  answerContainer: {
    paddingHorizontal: 16,
  },

  answer: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  hidden: {
    position: "absolute",
    opacity: 0,
    zIndex: -1,
    left: 0,
    right: 0,
  },
});
