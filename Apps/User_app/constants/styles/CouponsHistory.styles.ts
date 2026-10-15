import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
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

        couponsContainer: {
            width: "100%",
            borderRadius: 18,
            paddingHorizontal: 20,
            paddingVertical: 24,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
        },

        couponNoteText: {
            fontSize: 16,
            fontWeight: "500",
            textAlign: "center",
            textTransform: "capitalize",
            lineHeight: 24,
            color: theme.textSecondary,
        },

        couponCode: {
            width: "100%",
            marginTop: 12,
            paddingVertical: 15,
            borderRadius: 14,
            borderWidth: 1,
            textAlign: "center",
            fontSize: 18,
            fontWeight: "700",
            textTransform: "capitalize",
            overflow: "hidden",
        },

        used: {
            backgroundColor: "#E6F7EE",
            borderColor: "#1B8A4B",
            color: "#1B8A4B",
        },

        expired: {
            backgroundColor: "#FDECEC",
            borderColor: "#C62828",
            color: "#C62828",
        },
    });