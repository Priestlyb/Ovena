import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingTop: 55,
      backgroundColor: theme.background,
    },

    headerContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
      paddingHorizontal: 10,
      paddingVertical: 10,
    },

    backButton: {
      padding: 10,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 50,
      backgroundColor: theme.surface,
    },

    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.textPrimary,
    },

    summaryCard: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 15,
      marginBottom: 20,
    },

    summaryTitle: {
      color: "#FFFFFF",
      fontSize: 12,
    },

    summaryPoints: {
      color: "#FFFFFF",
      fontSize: 22,
      fontWeight: "700",
    },

    tabContainer: {
      width: "100%",
      flexDirection: "row",
      backgroundColor: theme.surface,
      borderRadius: 14,
      marginBottom: 20,
      padding: 4,
      position: "relative",
      borderWidth: 1,
      borderColor: theme.border,
    },

    indicator: {
      position: "absolute",
      top: 4,
      bottom: 4,
      left: 4,
      backgroundColor: theme.primary,
      borderRadius: 10,
    },

    tab: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
      height: 42,
    },

    tabText: {
      color: theme.textSecondary,
      fontWeight: "600",
    },

    activeTabText: {
      color: "#FFFFFF",
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
      color: theme.textPrimary,
    },

    codeBox: {
      width: "85%",
      backgroundColor: theme.surface,
      padding: 20,
      borderRadius: 20,
      alignItems: "center",
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },

    codeLabel: {
      fontSize: 12,
      color: theme.textSecondary,
    },

    code: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.primary,
    },

    info: {
      width: "100%",
      backgroundColor: theme.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },

    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 20,
      gap: 10,
    },

    infoTitle: {
      fontWeight: "600",
      color: theme.textPrimary,
    },

    infoText: {
      color: theme.textSecondary,
      fontSize: 12,
    },

    userItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 15,
      paddingHorizontal: 12,
      backgroundColor: theme.surface,
      borderRadius: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },

    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.decorCircle,
      marginRight: 10,
    },

    name: {
      fontWeight: "600",
      color: theme.textPrimary,
    },

    sub: {
      fontSize: 12,
      color: theme.textSecondary,
    },

    points: {
      fontWeight: "600",
      color: theme.primary,
    },

    button: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 30,
      alignItems: "center",
    },

    buttonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  });