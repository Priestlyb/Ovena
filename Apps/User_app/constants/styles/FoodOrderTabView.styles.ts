import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  scrollContent: {
    paddingBottom: 0,
    backgroundColor: "#ffffff",
  },

  scrollMainContent: {
    flex: 1,
    minHeight: "100%",
    paddingBottom: 100,
  },

  categoryScroll: {
    marginVertical: 30,
    marginLeft: 10,
  },

  section: {
    width: "100%",
    marginTop: 25,
    display: "flex",
    flexDirection: "column",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  seeAllText: {
    color: "#D9502E",
    fontWeight: "600",
  },

  promoCard: {
    width: 160,
    marginRight: 16,
    marginBottom: 25,
    borderRadius: 12,
    padding: 8,
    backgroundColor: "#fff",
  },

  firstPromoCard: {
    marginLeft: 16,
  },

  promoImage: {
    height: 100,
    backgroundColor: "#eee",
    borderRadius: 12,
    marginBottom: 8,
  },

  roomImage: {
    height: 200,
    backgroundColor: "#eee",
    borderRadius: 12,
    marginBottom: 8,
  },

  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  price: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },

  oldPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "#999",
  },

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  oldPriceSmall: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "#999",
  },

  discountBadge: {
    backgroundColor: "#F6D44F",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  discountText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "700",
  },

  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
  },

  foodImg: {
    width: 60,
    height: 60,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginRight: 12,
  },

  addonsItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 20,
    marginVertical: 15,
  },

  addonsTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 25,
  },

  addonsImage: {
    width: 110,
    height: 110,
    backgroundColor: "#F5F4F4",
    borderRadius: 20,
  },

  addonsInfo: {
    width: 150,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 50,
    textAlign: "right",
  },

  addonsName: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right",
  },

  addonsDescription: {
    fontSize: 12,
    fontWeight: "400",
  },

  promoCardDescription: {
    fontSize: 12,
    fontWeight: "400",
  },

  addonActions: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 50,
  },

  addonsAddBtn: {
    width: 32,
    backgroundColor: "#D9502E",
    padding: 6,
    borderRadius: 20,
  },

  addBtn: {
    position: "absolute",
    bottom: 15,
    right: 5,
    width: 32,
    backgroundColor: "#D9502E",
    padding: 6,
    borderRadius: 20,
  },

  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginHorizontal: 8,
  },

  activeCategoryChip: {
    backgroundColor: "#D9502E",
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },

  activeCategoryText: {
    color: "#fff",
  },

  timeText: {
    fontSize: 12,
    color: "#000000",
    fontWeight: "600",
  },

  roomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },

  roomAmenity: {
    fontSize: 16,
    fontWeight: "500",
  },

  roomPrice: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },

  viewRoomButton: {
    backgroundColor: "#D9502E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  viewRoomButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  /*
    tabBarIndicator: {
    backgroundColor: "#D9502E",
    height: 2,
  },
  */

  tabBar: {
    backgroundColor: "#fff",
    elevation: 0,
  },

  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "none",
  },

  roomContent: {
    padding: 25,
  },
});