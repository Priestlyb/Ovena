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
import { useNavigation } from "@react-navigation/native";
import HomePageTabView from "../../components/HomePageTabView";
import { useHomeData } from "../../src/utils/controllers/useHomeData";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

export default function Homepage() {
  const navigation = useNavigation<any>();
  const { categories, recentlyVisited, topPicks, foodCategories } =
    useHomeData();

  const { accessToken, logout } = useAuth();

  const [deleting, setDeleting] = useState(false);

  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ✅ Guest vs Auth detection
  const { authStatus } = useAuth();
  const isAuthenticated = authStatus === "authenticated" && !!accessToken;

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

  /* ================= DELETE ACCOUNT ================= */

  const handleDeleteUser = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Login required",
        "You must be logged in to delete your account.",
      );
      return;
    }

    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
      ],
    );
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      console.log("🗑️ DELETE → started");

      // ✅ Use accessToken directly
      const token = accessToken;
      console.log("🗝️ DELETE → using token:", token);

      // 🚫 Guest or invalid token
      if (!token) {
        console.warn("🚪 DELETE → invalid / guest token");
        router.replace("/login");
        setTimeout(() => logout(), 0);

        return;
      }

      const res = await fetch(`${BASE_URL}/accounts/profile/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📬 DELETE → status:", res.status);

      const raw = await res.text();
      console.log("📦 DELETE → response:", raw);

      // 🔐 Auth failure
      if (res.status === 401 || res.status === 403) {
        console.warn("🚪 DELETE → unauthorized");
        await logout();
        router.replace("/login");
        return;
      }

      // ℹ️ No profile exists
      if (res.status === 404) {
        Alert.alert(
          "Profile not found",
          "No customer profile exists for this account.",
        );
        return;
      }

      if (!res.ok) {
        throw new Error(raw || "Failed to delete account");
      }

      console.log("✅ DELETE → success");

      await logout();
      Alert.alert("Success", "Account deleted successfully");
      router.replace("/login");
    } catch (err: any) {
      console.error("❌ DELETE → error:", err);
      Alert.alert("Error", err?.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔥 DELETE BUTTON (AUTH USERS ONLY) */}
        {isAuthenticated && (
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
              <Text style={styles.chipText}>
                {item.name} {item.icon}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* ================= PROMO ================= */}
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

        {/* ================= REST OF PAGE ================= */}
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  headerText: { fontSize: 30, fontWeight: "700" },

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
  searchInput: { flex: 1, marginHorizontal: 8 },

  chipContainer: {
    paddingHorizontal: 15,
    marginTop: 25,
  },
  chip: {
    backgroundColor: "#eee",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: { fontSize: 15 },

  wrapper: { paddingHorizontal: 20, marginVertical: 30 },

  promoCard: {
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    elevation: 6,
    paddingLeft: 20,
  },
  left: { flex: 1 },
  title: { fontSize: 17, fontWeight: "600" },
  subtitle: { fontSize: 20, fontWeight: "800" },
  button: {
    marginTop: 16,
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },

  jellofimage: {
    width: 200,
    height: 200,
    marginBottom: -20,
  },
});
