import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },

        keyboardContainer: {
            flex: 1,
        },

        emptyContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.background,
        },

        emptyText: {
            color: theme.textSecondary,
            fontSize: 16,
        },

        titleColumn: {
            flexDirection: "column",
            gap: 10,
        },

        variantGroup: {
            marginBottom: 25,
        },

        backButton: {
            position: "absolute",
            top: 65,
            left: 20,
            backgroundColor: theme.surface,
            padding: 8,
            borderRadius: 20,
        },

        menuButton: {
            position: "absolute",
            top: 65,
            right: 20,
            backgroundColor: theme.surface,
            padding: 8,
            borderRadius: 20,
        },

        productImage: {
            width: "100%",
            height: 275,
        },

        fallbackIcon: {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.surface,
        },

        scrollContent: {
            flex: 1,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            backgroundColor: theme.background,
            marginTop: -50,
            paddingTop: 24,
        },

        productSection: {
            padding: 20,
            paddingBottom: 40,
        },

        productTitleRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            gap: 12,
        },

        productTitle: {
            flex: 1,
            fontSize: 24,
            fontWeight: "400",
            color: theme.textPrimary,
        },

        productPrice: {
            flex: 1,
            fontSize: 24,
            fontWeight: "700",
            color: theme.primary,
        },

        productDesc: {
            fontSize: 14,
            color: theme.textSecondary,
            lineHeight: 22,
            marginVertical: 20,
            textAlign: "justify",
        },

        nutritionGrid: {
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 20,
        },

        sectionDivider: {
            height: 1,
            backgroundColor: theme.border,
            marginVertical: 20,
        },

        sectionTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.textPrimary,
            marginBottom: 16,
        },

        notesInput: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 10,
            padding: 14,
            minHeight: 100,
            fontSize: 14,
            color: theme.textPrimary,
            textAlignVertical: "top",
            marginBottom: 24,
            backgroundColor: theme.surface,
        },

        notesPlaceholder: {
            color: theme.textSecondary,
        },
    });