// CheckoutScreen.styles.ts

import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },

    header: {
      marginTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    backButton: {
      borderWidth: 1,
      borderColor: theme.border,
      padding: 10,
      borderRadius: 100,
      backgroundColor: theme.surface,
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 30,
    },

    card: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 16,
      color: theme.textPrimary,
    },

    businessName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
    },

    branchText: {
      marginTop: 6,
      color: theme.textSecondary,
    },

    itemCard: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      backgroundColor: theme.background,
    },

    productName: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: 12,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },

    label: {
      color: theme.textSecondary,
      fontSize: 14,
    },

    value: {
      fontWeight: "600",
      color: theme.textPrimary,
      fontSize: 14,
    },

    promoBox: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      marginVertical: 20,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },

    promoInputBox: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      backgroundColor: theme.background,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginRight: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },

    promoInput: {
      flex: 1,
      marginLeft: 8,
      height: 40,
      fontSize: 14,
      color: theme.textPrimary,
    },

    promoButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 20,
    },

    promoButtonText: {
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: 16,
    },

    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 12,
    },

    totalLabel: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    totalValue: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.primary,
    },

    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      backgroundColor: theme.background,
    },
  });