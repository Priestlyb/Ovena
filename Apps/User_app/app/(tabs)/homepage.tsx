import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useNavigation } from "@react-navigation/native";
import HomePageTabView from "../../components/HomePageTabView";
import { useHomeData } from "../../src/utils/controllers/useHomeData";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

export default function Homepage() {
  const router = useRouter();
  const { categories, recentlyVisited, topPicks, foodCategories } =
    useHomeData();

  const { accessToken, logout, getValidAccessToken } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDeleteUser = () => {
  Alert.alert(
    "Delete Account",
    "This action is permanent. Are you sure?",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: confirmDelete },
    ]
  );
};

const confirmDelete = async () => {
  try {
    setDeleting(true);

    // ✅ Get valid token (refresh if needed)
    const token = await getValidAccessToken();

    if (!token || token === "guest") {
      Alert.alert("Session expired", "Please login again");
      await logout();
      router.replace("/login");
      return;
    }

    const res = await fetch(`${BASE_URL}/accounts/profile/delete/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const text = await res.text();

    if (res.status === 401) {
      console.warn("Unauthorized → logging out");
      await logout();
      router.replace("/login");
      return;
    }

    if (res.status === 404 || text.includes("user_not_found")) {
      await logout();
      Alert.alert("Info", "User account already removed.");
      router.replace("/login");
      return;
    }

    if (!res.ok) throw new Error(text || "Failed to delete account");

    await logout();
    Alert.alert("Success", "Account deleted successfully");
    router.replace("/login");
  } catch (err: any) {
    console.error("Delete account error:", err);
    Alert.alert("Error", err.message || "Something went wrong");
  } finally {
    setDeleting(false);
  }
};


  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= DELETE USER (LOGGED IN ONLY) ================= */}
        {accessToken && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDeleteUser}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.deleteText}>Delete Account</Text>
            )}
          </TouchableOpacity>
        )}

        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Order Your Favourite{"\n"}Fast Food!
          </Text>

          <TouchableOpacity
            style={styles.cart}
            onPress={() => router.replace("/screens/SpinWheelScreen")}
          >
            <IconSymbol name="CartIcon" size={22} color="#fff" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>0</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ================= SEARCH ================= */}
        <View style={styles.searchBox}>
          <IconSymbol name="SearchIcon" size={18} color="#999" />
          <TextInput
            placeholder="Search food, drinks and dessert"
            style={styles.searchInput}
          />
          <IconSymbol name="FilterIcon" size={18} color="#f5a623" />
        </View>

        {/* ================= CATEGORIES ================= */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {categories.map((item, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipText}>{item.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ================= PROMO BANNER ================= */}
        <Animated.View
          style={[
            styles.wrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["#D9502E", "#FDBA2D"]}
            start={{ x: 1, y: 4 }}
            end={{ x: 0, y: 3 }}
            style={styles.promoCard}
          >
            <View style={styles.left}>
              <Text style={styles.title}>Grab our exclusive</Text>
              <Text style={styles.subtitle}>Food Discount now!</Text>

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Order Now!</Text>
              </TouchableOpacity>
            </View>

            <Image
              source={require("../../assets/images/Jellofrice.png")}
              style={styles.jellofimage}
              resizeMode="contain"
            />
          </LinearGradient>
        </Animated.View>

        {/* ================= FOOD ICON ROW ================= */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.foodRow}
        >
          {foodCategories.map((item, i) => (
            <View key={i} style={styles.foodItem}>
              <Text style={styles.foodIcon}>{item.icon}</Text>
              <Text style={styles.foodLabel}>{item.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ================= RECENTLY VISITED ================= */}
        <Text style={styles.sectionTitle}>Recently Visited</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentlyVisited.map(item => (
            <TouchableOpacity key={item.id} style={styles.restaurantCard} onPress={() => router.replace("/screens/FoodOrderPage")}>
              <Image
                source={{ uri: item.image }}
                style={styles.restaurantImage}
              />
              <TouchableOpacity style={styles.RCheart}>
                <IconSymbol name="HeartIcon" size={22} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/screens/FoodOrderPage")}
              >
                <Text style={styles.restaurantName}>{item.name}</Text>
              </TouchableOpacity>

              <Text style={styles.opentime}>Opens at {item.openTime}</Text>

              <View style={styles.reviewRow}>
                <Text style={{ fontWeight: "700" }}>
                  Reviews ({item.reviews})
                </Text>
                <Text>
                  <IconSymbol name="StarIcon" size={14} color="#f5a623" />{" "}
                  {item.rating}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ================= FREE DELIVERY ================= */}
        <View style={styles.delivery}>
          <View>
            <Text style={styles.deliveryTitle}>
              Free delivery on your first order
            </Text>
            <Text style={styles.deliverySub}>It's time to treat yourself</Text>
          </View>
          <Image
            source={require("../../assets/images/Deliveryguy.png")}
            style={styles.deliveryImg}
          />
        </View>

        {/* ================= TOP PICKS ================= */}
        <Text style={styles.sectionTitle}>Top Picks On Ovena</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topPicks.map(item => (
           
            <TouchableOpacity key={item.id} style={styles.restaurantCard} onPress={() => router.replace("/screens/HotelDetails")}>
              <Image
                source={{ uri: item.image }}
                style={styles.restaurantImage}
              />
              <TouchableOpacity style={styles.RCheart}>
                <IconSymbol name="HeartIcon" size={22} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.restaurantName}>{item.name}</Text>
              <Text style={styles.opentime}>Opens at {item.openTime}</Text>

              <View style={styles.reviewRow}>
                <Text style={{ fontWeight: "700" }}>
                  Reviews ({item.reviews})
                </Text>
                <Text>
                  <IconSymbol name="StarIcon" size={14} color="#f5a623" />{" "}
                  {item.rating}
                </Text>
              </View>
            </TouchableOpacity>
           
          ))}
        </ScrollView>

        {/* ================= RESTAURANTS TAB ================= */}
        <View style={{ height: 650 }}>
          <HomePageTabView />
        </View>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  headerText: { 
    fontSize: 25, 
    fontWeight: "700" 
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
    top: -4,
    right: -4,
    backgroundColor: "#000",
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  cartBadgeText: { color: "#fff", fontSize: 12 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    marginHorizontal: 20,
    padding: 10,  
    borderRadius: 12,
  },
  searchInput: { 
    flex: 1, 
    marginHorizontal: 8 
  },

  chipContainer: { 
    paddingHorizontal: 15, 
    marginTop: 10 
  },
  chip: {
    backgroundColor: "transparent",
    paddingHorizontal: 30,
    paddingVertical: 4,
    borderRadius: 40,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#000000ff",
  },
  chipText: { 
    fontSize: 15 
  },

  wrapper: { 
    paddingHorizontal: 20, 
    marginVertical: 30 
  },

  promoCard: {
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    // elevation: 6,
    padding: 20,
  },
  left: { flex: 1 },
  title: { fontSize: 17, fontWeight: "600" },
  subtitle: { fontSize: 20, fontWeight: "800" },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "600" 
  },

  jellofimage: { 
    width: 200, 
    marginBottom: -20, 
    height: 200 
  },

  foodRow: { 
    paddingHorizontal: 20, 
    marginVertical: 10 
  },
  foodItem: { 
    alignItems: "center", 
    marginRight: 25 
  },
  foodIcon: {
    fontSize: 40,
    backgroundColor: "#0000000a",
    padding: 12,
    borderRadius: 25,
  },
  foodLabel: { 
    fontSize: 12, 
    marginTop: 4 
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginTop: 30,
  },

  restaurantCard: { 
    margin: 15, 
    width: 250 
  },
  restaurantImage: { 
    width: 250, 
    height: 150, 
    borderRadius: 16 
  },
  restaurantName: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginTop: 6 
  },
  opentime: { 
    color: "#B7AFA5", 
    marginTop: 4 
  },

  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  delivery: {
    display: "flex",
    alignItems: "center",
    height: 200,
    flexDirection: "row",
    backgroundColor: "#f5a623",
    marginVertical: 50,
    padding: 20,
    justifyContent: "space-between",
  },
  deliveryTitle: { 
    fontSize: 20, 
    fontWeight: "700" 
  },
  deliverySub: { 
    fontSize: 18 
  },
  deliveryImg: { 
    width: 150, 
    height: 150, 
    marginBottom: -75 
  },

  RCheart: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#D9502E",
    padding: 8,
    borderRadius: 10,
  },
  deleteBtn: {
    backgroundColor: "#D9502E",
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  deleteText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
