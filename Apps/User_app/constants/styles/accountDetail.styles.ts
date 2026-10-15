import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },

        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
            backgroundColor: theme.background,
        },

        loadingText: {
            marginTop: 18,
            fontSize: 15,
            fontWeight: "500",
            color: theme.textPrimary,
        },

        errorCircle: {
            width: 82,
            height: 82,
            borderRadius: 41,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            backgroundColor: theme.surface,
        },

        errorTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: theme.textPrimary,
        },

        errorSubtitle: {
            marginTop: 8,
            textAlign: "center",
            fontSize: 15,
            lineHeight: 22,
            color: theme.textSecondary,
        },

        retryButton: {
            marginTop: 28,
            paddingHorizontal: 30,
            paddingVertical: 14,
            borderRadius: 14,
            backgroundColor: theme.primary,
        },

        retryText: {
            color: "#FFFFFF",
            fontWeight: "700",
            fontSize: 16,
        },

        header: {
            paddingTop: 50,
            paddingBottom: 36,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            alignItems: "center",
            marginBottom: 24,
            backgroundColor: theme.primary,
        },

        avatar: {
            width: 92,
            height: 92,
            borderRadius: 46,
            backgroundColor: "rgba(255,255,255,0.18)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 18,
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.25)",
        },

        avatarText: {
            fontSize: 32,
            fontWeight: "800",
            color: "#FFFFFF",
        },

        name: {
            color: "#FFFFFF",
            fontSize: 24,
            fontWeight: "700",
        },

        roleBadge: {
            marginTop: 12,
            backgroundColor: "rgba(255,255,255,0.18)",
            paddingHorizontal: 18,
            paddingVertical: 7,
            borderRadius: 30,
        },

        roleText: {
            color: "#FFFFFF",
            fontWeight: "700",
            fontSize: 12,
            letterSpacing: 1,
        },

        contactContainer: {
            marginTop: 22,
            width: "100%",
            paddingHorizontal: 30,
        },

        contactRow: {
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 5,
        },

        contactText: {
            color: "#FFFFFF",
            marginLeft: 10,
            fontSize: 15,
            flex: 1,
        },

        sectionTitle: {
            marginHorizontal: 18,
            marginBottom: 10,
            marginTop: 8,
            fontWeight: "700",
            fontSize: 12,
            letterSpacing: 1,
            color: theme.textSecondary,
        },

        card: {
            marginHorizontal: 18,
            marginBottom: 22,
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: theme.surface,

            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 8,
            shadowOffset: {
                width: 0,
                height: 3,
            },
        },

        row: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 18,
            paddingVertical: 18,
        },

        iconWrapper: {
            width: 46,
            height: 46,
            borderRadius: 23,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: `${theme.primary}15`,
        },

        rowContent: {
            flex: 1,
            marginLeft: 14,
        },

        rowTitle: {
            fontSize: 13,
            marginBottom: 4,
            color: theme.textSecondary,
        },

        rowValue: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.textPrimary,
        },

        statusBadge: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 30,
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: `${theme.success}20`,
        },

        statusDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginRight: 6,
            backgroundColor: theme.success,
        },

        statusText: {
            fontWeight: "700",
            fontSize: 12,
            color: theme.success,
        },
    });