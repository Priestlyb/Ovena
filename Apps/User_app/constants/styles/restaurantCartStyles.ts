import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    screenContainer: {
      flex: 1,
      paddingTop: 60,
      backgroundColor: theme.background,
    },

    header: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom: 20,
    },

    backBtn: {
      padding: 10,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 50,
      backgroundColor: theme.surface,
    },

    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.textPrimary,
    },

    restaurantList: {
      flex: 1,
    },

    restaurantCartItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    restaurantImageBox: {
      width: 75,
      height: 75,
      borderRadius: 8,
      marginRight: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.surface,
    },

    restaurantInfo: {
      flex: 1,
      gap: 5,
    },

    restaurantName: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.textPrimary,
    },

    restaurantSubtext: {
      fontSize: 14,
      color: theme.textSecondary,
    },

    restaurantPrice: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.textPrimary,
    },

    feesInfoButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      gap: 10,
      backgroundColor: theme.surface,
    },

    feesInfoText: {
      fontSize: 16,
      color: theme.textPrimary,
      fontWeight: "400",
    },

    deleteAction: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.error,
      width: 100,
    },

    deleteText: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },

    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.background,
    },

    emptyText: {
      fontSize: 16,
      color: theme.textSecondary,
    },

    sectionDivider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 10,
    },

    cartFooter: {
      backgroundColor: theme.background,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      padding: 16,
    },

    totalLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },

    totalValue: {
      fontSize: 22,
      fontWeight: "800",
      color: theme.primary,
    },

    checkoutButton: {
      marginTop: 15,
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },

    checkoutButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
  });