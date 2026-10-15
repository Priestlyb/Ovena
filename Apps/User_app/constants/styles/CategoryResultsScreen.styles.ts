
import {
    StyleSheet
} from "react-native";
/* =========================================
   STYLES
========================================= */

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    backgroundCircleOne: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: 130,
        top: -120,
        right: -100,
        opacity: 0.6,
    },

    backgroundCircleTwo: {
        position: "absolute",
        width: 180,
        height: 180,
        borderRadius: 90,
        bottom: 100,
        left: -120,
        opacity: 0.35,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 65,
        paddingBottom: 18,
    },

    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitleContainer: {
        flex: 1,
        marginLeft: 14,
    },

    titleAccent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginBottom: 2,
    },

    eyebrow: {
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 1.5,
    },

    headerTitle: {
        fontSize: 25,
        fontWeight: "800",
        letterSpacing: -0.6,
    },

    locationButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },

    locationBanner: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 20,
        padding: 13,
        borderRadius: 18,
        borderWidth: 1,
        marginVertical: 10,
    },

    locationIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    locationTextContainer: {
        flex: 1,
        marginLeft: 11,
    },

    locationLabel: {
        fontSize: 8,
        fontWeight: "800",
        letterSpacing: 1.2,
        marginBottom: 3,
    },

    locationDescription: {
        fontSize: 12,
        fontWeight: "500",
    },

    liveIndicator: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginRight: 3,
    },

    resultsHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 14,
    },

    resultsTitle: {
        fontSize: 19,
        fontWeight: "800",
    },

    resultsSubtitle: {
        fontSize: 12,
        marginTop: 3,
    },

    countBadge: {
        minWidth: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    countText: {
        fontSize: 14,
        fontWeight: "800",
    },

    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    emptyListContent: {
        flexGrow: 1,
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 120,
        borderRadius: 22,
        borderWidth: 1,
        marginBottom: 13,
        padding: 15,
        overflow: "hidden",
    },

    cardGlow: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50,
        top: -55,
        right: -30,
        opacity: 0.7,
    },

    indexBadge: {
        width: 38,
        height: 38,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    indexText: {
        fontSize: 10,
        fontWeight: "800",
    },

    cardContent: {
        flex: 1,
        marginLeft: 13,
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    titleContainer: {
        flex: 1,
        marginLeft: 10,
    },

    businessName: {
        fontSize: 16,
        fontWeight: "800",
    },

    categoryRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        gap: 4,
    },

    categoryText: {
        fontSize: 11,
        fontWeight: "500",
    },

    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
    },

    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        flex: 1,
    },

    metaText: {
        fontSize: 11,
        fontWeight: "500",
    },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
        marginRight: 8,
    },

    statusDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        marginRight: 5,
    },

    statusText: {
        fontSize: 8,
        fontWeight: "800",
        letterSpacing: 0.5,
    },

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 35,
        paddingTop: 70,
    },

    emptyIcon: {
        width: 72,
        height: 72,
        borderRadius: 24,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "800",
    },

    emptyDescription: {
        textAlign: "center",
        fontSize: 13,
        lineHeight: 20,
        marginTop: 8,
    },

    emptyButton: {
        paddingHorizontal: 20,
        paddingVertical: 13,
        borderRadius: 14,
        marginTop: 22,
    },

    emptyButtonText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
    },
});
