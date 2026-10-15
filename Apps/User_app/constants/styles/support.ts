import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

/* =========================================
   STYLES
========================================= */

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 50,
            backgroundColor: theme.background,
        },

        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            paddingHorizontal: 16,
            paddingBottom: 16,
        },

        headerTitle: {
            fontSize: 18,
            fontWeight: "700",
            color: theme.textPrimary,
        },

        messageHeaderTitle: {
            width: "20%",
            textAlign: "center",
            fontSize: 18,
            fontWeight: "700",
            textTransform: "capitalize",
            color: theme.textPrimary,
        },

        card: {
            backgroundColor: theme.surface,
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,

            borderWidth: 1,
            borderColor: theme.border,
        },

        subject: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.textPrimary,
        },

        description: {
            marginTop: 8,
            color: theme.textSecondary,
        },

        meta: {
            fontSize: 12,
            color: theme.textSecondary,
            marginTop: 4,
        },

        rowBetween: {
            flexDirection: "row",
            justifyContent: "space-between",
        },

        priorityBadge: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
        },

        priorityText: {
            color: "#FFFFFF",
            fontSize: 10,
            fontWeight: "600",
        },

        messageRow: {
            marginBottom: 10,
        },

        alignRight: {
            alignItems: "flex-end",
        },

        alignLeft: {
            alignItems: "flex-start",
        },

        bubble: {
            padding: 10,
            borderRadius: 12,
            maxWidth: "75%",
        },

        userBubble: {
            backgroundColor: theme.primary,
        },

        agentBubble: {
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
        },

        userText: {
            color: "#FFFFFF",
        },

        agentText: {
            color: theme.textPrimary,
        },

        inputWrapper: {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            backgroundColor: theme.background,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            marginBottom: 40,
        },

        input: {
            flex: 1,
            backgroundColor: theme.surface,
            borderRadius: 8,
            padding: 10,
            color: theme.textPrimary,
            borderWidth: 1,
            borderColor: theme.border,
        },

        sendBtn: {
            backgroundColor: theme.primary,
            padding: 10,
            borderRadius: 8,
            marginLeft: 8,
            justifyContent: "center",
            alignItems: "center",
        },
    });