import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemeColors, useTheme } from "@/constants/theme";

export default function FaqDetailsScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const { question, answer } = useLocalSearchParams<{
    question: string;
    answer: string;
  }>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <IconSymbol
            name="ArrowLeftIcon"
            size={20}
            color={theme.textPrimary}
          />
        </TouchableOpacity>

        {/* Question */}

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <IconSymbol name="QuestionCircle" size={30} color={theme.primary} />
          </View>

          <Text style={styles.title}>{question}</Text>

          <Text style={styles.updated}>Frequently Asked Question</Text>
        </View>

        {/* Answer */}

        <View style={styles.answerCard}>
          <Text style={styles.answer}>{answer}</Text>
        </View>

        {/* Helpful Card */}

        <View style={styles.tipCard}>
          <IconSymbol name="InfoCircleIcon" size={22} color={theme.primary} />

          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Still need help?</Text>

            <Text style={styles.tipText}>
              If this answer didn't solve your problem, our support team is
              available to assist you.
            </Text>
          </View>
        </View>

        {/* Contact Support */}

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.supportButton}
          onPress={() => {
            router.push("/(auth)/screens/CustomerSupportPage");
          }}
        >
          <Text style={styles.supportButtonText}>Contact Support</Text>
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
      backgroundColor: theme.background,
      paddingTop: 60,
    },

    content: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },

    backButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: theme.surface,

      justifyContent: "center",
      alignItems: "center",

      borderWidth: 1,
      borderColor: theme.border,

      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 4,
      },

      elevation: 4,

      marginBottom: 28,
    },

    header: {
      alignItems: "center",
      marginBottom: 28,
    },

    iconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,

      backgroundColor: theme.decorCircle,

      justifyContent: "center",
      alignItems: "center",

      marginBottom: 20,
    },

    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.textPrimary,

      textAlign: "center",

      lineHeight: 38,
    },

    updated: {
      marginTop: 10,
      fontSize: 14,
      color: theme.textSecondary,
    },

    answerCard: {
      backgroundColor: theme.surface,

      borderRadius: 22,

      padding: 22,

      marginBottom: 24,

      borderWidth: 1,
      borderColor: theme.border,

      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 4,
      },

      elevation: 3,
    },

    answer: {
      fontSize: 16,
      lineHeight: 30,
      color: theme.textSecondary,
    },

    tipCard: {
      flexDirection: "row",
      alignItems: "flex-start",

      backgroundColor: theme.decorCircle,

      borderRadius: 18,

      padding: 18,

      borderWidth: 1,
      borderColor: theme.border,

      gap: 14,

      marginBottom: 28,
    },

    tipTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.textPrimary,

      marginBottom: 6,
    },

    tipText: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.textSecondary,
    },

    supportButton: {
      backgroundColor: theme.primary,

      borderRadius: 18,

      height: 58,

      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",

      gap: 10,
    },

    supportButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
  });
