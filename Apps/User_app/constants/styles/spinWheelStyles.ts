import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            paddingTop: 60,
            backgroundColor: theme.background,
        },

        header: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
        },

        backBtn: {
            padding: 10,
            borderWidth: 1,
            borderRadius: 50,
            borderColor: theme.border,
            backgroundColor: theme.surface,
        },

        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.textPrimary,
        },

        wheelContainer: {
            marginVertical: 20,
        },

        pointerWrapper: {
            position: "absolute",
            top: 130,
            zIndex: 10,
        },

        pointer: {
            width: 0,
            height: 0,
            borderLeftWidth: 12,
            borderRightWidth: 12,
            borderBottomWidth: 22,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: theme.textPrimary,
        },

        spinButton: {
            backgroundColor: theme.primary,
            paddingVertical: 14,
            paddingHorizontal: 50,
            borderRadius: 30,
            marginVertical: 35,

            shadowColor: theme.primary,
            shadowOffset: {
                width: 0,
                height: 8,
            },
            shadowOpacity: 0.35,
            shadowRadius: 10,

            elevation: 8,
        },

        spinText: {
            fontSize: 16,
            fontWeight: "700",
            color: "#FFFFFF",
        },

        viewCouponsText: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.textPrimary,
            borderBottomWidth: 2,
            borderBottomColor: "#F6D44F",
        },

        couponNote: {
            height: 200,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,

            borderTopLeftRadius: 200,
            borderTopRightRadius: 200,

            backgroundColor: "#FFBC44",

            justifyContent: "center",
            alignItems: "center",

            paddingHorizontal: 60,
        },

        couponNoteText: {
            fontSize: 16,
            fontWeight: "500",
            textAlign: "center",
            color: theme.textPrimary,
        },

        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
        },

        modalCard: {
            width: "80%",
            backgroundColor: theme.surface,
            padding: 30,
            borderRadius: 20,
            alignItems: "center",

            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 5,
            },
            shadowOpacity: 0.15,
            shadowRadius: 10,

            elevation: 6,
        },

        modalTitle: {
            fontSize: 22,
            fontWeight: "bold",
            color: theme.textPrimary,
        },

        modalReward: {
            fontSize: 18,
            textAlign: "center",
            marginVertical: 15,
            fontWeight: "600",
            color: theme.primary,
        },

        claimBtn: {
            backgroundColor: theme.primary,
            padding: 12,
            borderRadius: 20,
        },

        rulesTitle: {
            fontSize: 16,
            fontWeight: "700",
            marginVertical: 15,
            color: theme.textPrimary,
        },

        rulesText: {
            fontSize: 13,
            color: theme.textSecondary,
            textAlign: "center",
            marginHorizontal: 25,
            marginVertical: 5,
        },
    });