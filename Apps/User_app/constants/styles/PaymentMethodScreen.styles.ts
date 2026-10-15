import {
    StyleSheet,
} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },

    header: {
        height: 60,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
    },

    headerSpacer: {
        width: 42,
    },

    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 25,
    },

    title: {
        fontSize: 25,
        fontWeight: "700",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 30,
    },

    optionsContainer: {
        gap: 15,
    },

    paymentCard: {
        minHeight: 105,
        borderWidth: 1.5,
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
    },

    selectedCard: {
        borderWidth: 2,
    },

    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    paymentInfo: {
        flex: 1,
        paddingRight: 10,
    },

    paymentTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 5,
    },

    paymentDescription: {
        fontSize: 12,
        lineHeight: 18,
    },

    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },

    radioInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
    },

    continueButton: {
        height: 54,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginTop: "auto",
        marginBottom: 25,
    },

    continueText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});