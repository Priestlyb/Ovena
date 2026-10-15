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
        },


        backButton: {
            position: "absolute",
            top: 65,
            left: 20,
            backgroundColor: theme.surface,
            padding: 8,
            borderRadius: 20,
        },


        productImage: {
            width: "100%",
            height: 275,
        },


        scrollContent: {
            flex: 1,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            backgroundColor: theme.background,
            marginTop: -50,
            paddingVertical: 24,
        },


        productSection: {
            padding: 20,
            paddingBottom: 40,
        },


        productTitleRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 50,
            gap: 12,
        },


        productTitle: {
            flex: 1,
            fontSize: 24,
            fontWeight: "700",
            color: theme.textPrimary,
        },


        addonsScrollContent: {
            paddingLeft: 16,
        },


        addonCard: {
            width: "auto",
            marginRight: 30,
            alignItems: "center",
            gap: 5,
        },


        addonImage: {
            width: 100,
            height: 100,
            borderRadius: 10,
        },


        addonInfoRow: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            gap: 5,
            marginTop: 5,
        },


        addonCounterRow: {
            flexDirection: "row",
            gap: 15,
            padding: 10,
            borderRadius: 20,
            backgroundColor: theme.surface,
        },


        addonText: {
            fontWeight: "700",
            textAlign: "center",
            color: theme.textPrimary,
        },


        addonIncrement: {
            color: theme.background,
            fontSize: 15,
            textAlign: "center",
            fontWeight: "700",
            paddingHorizontal: 10,
            borderRadius: 50,
            backgroundColor: theme.primary,
        },


        summaryBox: {
            backgroundColor: theme.surface,
            padding: 20,
            borderRadius: 12,
            marginTop: 25,
            marginBottom: 50,
        },


        summaryTitle: {
            fontSize: 16,
            fontWeight: "800",
            marginBottom: 10,
            color: theme.textPrimary,
        },


        sectionSpacing: {
            marginTop: 25,
        },


        row: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 4,
        },


        finalRow: {
            marginTop: 10,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            paddingTop: 10,
        },


        subTitle: {
            marginTop: 10,
            fontWeight: "700",
            color: theme.textPrimary,
        },

        summaryText: {
            fontSize: 14,
            color: theme.textSecondary,
        },

        totalText: {
            fontSize: 16,
            fontWeight: "800",
            color: theme.textPrimary,
        },

    });