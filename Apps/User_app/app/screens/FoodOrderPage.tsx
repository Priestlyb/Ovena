import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import FoodOrderTabView from "../../components/FoodOrderTabView";

export default function FoodOrderPage() {
  const navigation = useNavigation<any>();
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <Image
          source={require("../../assets/images/restaurant_header.png")}
          style={styles.headerImage}
        />

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => setVisible(true)}
        >
          <Ionicons name="ellipsis-horizontal" size={22} />
        </TouchableOpacity>

        <View style={styles.modalcontainer}>
          {/* Overlay Modal */}
          <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={() => setVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalBackground}
              activeOpacity={1}
              onPressOut={() => setVisible(false)}
            >
              <View style={styles.modalContent}>
                <View style={{ gap: 25, marginLeft: 30 }}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    Options
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("screens/HotelDetails")}>
                  <Text style={styles.optionsinfo}>
                    <Ionicons name="information-circle-outline" size={22} />{" "}
                    information
                  </Text>
                  </TouchableOpacity>
                  <Text style={styles.optionsinfo}>
                    <Ionicons name="send" size={22} /> Share
                  </Text>
                </View>
                <Text
                  style={{
                    position: "absolute",
                    right: 50,
                    top: 50,
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    padding: 5,
                  }}
                >
                  <Ionicons name="close" size={30} />
                </Text>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.restaurantName}>Pristina Hotel</Text>
        <Text style={styles.subText}>Shoppite, airport road</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>⭐ 3.7 (253)</Text>
          <Text style={styles.metaText}>🕒 30–45 min</Text>
        </View>

        <Text style={styles.openText}>Open till 8:00 pm</Text>
      </View>

      {/* Tabs */}
      <View style={{ flex: 1 }}>
        <FoodOrderTabView />
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  headerWrapper: {
    height: 200,
    position: "relative",
    zIndex: 1,
  },

  headerImage: { width: "100%", height: 258, resizeMode: "cover" },

  backBtn: {
    position: "absolute",
    top: 80,
    left: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
  },

  modalcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  moreBtn: {
    position: "absolute",
    top: 80,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 275,
    backgroundColor: "#F6D44F",
    borderTopLeftRadius: 175,
    borderTopRightRadius: 125,
    padding: 20,
  },
  optionsinfo: {
    fontSize: 16,
    fontWeight: "400",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },

  infoCard: {
    gap: 5,
    height: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginTop: -80,
    backgroundColor: "#fff",
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    position: "relative",
    zIndex: 10,
  },

  restaurantName: { fontSize: 20, fontWeight: "700" },
  subText: { color: "#777", marginTop: 4 },

  metaRow: { flexDirection: "row", marginTop: 8 },
  metaText: { fontSize: 13, color: "#555", marginRight: 12 },

  openText: { marginTop: 8, fontWeight: "600" },

  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },

  tabBtn: { padding: 12 },
  activeTab: { borderBottomWidth: 2 },
  tabText: { fontSize: 16, color: "#777" },
  activeTabText: { color: "#000", fontWeight: "600" },

  categoryRow: { paddingHorizontal: 16 },
  categoryChip: { marginRight: 16, paddingBottom: 6 },
  activeCategoryChip: { borderBottomWidth: 2 },
  categoryText: { fontWeight: "600", color: "#777" },
  activeCategoryText: { color: "#000" },

  section: { marginTop: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    paddingHorizontal: 16,
  },

  promoCard: {
    width: 160,
    backgroundColor: "#f7f7f7",
    padding: 10,
    borderRadius: 14,
    marginRight: 12,
  },

  promoImage: {
    height: 90,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginBottom: 8,
  },

  itemTitle: { fontWeight: "600", fontSize: 14 },
  price: { fontWeight: "700", marginTop: 4 },

  oldPrice: {
    textDecorationLine: "line-through",
    color: "#999",
    fontSize: 12,
  },

  oldPriceSmall: {
    textDecorationLine: "line-through",
    color: "#999",
    fontSize: 12,
    marginLeft: 8,
  },

  priceRow: { flexDirection: "row", alignItems: "center" },

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 16,
    marginBottom: 12,
  },

  timeText: { fontSize: 12, color: "#777" },

  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  foodImg: {
    width: 60,
    height: 60,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginRight: 12,
  },

  addBtn: {
    backgroundColor: "#ff4d2d",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  discountBadge: {
    backgroundColor: "#ffd966",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },

  discountText: { fontSize: 11, fontWeight: "700" },
});
