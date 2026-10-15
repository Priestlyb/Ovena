// OrderSuccess.styles.ts (or your existing styles file)

import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({

        container: {
            flex: 1,
            backgroundColor: theme.background,
            paddingHorizontal: 20,
        },


        topSection: {
            alignItems: "center",
            marginTop: 40,
        },


        iconWrapper: {
            width: 90,
            height: 90,
            borderRadius: 45,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            backgroundColor: theme.surface,
            elevation: 5,
        },


        title: {
            fontSize: 22,
            fontWeight: "700",
            color: theme.textPrimary,
        },


        subtitle: {
            fontSize: 14,
            color: theme.textSecondary,
            marginTop: 6,
            textAlign: "center",
        },


        card: {
            backgroundColor: theme.surface,
            marginTop: 30,
            borderRadius: 16,
            padding: 18,
            borderWidth: 1,
            borderColor: theme.border,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 3,
        },


        row: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 10,
        },


        label: {
            color: theme.textSecondary,
            fontSize: 14,
        },


        value: {
            color: theme.textPrimary,
            fontSize: 14,
            fontWeight: "600",
        },


        divider: {
            height: 1,
            backgroundColor: theme.border,
        },


        imageWrapper: {
            alignItems: "center",
            marginTop: 30,
        },


        image: {
            width: 160,
            height: 160,
        },


        button: {
            marginTop: "auto",
            marginBottom: 20,
            backgroundColor: theme.primary,
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: "center",
        },


        buttonText: {
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: "600",
        },


        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.background,
        },


        loadingText: {
            marginTop: 12,
            color: theme.textSecondary,
        },


        header: {
            alignItems: "center",
            marginTop: 30,
            marginBottom: 20,
        },


        successIcon: {
            width: 110,
            height: 110,
            borderRadius: 55,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 18,
            backgroundColor: theme.success,
            elevation: 8,
        },


        cardTitle: {
            fontSize: 17,
            fontWeight: "700",
            color: theme.textPrimary,
            marginBottom: 14,
        },


        statusBadge: {
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
            backgroundColor: theme.surface,
        },


        statusText: {
            fontSize: 12,
            fontWeight: "600",
            textTransform: "capitalize",
            color: theme.textPrimary,
        },


        itemRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },


        itemName: {
            fontSize: 15,
            fontWeight: "600",
            color: theme.textPrimary,
        },


        itemQty: {
            marginTop: 4,
            color: theme.textSecondary,
        },


        itemPrice: {
            fontWeight: "700",
            color: theme.textPrimary,
        },


        step: {
            fontSize: 14,
            color: theme.textSecondary,
            marginBottom: 10,
        },


        footer: {
            gap: 5,
            paddingBottom: 25,
        },


        trackButton: {
            backgroundColor: theme.primary,
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: "center",
            marginBottom: 10,
        },


        trackButtonText: {
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: "700",
        },


        homeButton: {
            backgroundColor: theme.surface,
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.border,
        },


        homeButtonText: {
            color: theme.textPrimary,
            fontSize: 15,
            fontWeight: "700",
        },

    });