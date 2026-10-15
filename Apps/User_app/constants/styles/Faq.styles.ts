import {
  StyleSheet
} from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
    paddingTop: 60,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  /* ===========================
     HEADER
  =========================== */

  header: {
    marginBottom: 28,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  headerText: {
    marginTop: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 24,
    color: "#6B7280",
  },

  /* ===========================
     HERO CARD
  =========================== */

  heroCard: {
    flexDirection: "row",
    alignItems: "flex-start",

    backgroundColor: "#FEF6E7",

    borderRadius: 20,

    padding: 18,

    marginBottom: 30,

    borderWidth: 1,
    borderColor: "#FFE7CF",
  },

  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    marginRight: 16,
  },

  heroTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  heroSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },

  /* ===========================
     SECTION
  =========================== */

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.3,
    color: "#9CA3AF",
    marginBottom: 14,
    marginLeft: 4,
  },

  /* ===========================
     FAQ CARD
  =========================== */

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  questionContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",

    marginRight: 14,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,

    backgroundColor: "#FEF6E7",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  question: {
    flex: 1,

    fontSize: 16,
    fontWeight: "600",

    color: "#111827",

    lineHeight: 24,
  },

  /* ===========================
     SUPPORT CARD
  =========================== */

  supportCard: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#D9502E",

    borderRadius: 20,

    padding: 20,

    marginTop: 12,
  },

  supportIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,

    backgroundColor: "rgba(255,255,255,0.2)",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 16,
  },

  supportTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  supportSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "rgba(255,255,255,0.85)",
  },
});