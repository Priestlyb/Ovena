/**
 * -----------------------------------------------------------------------------
 * File: src/styles/businessVerification.styles.ts
 * -----------------------------------------------------------------------------
 * Styles for the Brika Business Verification screen.
 * -----------------------------------------------------------------------------
 */

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FB",
        paddingTop: 55,
    },

    content: {
        paddingHorizontal: 20,
        paddingBottom: 50,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 35,
    },

    /**
     * -------------------------------------------------------------------------
     * Header
     * -------------------------------------------------------------------------
     */

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },

    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ECECEC",
    },

    headerTextContainer: {
        flex: 1,
        marginLeft: 13,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#111827",
    },

    headerSubtitle: {
        marginTop: 3,
        fontSize: 13,
        color: "#6B7280",
    },

    refreshButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ECECEC",
    },

    /**
     * -------------------------------------------------------------------------
     * Hero
     * -------------------------------------------------------------------------
     */

    heroCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 28,
        padding: 26,
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ECECEC",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 18,
        shadowOffset: {
            width: 0,
            height: 7,
        },
        elevation: 4,
    },

    heroGlow: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: 130,
        top: -150,
        right: -90,
        opacity: 0.55,
    },

    statusIconOuter: {
        width: 94,
        height: 94,
        borderRadius: 47,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
    },

    statusIconInner: {
        width: 76,
        height: 76,
        borderRadius: 38,
        justifyContent: "center",
        alignItems: "center",
    },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        marginBottom: 14,
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginRight: 7,
    },

    statusBadgeText: {
        fontSize: 12,
        fontWeight: "700",
    },

    heroTitle: {
        fontSize: 27,
        lineHeight: 34,
        fontWeight: "800",
        color: "#111827",
        textAlign: "center",
    },

    heroDescription: {
        marginTop: 10,
        fontSize: 14,
        lineHeight: 22,
        color: "#6B7280",
        textAlign: "center",
        maxWidth: 320,
    },

    /**
     * -------------------------------------------------------------------------
     * Review Time
     * -------------------------------------------------------------------------
     */

    reviewTimeCard: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "#FFF8F4",
        borderWidth: 1,
        borderColor: "#FFE2D5",
    },

    reviewTimeContent: {
        flex: 1,
        marginLeft: 10,
    },

    reviewTimeLabel: {
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 0.8,
        color: "#9CA3AF",
    },

    reviewTimeValue: {
        marginTop: 3,
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
    },

    /**
     * -------------------------------------------------------------------------
     * Sections
     * -------------------------------------------------------------------------
     */

    section: {
        marginTop: 26,
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 5,
    },

    sectionSubtitle: {
        fontSize: 12,
        lineHeight: 18,
        color: "#9CA3AF",
    },

    /**
     * -------------------------------------------------------------------------
     * Verification Card
     * -------------------------------------------------------------------------
     */

    verificationCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: "#ECECEC",
    },

    verificationItem: {
        minHeight: 78,
        flexDirection: "row",
        alignItems: "center",
    },

    verificationStatusIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
    },

    verificationStatusSuccess: {
        backgroundColor: "#159957",
    },

    verificationStatusFailed: {
        backgroundColor: "#FEE2E2",
    },

    verificationStatusPending: {
        backgroundColor: "#FFF1EB",
    },

    verificationItemContent: {
        flex: 1,
        marginLeft: 12,
        marginRight: 10,
    },

    verificationItemTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
    },

    verificationItemDescription: {
        marginTop: 3,
        fontSize: 11,
        lineHeight: 17,
        color: "#9CA3AF",
    },

    verificationBadge: {
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "#F3F4F6",
    },

    verificationBadgeSuccess: {
        backgroundColor: "#E8F7EF",
    },

    verificationBadgeFailed: {
        backgroundColor: "#FEE2E2",
    },

    verificationBadgePending: {
        backgroundColor: "#FFF1EB",
    },

    verificationBadgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#6B7280",
    },

    verificationBadgeTextSuccess: {
        color: "#159957",
    },

    verificationBadgeTextFailed: {
        color: "#B91C1C",
    },

    verificationBadgeTextPending: {
        color: "#FF5920",
    },

    itemDivider: {
        height: 1,
        backgroundColor: "#F0F1F3",
        marginLeft: 50,
    },

    /**
     * -------------------------------------------------------------------------
     * Explanation
     * -------------------------------------------------------------------------
     */

    explanationCard: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: "#ECECEC",
    },

    explanationIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: "#FFF1EB",
        justifyContent: "center",
        alignItems: "center",
    },

    explanationContent: {
        flex: 1,
        marginLeft: 13,
    },

    explanationTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
    },

    explanationText: {
        marginTop: 5,
        fontSize: 13,
        lineHeight: 20,
        color: "#6B7280",
    },

    /**
     * -------------------------------------------------------------------------
     * Summary
     * -------------------------------------------------------------------------
     */

    summaryCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: "#ECECEC",
    },

    summaryRow: {
        minHeight: 54,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#F1F2F4",
    },

    summaryLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#4B5563",
    },

    summaryStatus: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderRadius: 999,
    },

    summaryStatusSuccess: {
        backgroundColor: "#E8F7EF",
    },

    summaryStatusNeutral: {
        backgroundColor: "#F3F4F6",
    },

    summaryStatusText: {
        marginLeft: 4,
        fontSize: 11,
        fontWeight: "700",
    },

    summaryStatusTextSuccess: {
        color: "#159957",
    },

    summaryStatusTextNeutral: {
        color: "#6B7280",
    },

    /**
     * -------------------------------------------------------------------------
     * Notice
     * -------------------------------------------------------------------------
     */

    noticeCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#FFFBEB",
        borderRadius: 15,
        padding: 14,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#FDE68A",
    },

    noticeText: {
        flex: 1,
        marginLeft: 9,
        color: "#92400E",
        fontSize: 12,
        lineHeight: 19,
    },

    /**
     * -------------------------------------------------------------------------
     * Error
     * -------------------------------------------------------------------------
     */

    errorCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEE2E2",
        borderRadius: 14,
        padding: 14,
        marginTop: 18,
    },

    errorText: {
        flex: 1,
        marginLeft: 9,
        color: "#B91C1C",
        fontSize: 13,
        lineHeight: 19,
    },

    errorIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#FEE2E2",
        justifyContent: "center",
        alignItems: "center",
    },

    errorTitle: {
        marginTop: 20,
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
        textAlign: "center",
    },

    errorDescription: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 21,
        color: "#6B7280",
        textAlign: "center",
    },

    /**
     * -------------------------------------------------------------------------
     * Button
     * -------------------------------------------------------------------------
     */

    button: {
        marginTop: 28,
        minHeight: 54,
        borderRadius: 15,
        backgroundColor: "#FF5920",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },

    buttonDisabled: {
        opacity: 0.7,
    },

    buttonText: {
        marginLeft: 9,
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },

    /**
     * -------------------------------------------------------------------------
     * Retry
     * -------------------------------------------------------------------------
     */

    retryButton: {
        marginTop: 22,
        minHeight: 50,
        paddingHorizontal: 22,
        borderRadius: 14,
        backgroundColor: "#FF5920",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    retryButtonText: {
        marginLeft: 8,
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },

    /**
     * -------------------------------------------------------------------------
     * Loading
     * -------------------------------------------------------------------------
     */

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 35,
    },

    loadingIcon: {
        width: 82,
        height: 82,
        borderRadius: 41,
        backgroundColor: "#FFF1EB",
        justifyContent: "center",
        alignItems: "center",
    },

    loadingTitle: {
        marginTop: 22,
        fontSize: 21,
        fontWeight: "800",
        color: "#111827",
    },

    loadingSubtitle: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 21,
        color: "#6B7280",
        textAlign: "center",
    },
});