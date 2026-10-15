/* ======================================================
   STYLES
====================================================== */


export const styles = StyleSheet.create({
  container: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    zIndex: 9999,

    elevation: 9999,
  },

  background: {
    flex: 1,

    backgroundColor: "#FFD56A",

    alignItems: "center",

    justifyContent: "center",

    overflow: "hidden",
  },

  /* ======================================================
     BACKGROUND GLOW
  ====================================================== */

  glowLarge: {
    position: "absolute",

    width: SCREEN_WIDTH * 1.25,
    height: SCREEN_WIDTH * 1.25,

    borderRadius: SCREEN_WIDTH,

    backgroundColor: "rgba(255,255,255,0.10)",

    top: -SCREEN_WIDTH * 0.55,
    right: -SCREEN_WIDTH * 0.45,
  },

  glowSmall: {
    position: "absolute",

    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,

    borderRadius: SCREEN_WIDTH,

    backgroundColor: "rgba(217,80,46,0.08)",

    top: SCREEN_HEIGHT * 0.28,
    left: -SCREEN_WIDTH * 0.38,
  },

  glowBottom: {
    position: "absolute",

    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.85,

    borderRadius: SCREEN_WIDTH,

    backgroundColor: "rgba(255,255,255,0.08)",

    bottom: -SCREEN_WIDTH * 0.5,
    right: -SCREEN_WIDTH * 0.35,
  },

  /* ======================================================
     STATUS
  ====================================================== */

  statusContainer: {
    position: "absolute",

    top: 70,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 30,

    backgroundColor: "rgba(255,255,255,0.28)",

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.4)",
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: 10,

    backgroundColor: "#D9502E",

    marginRight: 7,
  },

  statusText: {
    color: "#6A442B",

    fontSize: 9,

    fontWeight: "800",

    letterSpacing: 1.5,
  },

  /* ======================================================
     MAIN CONTENT
  ====================================================== */

  content: {
    position: "absolute",

    top: SCREEN_HEIGHT * 0.22,

    width: "100%",

    alignItems: "center",

    zIndex: 5,
  },

  emoji: {
    fontSize: 55,

    marginBottom: 12,
  },

  title: {
    color: "#432312",

    fontSize: 40,

    fontWeight: "900",

    letterSpacing: -1.5,

    textAlign: "center",
  },

  subtitle: {
    color: "#6A442B",

    fontSize: 13,

    fontWeight: "500",

    textAlign: "center",

    lineHeight: 20,

    marginTop: 7,

    paddingHorizontal: 40,
  },

  /* ======================================================
     PROGRESS
  ====================================================== */

  progressTrack: {
    width: 90,

    height: 4,

    borderRadius: 10,

    backgroundColor: "rgba(106,68,43,0.15)",

    overflow: "hidden",

    marginTop: 24,
  },

  progressFill: {
    width: "65%",

    height: "100%",

    borderRadius: 10,

    backgroundColor: "#D9502E",
  },

  /* ======================================================
     DELIVERY RIDER
  ====================================================== */

  riderContainer: {
    position: "absolute",

    bottom: SCREEN_HEIGHT * 0.17,

    left: 0,

    width: SCREEN_WIDTH + 250,

    alignItems: "center",

    zIndex: 20,
  },

  rider: {
    width: 260,

    height: 260,
  },

  /* ======================================================
     PICKUP CUSTOMER
  ====================================================== */

  pickupContainer: {
    position: "absolute",

    bottom: SCREEN_HEIGHT * 0.16,

    left: 0,

    width: SCREEN_WIDTH,

    alignItems: "center",

    zIndex: 20,
  },

  pickup: {
    width: 280,

    height: 280,
  },

  /* ======================================================
     BOTTOM BRANDING
  ====================================================== */

  bottomContainer: {
    position: "absolute",

    bottom: 55,

    alignItems: "center",
  },

  brand: {
    color: "#D9502E",

    fontSize: 13,

    fontWeight: "900",

    letterSpacing: 5,

    marginBottom: 5,
  },

  bottomText: {
    color: "#795238",

    fontSize: 10,

    fontWeight: "500",

    letterSpacing: 0.3,
  },
});