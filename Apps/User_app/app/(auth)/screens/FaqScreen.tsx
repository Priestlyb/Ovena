// app/screens/FaqScreen.tsx

import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { FAQItem, FAQ_SECTIONS } from "@/data/faqData";

import { useTheme, ThemeColors } from "@/constants/theme";


type FaqRowProps = {
  item: FAQItem;
};


const FaqRow = ({ item }: FaqRowProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(auth)/screens/FaqDetails",
          params: {
            id: String(item.id),
            question: item.question,
            answer: item.answer,
          },
        })
      }
    >
      <View style={styles.questionRow}>
        <View style={styles.questionContent}>
          <View style={styles.iconContainer}>
            <IconSymbol
              name="QuestionCircle"
              size={18}
              color={theme.primary}
            />
          </View>

          <Text style={styles.question}>
            {item.question}
          </Text>
        </View>

        <IconSymbol
          name="ChevronRightIcon"
          size={18}
          color={theme.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
};


export default function FaqScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.replace("/(tabs)/profile")}
          >
            <IconSymbol
              name="ArrowLeftIcon"
              size={20}
              color={theme.icon}
            />
          </TouchableOpacity>


          <View style={styles.headerText}>
            <Text style={styles.title}>
              Frequently Asked Questions
            </Text>

            <Text style={styles.subtitle}>
              Everything you need to know about ordering,
              payments and using Ovena.
            </Text>
          </View>
        </View>


        {/* Help Card */}

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <IconSymbol
              name="HelpCircleOutline"
              size={30}
              color={theme.primary}
            />
          </View>


          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>
              Need Help?
            </Text>

            <Text style={styles.heroSubtitle}>
              Browse our frequently asked questions below.
              Tap any question to view the full answer.
            </Text>
          </View>
        </View>


        {/* FAQ Sections */}

        {FAQ_SECTIONS.map((section) => (
          <View
            key={section.title}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>
              {section.title}
            </Text>


            {section.data.map((item) => (
              <FaqRow
                key={item.id}
                item={item}
              />
            ))}
          </View>
        ))}


        {/* Contact Support */}

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.supportCard}
          onPress={() => {
            router.push("/(auth)/screens/SupportPage");
          }}
        >
          <View style={styles.supportIcon}>
            <IconSymbol
              name="HelpCircleOutline"
              size={24}
              color="#FFFFFF"
            />
          </View>


          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>
              Still need help?
            </Text>

            <Text style={styles.supportSubtitle}>
              Contact our support team and we'll be happy
              to assist you.
            </Text>
          </View>
        </TouchableOpacity>


        <View style={{ height: 40 }} />

      </ScrollView>
    </SafeAreaView>
  );
}



const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({

    container: {
      flex: 1,
      paddingTop: 25,
      backgroundColor: theme.background,
    },


    content: {
      padding: 20,
      paddingTop: 60,
    },


    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 24,
    },


    backButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },


    headerText: {
      flex: 1,
    },


    title: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.textPrimary,
    },


    subtitle: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 21,
      color: theme.textSecondary,
    },


    heroCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary + "15",
      borderRadius: 22,
      padding: 18,
      marginBottom: 30,
    },


    heroIcon: {
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },


    heroTextContainer: {
      flex: 1,
    },


    heroTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
    },


    heroSubtitle: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 20,
      color: theme.textSecondary,
    },


    section: {
      marginBottom: 24,
    },


    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: 14,
    },


    card: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },


    questionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },


    questionContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      paddingRight: 12,
    },


    iconContainer: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: theme.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },


    question: {
      flex: 1,
      fontSize: 15,
      fontWeight: "600",
      color: theme.textPrimary,
      lineHeight: 21,
    },


    supportCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary,
      borderRadius: 22,
      padding: 18,
      marginTop: 10,
    },


    supportIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },


    supportContent: {
      flex: 1,
    },


    supportTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: "#FFFFFF",
    },


    supportSubtitle: {
      marginTop: 5,
      fontSize: 13,
      lineHeight: 18,
      color: "#FFFFFF",
      opacity: 0.9,
    },

  });