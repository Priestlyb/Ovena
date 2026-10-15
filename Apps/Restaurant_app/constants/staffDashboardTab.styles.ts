// constants/styles/dashboardTab.styles.ts

import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const CARD_WIDTH = SCREEN_WIDTH - 32;

export const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    safeArea: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: 50,
    },
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    scrollContent: {
        paddingBottom: 120,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#000",
        marginBottom: 4,
    },
    welcomeText: {
        fontSize: 14,
        color: "#666",
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
    },
    periodsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 16,
        marginBottom: 16,
        gap: 15,
    },
    periodChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
        borderWidth: 1,
        marginVertical: 20,
        borderColor: "#E5E7EB",
    },
    activePeriodChip: {
        backgroundColor: "#FF6B35",
        borderColor: "#FF6B35",
    },
    periodText: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
    },
    activePeriodText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    statsScrollContainer: {
        paddingRight: 16,
    },
    cardWrapper: {
        width: CARD_WIDTH,
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginTop: 24,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#DDD",
    },
    activeDot: {
        width: 24,
        backgroundColor: "#FF6B35",
    },
});