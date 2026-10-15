import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFD56A",
    },

    scrollContent: {
        backgroundColor: "#FFD56A",
        paddingBottom: 20,
        overflow: "hidden",
    },

    /* ======================================================
       HERO
    ====================================================== */

    hero: {
        minHeight: 760,
        paddingHorizontal: 24,
        paddingTop: 25,
        alignItems: "center",

        position: "relative",
        zIndex: 5,
    },

    /* ======================================================
       LOGO
    ====================================================== */

    logoContainer: {
        alignItems: "center",
        zIndex: 10,
    },

    logoIcon: {
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 37.5,
        marginBottom: 10,
    },

    logoImage: {
        width: 100,
        height: 100,
    },

    tagline: {
        color: "#56321C",
        fontSize: 10,
        fontWeight: "500",
        marginTop: -2,
    },

    /* ======================================================
       HEADING
    ====================================================== */

    headingContainer: {
        alignItems: "center",
        marginTop: 18,
        zIndex: 5,
    },

    delicious: {
        color: "#24160E",
        fontFamily: "Poppins_600SemiBold",
        fontSize: 40,
        fontWeight: "800",
        marginLeft: -100,
    },

    food: {
        color: "#F45112",
        fontSize: 82,
        lineHeight: 75,
        fontWeight: "900",
        letterSpacing: 3,
        marginLeft: -10,
        fontFamily: "Anton_400Regular",
    },

    delivered: {
        color: "#432312",
        fontSize: 54,
        lineHeight: 53,
        fontFamily: "KaushanScript_400Regular",
        marginTop: -4,
        marginLeft: 50,
        letterSpacing: -2,
    },

    /* ======================================================
       BENEFITS
    ====================================================== */

    benefits: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        marginTop: 14,
        zIndex: 5,
    },

    benefit: {
        flexDirection: "row",
        alignItems: "center",
    },

    benefitIcon: {
        fontSize: 16,
        marginRight: 3,
    },

    benefitText: {
        fontSize: 11,
        color: "#5B351D",
        fontWeight: "500",
    },

    /* ======================================================
       OPTIONS
    ====================================================== */

    optionContainer: {
        flexDirection: "row",
        width: "100%",
        gap: 12,
        marginTop: 18,
        zIndex: 5,
    },

    optionCard: {
        flex: 1,
        minHeight: 225,
        borderRadius: 27,
        paddingTop: 18,
        paddingHorizontal: 14,
        alignItems: "center",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.45)",

        shadowColor: "#9B3C09",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 6,
    },

    pickupCard: {
        backgroundColor: "#F45112",
    },

    deliveryCard: {
        backgroundColor: "#FFAD0B",
    },

    optionIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: "#FFF8EF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 7,
    },

    optionTitle: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "800",
        marginBottom: 4,
    },

    optionDescription: {
        color: "rgba(255,255,255,0.95)",
        fontSize: 11,
        lineHeight: 16,
        textAlign: "center",
    },

    arrowButton: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: "#FFF8EF",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },

    /* ======================================================
       FEATURE STRIP
    ====================================================== */

    featureStrip: {
        width: "100%",
        backgroundColor: "#FFF5D9",
        borderRadius: 30,

        paddingVertical: 13,
        paddingHorizontal: 10,

        marginTop: 50,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        position: "relative",
        zIndex: 20,

        shadowColor: "#8A410E",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },

    feature: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 21,
    },

    featureIcon: {
        width: 29,
        height: 29,
        borderRadius: 20,
        backgroundColor: "#F45112",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4,
    },

    featureContent: {
        alignItems: "center",
    },

    featureTitle: {
        fontSize: 8.5,
        fontWeight: "800",
        color: "#4A2B17",
        textAlign: "center",
    },

    featureDescription: {
        fontSize: 7,
        color: "#8C6548",
        textAlign: "center",
        marginTop: 1,
    },

    /* ======================================================
       FOOD IMAGES
    ====================================================== */

    pizza: {
        position: "absolute",
        width: 175,
        height: 175,
        right: -70,
        top: -25,
        borderRadius: 90,
        zIndex: 1,
    },

    chicken: {
        position: "absolute",
        width: 250,
        height: 250,
        left: -90,
        top: 590,
        borderRadius: 100,
        zIndex: 1,
    },

    burger: {
        position: "absolute",
        width: 250,
        height: 250,
        right: -70,
        top: 620,
        borderRadius: 100,
        zIndex: 1,
    },

    /* ======================================================
       DECORATIVE LEAVES
    ====================================================== */

    leafTopLeft: {
        position: "absolute",
        left: 15,
        top: 85,
        zIndex: 3,

        transform: [
            { rotate: "-35deg" },
        ],

        opacity: 0.8,
    },

    leafTopRight: {
        position: "absolute",
        right: 28,
        top: 135,
        zIndex: 3,

        transform: [
            { rotate: "35deg" },
        ],

        opacity: 0.7,
    },

    leafHeadingLeft: {
        position: "absolute",
        left: 35,
        top: 280,
        zIndex: 4,

        transform: [
            { rotate: "-55deg" },
        ],

        opacity: 0.65,
    },

    leafHeadingRight: {
        position: "absolute",
        right: 38,
        top: 315,
        zIndex: 4,

        transform: [
            { rotate: "50deg" },
        ],

        opacity: 0.6,
    },

    leafOptionsLeft: {
        position: "absolute",
        left: 8,
        top: 445,
        zIndex: 4,

        transform: [
            { rotate: "-30deg" },
        ],

        opacity: 0.7,
    },

    leafOptionsRight: {
        position: "absolute",
        right: 5,
        top: 470,
        zIndex: 4,

        transform: [
            { rotate: "35deg" },
        ],

        opacity: 0.75,
    },

    leafFeatureLeft: {
        position: "absolute",
        left: 10,
        top: 690,
        zIndex: 22,

        transform: [
            { rotate: "-45deg" },
        ],

        opacity: 0.8,
    },

    leafFeatureRight: {
        position: "absolute",
        right: 8,
        top: 705,
        zIndex: 22,

        transform: [
            { rotate: "40deg" },
        ],

        opacity: 0.8,
    },

    leafBottomLeft: {
        position: "absolute",
        left: 18,
        bottom: 5,
        zIndex: 22,

        transform: [
            { rotate: "-25deg" },
        ],

        opacity: 0.75,
    },

    leafBottomRight: {
        position: "absolute",
        right: 15,
        bottom: 0,
        zIndex: 22,

        transform: [
            { rotate: "35deg" },
        ],

        opacity: 0.7,
    },

    /* ======================================================
       LOCATION
    ====================================================== */

    locationSection: {
        minHeight: 150,
        paddingTop: 25,
        paddingBottom: 35,
        justifyContent: "center",
        alignItems: "center",

        position: "relative",
    },

    locationContainer: {
        width: "75%",
        padding: 20,

        borderTopRightRadius: 250,
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,

        alignItems: "center",
        backgroundColor: "#7A320C",

        zIndex: 5,
    },

    locationIcon: {
        marginBottom: 5,
    },

    hungryText: {
        color: "#FFF7E5",
        fontSize: 13,
        fontWeight: "500",
    },

    rightPlaceText: {
        letterSpacing: 1,
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
        marginTop: 2,
    },

    rightPlaceHighlight: {
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.5,
        color: "#FFBE00",
    },

    dottedArrow: {
        marginTop: 5,
    },

    leafLocationLeft: {
        position: "absolute",
        left: 15,
        top: 35,
        zIndex: 3,

        transform: [
            { rotate: "-45deg" },
        ],

        opacity: 0.75,
    },

    leafLocationRight: {
        position: "absolute",
        right: 18,
        bottom: 25,
        zIndex: 3,

        transform: [
            { rotate: "45deg" },
        ],

        opacity: 0.7,
    },

    /* ======================================================
       REVIEWS
    ====================================================== */

    reviewCard: {
        marginHorizontal: 25,
        marginTop: -45,

        minHeight: 70,
        borderRadius: 25,

        backgroundColor: "#FFF8E9",

        paddingHorizontal: 17,
        paddingVertical: 13,

        flexDirection: "row",
        alignItems: "center",

        shadowColor: "#6D2C09",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,

        zIndex: 10,
    },

    reviewTitle: {
        color: "#4C2C18",
        fontSize: 10,
        fontWeight: "500",
    },

    reviewSubtitle: {
        color: "#4C2C18",
        fontSize: 10,
        fontWeight: "500",
    },

    appText: {
        color: "#F45112",
        fontWeight: "800",
    },

    avatarContainer: {
        flexDirection: "row",
        marginLeft: 8,
        flex: 1,
    },

    avatar: {
        width: 28,
        height: 28,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#FFF8E9",
        marginLeft: -7,
    },

    ratingContainer: {
        alignItems: "flex-end",
    },

    lovedText: {
        fontSize: 7,
        color: "#654831",
        textAlign: "right",
    },

    rating: {
        color: "#E46A16",
        fontSize: 14,
        fontWeight: "800",
        marginTop: 2,
    },
});