import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";


export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        scrollContent: {
            flexGrow: 1,
            backgroundColor: theme.background,
            paddingBottom: 30,
        },


        container: {
            backgroundColor: theme.background,
        },

        categoryScroll: {
            marginVertical: 30,
            marginLeft: 10,
        },



        categoryChip: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
            marginHorizontal: 8,
        },


        activeCategoryChip: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
        },


        categoryText: {
            fontSize: 14,
            fontWeight: "500",
            color: theme.textPrimary,
        },


        activeCategoryText: {
            color: theme.background,
        },

        loader: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.background,
        },


        headerImage: {
            width: "100%",
            height: 300,
        },


        headerImagePlaceholder: {
            backgroundColor: theme.surface,
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


        menuButton: {
            position: "absolute",
            top: 65,
            right: 20,
            backgroundColor: theme.surface,
            padding: 8,
            borderRadius: 20,
        },


        contentContainer: {
            alignItems: "center",
            borderTopLeftRadius: 150,
            borderTopRightRadius: 150,
            backgroundColor: theme.background,
            paddingTop: 50,
            paddingBottom: 25,
            marginTop: -160,
        },


        businessName: {
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 10,
            color: theme.textPrimary,
        },

        section: {
            width: "100%",
            marginTop: 25,
            flexDirection: "column",
        },


        sectionHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            marginHorizontal: 16,
        },


        sectionTitle: {
            fontSize: 18,
            fontWeight: "700",
            color: theme.textPrimary,
        },


        seeAllText: {
            color: theme.primary,
            fontWeight: "600",
        },


        promoCard: {
            width: 160,
            marginRight: 16,
            marginBottom: 25,
            borderRadius: 12,
            padding: 8,
            backgroundColor: theme.surface,
        },


        firstPromoCard: {
            marginLeft: 16,
        },


        promoImage: {
            height: 100,
            backgroundColor: theme.border,
            borderRadius: 12,
            marginBottom: 8,
        },

        itemTitle: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.textPrimary,
        },


        promoCardDescription: {
            fontSize: 12,
            fontWeight: "400",
            color: theme.textSecondary,
        },

        price: {
            fontSize: 14,
            fontWeight: "700",
            marginTop: 4,
            color: theme.textPrimary,
        },

        addonsGroupContainer: {
            marginHorizontal: 16,
        },

        addonsFilterScroll: {
            marginBottom: 20,
            paddingLeft: 16,
        },


        addonsItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 12,
            borderRadius: 20,
            marginVertical: 15,
        },


        addonsTitle: {
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 25,
            color: theme.textPrimary,
        },


        addonsImage: {
            width: 110,
            height: 110,
            backgroundColor: theme.surface,
            borderRadius: 20,
        },


        addonsInfo: {
            width: 150,
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 50,
            textAlign: "right",
        },


        addonsName: {
            fontSize: 15,
            fontWeight: "700",
            textAlign: "right",
            color: theme.textPrimary,
        },


        addonsDescription: {
            fontSize: 12,
            fontWeight: "400",
            color: theme.textSecondary,
        },

        addonActions: {
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 50,
        },


        locationText: {
            fontSize: 14,
            color: theme.textSecondary,
            marginBottom: 10,
            textTransform: "capitalize",
        },


        statsRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            width: "50%",
        },


        statItem: {
            alignItems: "center",
            marginTop: 20,
        },


        statText: {
            fontSize: 12,
            color: theme.textPrimary,
            marginTop: 4,
        },


        openText: {
            fontSize: 15,
            color: theme.textPrimary,
            marginTop: 20,
        },

        addonsContainer: {
            marginVertical: 25
        },

    });