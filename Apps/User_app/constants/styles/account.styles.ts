import { StyleSheet } from "react-native";
import type { ThemeColors } from "@/constants/theme";

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 60,
            gap: 25,
            backgroundColor: theme.background,
        },

        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            paddingHorizontal: 20,
        },

        backButton: {
            padding: 10,
            borderWidth: 1,
            borderRadius: 50,
            borderColor: theme.border,
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

        accountContainer: {
            gap: 5,
        },

        row: {
            paddingHorizontal: 30,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },

        rowText: {
            fontSize: 18,
            color: theme.textPrimary,
        },

        usernameWrapper: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            flex: 1,
        },

        input: {
            borderBottomWidth: 1,
            borderColor: theme.border,
            color: theme.textPrimary,
            fontSize: 18,
            flex: 1,
            paddingVertical: 4,
            marginRight: 10,
        },

        blurPlaceholder: {
            flex: 1,
            height: 18,
            borderRadius: 4,
            backgroundColor: theme.border,
            opacity: 0.3,
        },

        actionButtons: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },

        actionButton: {
            width: 38,
            height: 38,
            borderRadius: 19,
            justifyContent: "center",
            alignItems: "center",
        },

        confirmButton: {
            backgroundColor: theme.success,
        },

        cancelButton: {
            backgroundColor: theme.error,
        },
    });