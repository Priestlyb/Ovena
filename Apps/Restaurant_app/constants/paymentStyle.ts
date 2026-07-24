// ================= STYLES =================

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        paddingVertical: 55,
        backgroundColor: "#fff",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        padding: 20,
        borderRadius: 12,
        backgroundColor: "#f5f5f5",
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    row: {
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        color: "#777",
    },
    value: {
        fontSize: 16,
        fontWeight: "600",
    },
    actions: {
        flexDirection: "row",
        marginTop: 20,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
        flex: 1,
        justifyContent: "center",
    },
    cancel: {
        backgroundColor: "#999",
        marginRight: 10,
    },
    save: {
        backgroundColor: "#FF5920",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 40,
        backgroundColor: "#FF5920",
        padding: 16,
        borderRadius: 50,
    },
});