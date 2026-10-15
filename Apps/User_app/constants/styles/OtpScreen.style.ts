
import {
    StyleSheet,
} from "react-native";
import { ThemeColors } from "../theme";

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            justifyContent: "center",
            backgroundColor: theme.background,
        },

        title: {
            fontSize: 24,
            fontWeight: "700",
            textAlign: "center",
            color: theme.textPrimary,
        },

        subtitle: {
            textAlign: "center",
            color: theme.textSecondary,
            marginBottom: 20,
        },

        otpRow: {
            flexDirection: "row",
            justifyContent: "space-between",
        },

        otpBoxContainer: {
            width: 48,
            height: 58,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.surface,
        },

        otpInput: {
            width: "100%",
            height: "100%",
            textAlign: "center",
            fontSize: 20,
            color: theme.textPrimary,
        },

        verifyBtn: {
            backgroundColor: theme.primary,
            padding: 14,
            borderRadius: 12,
            marginTop: 20,
            alignItems: "center",
        },

        disabledBtn: {
            backgroundColor: theme.textSecondary,
        },

        verifyText: {
            color: theme.background,
            fontWeight: "700",
            fontSize: 18,
        },

        resendText: {
            color: theme.primary,
            fontWeight: "600",
            textAlign: "center",
        },
    });
