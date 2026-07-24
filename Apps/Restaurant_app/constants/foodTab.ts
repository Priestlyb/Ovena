import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 55,
        paddingRight: 20,
        paddingLeft: 20,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },

    title: {
        fontSize: 22,
        fontWeight: "600",
    },

    searchInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginVertical: 10,
    },

    actions: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 15,
        gap: 10,
    },

    selectAllBtn: {
        borderWidth: 1,
        borderStyle: "dashed",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    outOfStockBtn: {
        backgroundColor: "rgba(255,89,32,0.7)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    card: {
        height: 95,
        flexDirection: "row",
        backgroundColor: "#F5F5F5",
        padding: 12,
        borderRadius: 15,
        marginVertical: 15,
        alignItems: "center",
    },

    image: {
        width: 50,
        height: 50,
        backgroundColor: "#eee",
        borderRadius: 10,
        marginRight: 10,
    },

    productName: {
        fontWeight: "600",
    },

    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 4,
    },

    inStock: {
        color: "#fff",
        fontSize: 12,
        padding: 6,
        borderRadius: 10,
    },

    cardActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    editBtn: {
        padding: 6,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffb47e40",
    },

    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: "#333",
    },

    checked: {
        backgroundColor: "#F84E10",
    },

    fab: {
        position: "absolute",
        bottom: 100,
        right: 20,
        backgroundColor: "#000",
        padding: 16,
        borderRadius: 50,
    },

    chatFab: {
        position: 'absolute',
        bottom: 65,
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FF5722',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});