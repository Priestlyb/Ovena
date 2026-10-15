import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 55,
            backgroundColor: theme.background,
        },

        scrollContainer: {
            paddingBottom: 20,
        },

        header: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 50,
            marginBottom: 20,
            paddingHorizontal: 20,
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

        headerSpacer: {
            width: 34,
        },

        loadingContainer: {
            marginTop: 40,
            alignItems: "center",
            justifyContent: "center",
        },

        cardRow: {
            paddingRight: 30,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: theme.border,
            backgroundColor: theme.background,
        },

        cardLeft: {
            paddingHorizontal: 30,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flex: 1,
        },

        cardText: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.textPrimary,
        },

        accountName: {
            marginTop: 4,
            fontSize: 14,
            color: theme.textSecondary,
        },

        accountNumber: {
            marginTop: 2,
            fontSize: 14,
            color: theme.textSecondary,
        },

        /* ==========================
              MODAL
        ========================== */

        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
        },

        modalContainer: {
            width: "100%",
            backgroundColor: theme.surface,
            borderRadius: 24,
            paddingHorizontal: 24,
            paddingVertical: 28,
            alignItems: "center",

            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 8,
            },
            shadowOpacity: 0.18,
            shadowRadius: 18,
            elevation: 10,
        },

        modalTitle: {
            marginTop: 16,
            fontSize: 22,
            fontWeight: "700",
            color: theme.textPrimary,
            textAlign: "center",
        },

        modalDescription: {
            marginTop: 10,
            fontSize: 15,
            lineHeight: 22,
            color: theme.textSecondary,
            textAlign: "center",
            paddingHorizontal: 10,
        },

        pinInput: {
            width: "100%",
            marginTop: 24,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 14,
            paddingHorizontal: 18,
            fontSize: 18,
            backgroundColor: theme.background,
            color: theme.textPrimary,
            textAlign: "center",
        },

        modalButtons: {
            flexDirection: "row",
            width: "100%",
            marginTop: 28,
            gap: 12,
        },

        cancelButton: {
            flex: 1,
            height: 52,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.border,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.background,
        },

        cancelButtonText: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.textPrimary,
        },

        continueButton: {
            flex: 1,
            height: 52,
            borderRadius: 14,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.primary,
        },

        continueButtonText: {
            color: "#FFF",
            fontSize: 16,
            fontWeight: "700",
        },

        disabledButton: {
            opacity: 0.65,
        },
    });