import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 60,
            backgroundColor: theme.background,
        },

        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginBottom: 20,
        },

        backBtn: {
            padding: 10,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 50,
        },

        deleteBtn: {
            padding: 10,
            backgroundColor: theme.surface,
            borderRadius: 50,
        },

        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.textPrimary,
        },

        cartSubheader: {
            padding: 16,
            fontSize: 13,
            color: theme.textSecondary,
            backgroundColor: theme.surface,
        },

        cartListContainer: {
            flex: 1,
        },

        cartListContent: {
            paddingBottom: 10,
        },

        addMoreItemsButton: {
            padding: 16,
            alignItems: "flex-end",
        },

        addMoreItemsText: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.textPrimary,
            backgroundColor: theme.surface,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
        },

        orderSummaryCard: {
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            backgroundColor: theme.background,
        },

        orderSummaryHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },

        orderSummaryTitle: {
            fontSize: 16,
            fontWeight: "bold",
            color: theme.textPrimary,
        },

        summaryHeaderRight: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },

        summaryHeaderTotal: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.textPrimary,
        },

        summaryContent: {
            marginTop: 16,
        },

        summaryLine: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
        },

        summaryRight: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
        },

        summaryLineLabel: {
            fontSize: 14,
            color: theme.textSecondary,
        },

        summaryLineValue: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.textPrimary,
        },

        summaryDivider: {
            height: 1,
            backgroundColor: theme.border,
            marginVertical: 12,
        },

        summaryTotalLabel: {
            fontSize: 16,
            fontWeight: "bold",
            color: theme.textPrimary,
        },

        summaryTotalValue: {
            fontSize: 16,
            fontWeight: "bold",
            color: theme.textPrimary,
        },

        collapsedTotalRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 12,
        },

        breakdownContainer: {
            paddingLeft: 10,
            marginBottom: 10,
        },

        breakdownItem: {
            marginBottom: 12,
        },

        breakdownTitle: {
            fontWeight: "600",
            color: theme.textPrimary,
        },

        breakdownText: {
            fontSize: 12,
            color: theme.textSecondary,
            marginTop: 4,
        },

        breakdownSubtotal: {
            marginTop: 4,
            fontWeight: "600",
            color: theme.textPrimary,
        },

        bottomButtonContainer: {
            padding: 16,
            paddingBottom: 24,
            backgroundColor: theme.background,
        },

        invalidBranchText: {
            color: theme.textPrimary,
            fontSize: 16,
            textAlign: "center",
        },
    });