// constants/foodStyles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 55,
    paddingRight: 20,
    paddingLeft: 20,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
  },

  searchContainer: {
    marginBottom: 10,
  },

  searchInput: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 6,
    display: "none",
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
  },

  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#777",
    paddingBottom: 4,
    textAlign: "center",
  },

  activeTab: {
    width: "100%",
    color: "#000",
    borderBottomWidth: 2,
    borderColor: "#F84E10",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    gap: 10,
  },

  selectAllBtn: {
    borderWidth: 1,
    borderStyle: "dashed",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  actionsRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  outOfStockBtn: {
    backgroundColor: "#F84E10",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  mixedButton: {
    backgroundColor: "#ccc",
  },

  activeButton: {
    backgroundColor: "rgba(255, 89, 32, 0.7)",
  },

  bulkButtonText: {
    fontWeight: "bold",
  },

  mixedButtonText: {
    color: "#666",
  },

  activeButtonText: {
    color: "#00000082",
  },

  defaultButtonText: {
    color: "#fff",
  },

  warningText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 5,
  },

  deleteSelectedBtn: {
    marginLeft: 15,
    backgroundColor: "#ffb47e40",
    padding: 6,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  dropdownContainer: {
    marginVertical: 0,
  },

  keyboardContainer: {
    flex: 1,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },

  listContent: {
    paddingVertical: 10,
  },

  card: {
    height: 95,
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 15,
    marginBottom: 25,
    alignItems: "center",
  },

  image: {
    width: 50,
    height: 50,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginRight: 10,
  },

  cardContent: {
    flex: 1,
  },

  productName: {
    fontWeight: "600",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },

  inStock: {
    color: "#fff",
    fontSize: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
  },

  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  editBtn: {
    padding: 6,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffb47e40",
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#333",
  },

  checked: {
    backgroundColor: "#F84E10",
  },

  fab: {
    position: "absolute",
    top: 125,
    right: 20,
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 50,
  },

  chatFab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#F84E10",
    padding: 16,
    borderRadius: 50,
  },
});