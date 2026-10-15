import { StyleSheet } from "react-native";

export const homepageStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: "#fff",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ================= HEADER ================= */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginBottom: 10,
  },

  headerText: {
    fontSize: 30,
    fontWeight: "700",
  },

  cart: {
    width: 55,
    height: 55,
    backgroundColor: "#D9502E",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#000",
    borderRadius: 10,
    paddingHorizontal: 7,
  },

  cartBadgeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    marginHorizontal: 8,
  },

  /* ================= SHARED ================= */

  chipContainer: {
    paddingHorizontal: 15,
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 20,
    marginVertical: 30,
  },

  /* ================= PROMO CARD ================= */

  wrapper: {
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 20,
  },

  promoCard: {
    width: "100%",
    minHeight: 180,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    elevation: 6,
    paddingLeft: 20,
    paddingRight: 8,
  },

  left: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 20,
    zIndex: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 3,
  },

  subtitle: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "800",
    color: "#fff",
    maxWidth: "95%",
  },

  button: {
    marginTop: 14,
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    minHeight: 42,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  jellofimage: {
    width: 175,
    height: 175,
    marginRight: -10,
    marginBottom: -25,
  },

  /* ================= CATEGORIES ================= */

  categoriesImageWrapper: {
    backgroundColor: "#e3e2e2",
    width: 75,
    height: 65,
    marginBottom: 15,

    borderTopRightRadius: 50,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 25,

    overflow: "hidden",

    justifyContent: "center",
    alignItems: "center",
  },

  categoriesImage: {
    width: "100%",
    height: "100%",
  },

  /* ================= RESTAURANT CARD ================= */

  restaurantCard: {
    marginRight: 25,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    marginBottom: 20,
  },

  restaurantImageContainer: {
    position: "relative",
  },

  restaurantImage: {
    width: 250,
    height: 150,
  },

  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#D9502E",
    width: 38,
    height: 44,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  restaurantContent: {
    padding: 20,
  },

  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  restaurantName: {
    fontWeight: "bold",
    fontSize: 16,
  },

  restaurantRating: {
    fontWeight: "bold",
    fontSize: 14,
  },

  restaurantTime: {
    fontSize: 12,
    color: "#666",
  },

  restaurantReview: {
    fontSize: 12,
  },

  /* ================= FREE DELIVERY ================= */

  freeDeliveryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    backgroundColor: "#F5A623",
    padding: 20,
    alignItems: "center",
    height: 155,
    overflow: "hidden",
  },

  freeDeliveryTitle: {
    fontWeight: "700",
    fontSize: 17,
  },

  freeDeliverySubtitle: {
    fontSize: 15,
  },

  deliveryImage: {
    width: 110,
    height: 110,
    position: "absolute",
    right: 0,
    bottom: -7,
    zIndex: 1,
  },

  circleOne: {
    position: "absolute",
    right: -45,
    top: 0,
    backgroundColor: "#DBBA4D",
    width: 150,
    height: 150,
    borderRadius: 75,
  },

  circleTwo: {
    position: "absolute",
    right: -65,
    bottom: 0,
    backgroundColor: "#F6D44F",
    width: 150,
    height: 150,
    borderRadius: 75,
  },
});


export const Resturantstyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 50,
    paddingHorizontal: 20,
  },

  titleContainer: {
    flex: 1,
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    letterSpacing: 0.8,
    textAlign: "center",
    marginVertical: 8,
  },

  titleLine: {
    width: 100,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#d9502eb3",
  },

  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    opacity: 0.7,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  restaurantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 50,
    marginHorizontal: 16,

    overflow: "hidden",

    elevation: 5,
    shadowColor: "#D9502E",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  disabledCard: {
    opacity: 0.55,
  },

  imageWrapper: {
    position: "relative",
  },

  restaurantImg: {
    width: "100%",
    height: 170,
  },

  restaurantImgPlaceholder: {
    width: "100%",
    height: 170,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  heart: {
    position: "absolute",
    right: 12,
    bottom: 12,

    width: 38,
    height: 38,
    borderRadius: 19,

    backgroundColor: "#F6D44F",

    justifyContent: "center",
    alignItems: "center",
  },

  statusBadge: {
    position: "absolute",
    top: 12,
    left: 12,

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 20,
  },

  statusText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  restaurantInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  leftContent: {
    flex: 1,
    paddingRight: 12,
  },

  restaurantName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  open: {
    fontSize: 12,
    fontWeight: "600",
  },

  rightContent: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  reviews: {
    fontSize: 12,
    color: "#777777",
  },

  loader: {
    paddingVertical: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    paddingVertical: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#777777",
    textAlign: "center",
  },
});