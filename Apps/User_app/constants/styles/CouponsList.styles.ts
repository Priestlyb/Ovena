import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        loader: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 60,
        },

        container: {
            flexGrow: 1,
            alignItems: "center",
            paddingTop: 55,
            paddingBottom: 40,
            paddingHorizontal: 20,
            backgroundColor: theme.background,
        },

        header: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
        },

        backBtn: {
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
        },

        title: {
            fontSize: 24,
            fontWeight: "700",
            color: theme.textPrimary,
        },

        historyText: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.primary,
            borderBottomWidth: 2,
            borderBottomColor: theme.secondary,
            paddingBottom: 2,
        },

        couponsContainer: {
            width: "100%",
            marginTop: 30,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 55,
            paddingBottom: 24,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
            position: "relative",
        },

        couponNoteText: {
            fontSize: 16,
            fontWeight: "500",
            textTransform: "capitalize",
            textAlign: "center",
            color: theme.textPrimary,
            lineHeight: 24,
        },

        couponExpireDate: {
            position: "absolute",
            top: 12,
            right: 12,
            fontSize: 12,
            fontWeight: "600",
            color: "#FFFFFF",
            backgroundColor: theme.textPrimary,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 20,
            overflow: "hidden",
        },

        couponCode: {
            width: "100%",
            textAlign: "center",
            fontSize: 18,
            fontWeight: "700",
            textTransform: "uppercase",
            color: "#FFFFFF",
            backgroundColor: theme.primary,
            paddingVertical: 16,
            borderRadius: 14,
            marginTop: 12,
            letterSpacing: 1,
        },
    });