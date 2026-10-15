import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";


export const createStyles = (
    theme: ThemeColors,
) =>
    StyleSheet.create({

        cartItemContainer: {
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
            backgroundColor: theme.background,
        },


        cartItemContent: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
        },


        cartItemImage: {
            width: 75,
            height: 75,
            backgroundColor: theme.surface,
            borderRadius: 10,
            marginRight: 12,
        },


        cartItemDetails: {
            flex: 1,
            justifyContent: "center",
        },


        cartItemName: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.textPrimary,
            marginBottom: 4,
        },


        cartItemRestaurant: {
            fontSize: 15,
            color: theme.textSecondary,
        },


        optionText: {
            fontSize: 12,
            color: theme.textSecondary,
            marginTop: 3,
        },


        lineTotal: {
            marginTop: 6,
            fontSize: 16,
            fontWeight: "700",
            color: theme.textPrimary,
        },


        cartItemActions: {
            flexDirection: "row",
            justifyContent: "flex-end",
        },


        deleteIconButton: {
            padding: 8,
        },

    });