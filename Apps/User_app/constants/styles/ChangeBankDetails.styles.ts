import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (
    theme: ThemeColors
) =>
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

        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
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

        subtitle: {
            fontSize: 15,
            lineHeight: 22,
            color: theme.textSecondary,
            marginBottom: 30,
        },

        label: {
            fontSize: 15,
            fontWeight: "600",
            color: theme.textPrimary,
            marginBottom: 8,
            marginTop: 16,
        },

        otpInput: {
            height: 54,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            paddingHorizontal: 15,
            fontSize: 16,
            textAlign: "center",
            backgroundColor: theme.surface,
            color: theme.textPrimary,
        },

        input: {
            height: 54,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            paddingHorizontal: 15,
            fontSize: 16,
            backgroundColor: theme.surface,
            color: theme.textPrimary,
        },

        button: {
            marginTop: 36,
            height: 56,
            borderRadius: 14,
            backgroundColor: theme.primary,
            justifyContent: "center",
            alignItems: "center",

            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 6,
        },

        buttonDisabled: {
            opacity: 0.65,
        },

        buttonText: {
            color: "#FFF",
            fontSize: 16,
            fontWeight: "700",
        },
    });