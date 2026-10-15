import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        loader: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.background,
        },

        container: {
            flex: 1,
            paddingTop: 60,
            backgroundColor: theme.background,
        },

        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 24,
            height: 50,
        },

        headerTitle: {
            fontSize: 24,
            fontWeight: "600",
            color: theme.textPrimary,
        },

        sceneCover: {
            flex: 1,
            gap: 25,
            width: "100%",
            alignSelf: "center",
            backgroundColor: theme.background,
        },

        sceneItem: {
            margin: 27,
            alignItems: "center",
            gap: 10,
        },

        foodContainer: {
            marginHorizontal: 10,
            marginBottom: 20,
        },

        foodImageCover: {
            alignItems: "center",
            borderColor: theme.border,
            borderWidth: 1,
            padding: 15,
            aspectRatio: 1,
            borderRadius: 20,
            marginBottom: 10,
            backgroundColor: theme.surface,
        },

        foodImage: {
            width: "100%",
            height: "100%",
            borderRadius: 20,
        },

        cart: {
            position: "absolute",
            bottom: -10,
            right: 0,
            padding: 8,
            backgroundColor: theme.primary,
            borderRadius: 50,
        },

        foodDetails: {
            gap: 4,
        },

        foodDetailsText: {
            fontWeight: "bold",
            fontSize: 14,
            color: theme.textPrimary,
        },

        emptyContainer: {
            gap: 10,
            flex: 1,
            alignItems: "center",
            padding: 100,
            justifyContent: "center",
        },

        emptyText: {
            fontSize: 16,
            color: theme.textSecondary,
        },
    });