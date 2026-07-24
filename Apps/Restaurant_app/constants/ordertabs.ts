import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: 50,
    },
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        alignItems: "center",
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#000",
    },

    typeTabsContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
        display: "none",
    },

    filtersContainer: {
        paddingLeft: 16,
    },

    historyFiltersContainer: {
        paddingLeft: 16,
        marginTop: -8,
    },

    scrollView: { flex: 1 },

    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },

    loadingText: {
        textAlign: "center",
        marginTop: 32,
    },

    emptyText: {
        textAlign: "center",
        marginTop: 32,
    },
});