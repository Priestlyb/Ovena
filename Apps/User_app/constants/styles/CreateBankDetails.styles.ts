import { StyleSheet } from "react-native";
import {
    ThemeColors,
} from "@/constants/theme";

export const createStyles = (
    theme: ThemeColors
) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 60,
            backgroundColor: theme.background,
        },

        content: {
            padding: 20,
            paddingBottom: 40,
        },

        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
        },

        backButton: {
            width: 42,
            height: 42,
            borderRadius: 21,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            justifyContent: "center",
            alignItems: "center",
        },

        title: {
            fontSize: 22,
            fontWeight: "700",
            color: theme.textPrimary,
        },

        label: {
            fontSize: 15,
            fontWeight: "600",
            marginBottom: 10,
            marginTop: 30,
            color: theme.textPrimary,
        },

        required: {
            fontSize: 16,
            color: theme.error,
            fontWeight: "600",
        },

        helperText: {
            marginTop: 8,
            marginBottom: 20,
            fontSize: 13,
            lineHeight: 18,
            color: theme.textSecondary,
        },

        input: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            paddingHorizontal: 15,
            height: 54,
            fontSize: 16,
            color: theme.textPrimary,
            backgroundColor: theme.surface,
        },

        inputPin: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            paddingHorizontal: 15,
            height: 54,
            fontSize: 16,
            textAlign: "center",
            color: theme.textPrimary,
            backgroundColor: theme.surface,
        },

        button: {
            marginTop: 36,
            height: 56,
            borderRadius: 14,
            backgroundColor: theme.primary,
            justifyContent: "center",
            alignItems: "center",
        },

        buttonDisabled: {
            opacity: 0.6,
        },

        buttonText: {
            color: "#FFF",
            fontSize: 16,
            fontWeight: "700",
        },
    });