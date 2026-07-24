import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FB",
        paddingTop: 55,
    },

    content: {
        padding: 20,
        paddingBottom: 50,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: 30,
        fontWeight: "800",
        color: "#111827",
    },

    subtitle: {
        marginTop: 6,
        marginBottom: 24,
        color: "#6B7280",
        fontSize: 15,
    },

    planCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 22,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#ECECEC",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 3,
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    planName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
        flex: 1,
    },

    audienceBadge: {
        backgroundColor: "#FFF1EB",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },

    audienceText: {
        color: "#FF5920",
        fontWeight: "600",
        fontSize: 12,
        textTransform: "capitalize",
    },

    price: {
        fontSize: 38,
        fontWeight: "800",
        color: "#111827",
        marginTop: 18,
    },

    interval: {
        color: "#6B7280",
        marginTop: 4,
        fontSize: 14,
    },

    description: {
        marginTop: 18,
        fontSize: 15,
        lineHeight: 24,
        color: "#4B5563",
    },

    infoRow: {
        flexDirection: "row",
        marginTop: 18,
    },

    infoChip: {
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        marginRight: 10,
    },

    infoChipText: {
        color: "#374151",
        fontWeight: "600",
        textTransform: "capitalize",
    },

    button: {
        marginTop: 24,
        backgroundColor: "#FF5920",
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 52,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    errorCard: {
        backgroundColor: "#FEE2E2",
        padding: 14,
        borderRadius: 12,
        marginBottom: 16,
    },

    errorText: {
        color: "#B91C1C",
        fontSize: 14,
    },

    emptyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
    },

    emptyText: {
        color: "#6B7280",
        fontSize: 15,
    },
});