// constants/styles/ordersStyles.ts

import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createOrdersStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingTop: 60,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
    },

    headerTitle: {
      fontSize: 25,
      fontWeight: "bold",
      color: theme.textPrimary,
    },

    headerSpacer: {
      width: 40,
    },

    centerContent: {
      paddingVertical: 40,
      justifyContent: "center",
      alignItems: "center",
    },

    infoText: {
      marginTop: 10,
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
    },

    errorText: {
      fontSize: 14,
      color: theme.error,
      textAlign: "center",
      fontWeight: "600",
    },

    debugText: {
      marginTop: 10,
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 18,
      paddingHorizontal: 20,
    },
  });

export const createFoodOrderStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    foodCardYellow: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 20,
      marginBottom: 25,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      position: "relative",
    },

    liveBadge: {
      position: "absolute",
      top: 0,
      right: -55,
      backgroundColor: theme.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },

    liveText: {
      color: theme.background,
      fontSize: 10,
      fontWeight: "bold",
    },

    statusText: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: "600",
      marginBottom: 6,
    },

    productImage: {
      width: 100,
      height: 100,
      borderRadius: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },

    imagePlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 14,
      backgroundColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },

    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme.textPrimary,
    },

    cardDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 4,
    },

    foodCardRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 25,
      marginBottom: 10,
    },

    foodCardRowItem: {
      width: "50%",
    },

    ratingPriceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginTop: 12,
      marginBottom: 10,
    },

    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },

    ratingText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.textPrimary,
    },

    priceText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textPrimary,
    },

    locationRow: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      marginBottom: 16,
    },

    locationText: {
      fontSize: 13,
      color: theme.textSecondary,
      flex: 1,
    },

    checkOrderButton: {
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },

    checkOrderText: {
      color: theme.background,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export const createFoodHistoryStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    foodCardRed: {
      backgroundColor: theme.primary,
      borderRadius: 24,
      padding: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
      position: "relative",
    },

    statusBadge: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: theme.secondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },

    statusText: {
      color: theme.background,
      fontSize: 10,
      fontWeight: "600",
    },

    contentRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    productImage: {
      width: 100,
      height: 100,
      borderRadius: 14,
    },

    imagePlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 14,
      backgroundColor: "rgba(255,255,255,0.15)",
      justifyContent: "center",
      alignItems: "center",
    },

    detailsContainer: {
      flex: 1,
    },

    cardTitleWhite: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.background,
      marginBottom: 8,
      paddingRight: 60,
    },

    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    locationTextWhite: {
      fontSize: 12,
      color: "#ffffff",
      opacity: 0.9,
      flex: 1,
    },

    cardDescriptionWhite: {
      fontSize: 13,
      color: "#ffffff",
      opacity: 0.9,
      marginTop: 8,
    },

    priceTextWhite: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#ffffff",
      marginTop: 10,
    },

    buttonRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 18,
    },

    rateButton: {
      flex: 1,
      backgroundColor: theme.warning,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },

    rateButtonText: {
      color: theme.secondary,
      fontSize: 16,
      fontWeight: "bold",
    },

    reOrderButton: {
      flex: 1,
      backgroundColor: theme.secondary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },

    reOrderButtonText: {
      color: theme.background,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export const createOrderDetailsStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surface,
    },

    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surface,
    },

    messageText: {
      fontSize: 14,
      color: theme.textSecondary,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 15,
      backgroundColor: theme.background,
    },

    backBtn: {
      padding: 10,
      borderRadius: 12,
      backgroundColor: theme.surface,
    },

    title: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    content: {
      padding: 20,
      paddingBottom: 40,
    },

    card: {
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,

      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },

    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    label: {
      color: theme.textSecondary,
      fontSize: 13,
    },

    value: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.textPrimary,
    },

    total: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 10,
    },

    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 12,
      color: theme.textPrimary,
    },

    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
    },

    itemName: {
      fontSize: 13,
      color: theme.textPrimary,
    },

    itemQty: {
      fontSize: 13,
      color: theme.textSecondary,
    },

    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },

    badgeText: {
      color: theme.background,
      fontSize: 11,
      fontWeight: "600",
    },

    rateButton: {
      marginTop: 16,
      marginBottom: 20,
      backgroundColor: theme.primary,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 18,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },

    rateButtonText: {
      color: theme.background,
      fontSize: 16,
      fontWeight: "700",
      marginLeft: 8,
    },

    alreadyRatedCard: {
      marginTop: 16,
      marginBottom: 20,
      backgroundColor: theme.success + "20", // subtle success background
      borderWidth: 1,
      borderColor: theme.success,
      borderRadius: 14,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
    },

    alreadyRatedText: {
      marginLeft: 10,
      flex: 1,
      color: theme.success,
      fontSize: 15,
      fontWeight: "600",
    },
  });
