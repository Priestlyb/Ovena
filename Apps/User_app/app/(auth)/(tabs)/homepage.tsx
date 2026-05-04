// app/(auth)/(tabs)/homepage.tsx
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
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import HomePageTabView from "@/components/homepage/HomePageTabView";
import { useHomeData } from "@/src/utils/controllers/useHomeData";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { DeleteAccountButton } from "@/components/homepage/DeleteAccountButton";

const ROOM_IMAGE = require("@/assets/images/room.png");
const JELLOF_IMAGE = require("@/assets/images/Jellofrice.png");

export default function Homepage() {
  const { authStatus, accessToken } = useAuth();
  const isAuthenticated = authStatus === "authenticated" && !!accessToken;

  const { categories, topPicks, recentlyVisited, loading, error, refetch } =
    useHomeData();

  /* ================= ANIMATION REFS ================= */
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const [recentlyAnim, setRecentlyAnim] = useState<Animated.Value[]>([]);
  const [topPicksAnim, setTopPicksAnim] = useState<Animated.Value[]>([]);
  const [categoryAnim, setCategoryAnim] = useState<Animated.Value[]>([]);

  
  useEffect(() => {
    if (categories.length) {
      setCategoryAnim(categories.map(() => new Animated.Value(0)));
    }
  }, [categories]);

  useEffect(() => {
    if (recentlyVisited.length) {
      setRecentlyAnim(recentlyVisited.map(() => new Animated.Value(0)));
    }
    if (topPicks.length) {
      setTopPicksAnim(topPicks.map(() => new Animated.Value(0)));
    }
  }, [recentlyVisited, topPicks]);

  
  useEffect(() => {
    // Main header + promo animation
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 50,
      }),
    ]).start();

    
    Animated.stagger(
      100,
      categoryAnim.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ),
    ).start();

    
    Animated.stagger(
      100,
      recentlyAnim.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ),
    ).start();

    
    Animated.stagger(
      100,
      topPicksAnim.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [categoryAnim, recentlyAnim, topPicksAnim]);

  
  if (
    authStatus === "booting" ||
    authStatus === "google_signup" ||
    loading ||
    !categories.length
  ) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#D9502E" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={{ marginBottom: 10 }}>Something went wrong</Text>
        <TouchableOpacity onPress={refetch}>
          <Text style={{ color: "#D9502E" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  
  return (
    <View style={styles.container}>
      {isAuthenticated && (
        <DeleteAccountButton onSuccess={() => console.log("Account deleted")} />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER + SEARCH */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Order Your Favourite{"\n"}Fast Food!
            </Text>

            <TouchableOpacity
              style={styles.cart}
              onPress={() => router.replace("/(auth)/screens/SpinWheelScreen")}
            >
              <IconSymbol name="CartIcon" size={22} color="#fff" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>0</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBox}>
            <IconSymbol name="SearchIcon" size={18} color="#999" />
            <TextInput
              placeholder="Search food, drinks and dessert"
              style={styles.searchInput}
            />
            <IconSymbol name="FilterIcon" size={18} color="#f5a623" />
          </View>
        </Animated.View>

        {/* PROMO CARD */}
        <Animated.View
          style={[
            styles.wrapper,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
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

            <Animated.Image
              source={JELLOF_IMAGE}
              style={[
                styles.jellofimage,
                {
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                },
              ]}
              resizeMode="contain"
            />
          </LinearGradient>
        </Animated.View>

        {/* CATEGORIES */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {categories.map((item, i) => (
            <Animated.View
              key={item.id}
              style={{
                opacity: categoryAnim[i] || 0,
                transform: [
                  {
                    translateY: (
                      categoryAnim[i] || new Animated.Value(0)
                    ).interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
                paddingHorizontal: 15,
                marginTop: 30,
                alignItems: "center",
              }}
            >
              <View style={styles.categoriesImageWrapper}>
                <Image
                  source={item.image}
                  style={styles.categoriesImage}
                  resizeMode="contain"
                />
              </View>
              <Text>{item.name}</Text>
            </Animated.View>
          ))}
        </ScrollView>

        {/* RECENTLY VISITED */}
        <Text style={styles.sectionTitle}>Recently Visited</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {recentlyVisited.map((item, i) => (
            <Animated.View
              key={item.id}
              style={{
                opacity: recentlyAnim[i] || 0,
                transform: [
                  {
                    translateY: (
                      recentlyAnim[i] || new Animated.Value(0)
                    ).interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                  {
                    scale: (
                      recentlyAnim[i] || new Animated.Value(0)
                    ).interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
                marginRight: 25,
                backgroundColor: "#fff",
                borderRadius: 12,
                overflow: "hidden",
                elevation: 4,
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/screens/ResturantsPage")}
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={ROOM_IMAGE}
                    style={{ width: 250, height: 150 }}
                    resizeMode="contain"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "#D9502E",
                      width: 38,
                      height: 44,
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <IconSymbol name="OutlineHeart" size={30} color="#fff" />
                  </View>
                </View>
                <View style={{ padding: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 7,
                    }}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      {item.name}
                    </Text>
                    <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                      4.5{" "}
                      <IconSymbol name="StarIcon" size={16} color="#f5a623" />
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12, color: "#666" }}>
                    Opens at 5:00am
                  </Text>
                  <Text style={{ fontSize: 12 }}>Review (36)</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
            backgroundColor: "#F5A623",
            padding: 20,
            alignItems: "center",
            height: 155,
          }}
        >
          <View>
            <Text style={{ fontWeight: "700", fontSize: 17 }}>
              Free delivery on your first order
            </Text>
            <Text style={{ fontSize: 15 }}>It’s time to treat yourself</Text>
          </View>
          <Image
            source={require("@/assets/images/Deliveryguy.png")}
            style={{
              width: 110,
              height: 110,
              position: "absolute",
              right: 0,
              bottom: -7,
              zIndex: 1,
            }}
          />
          <View
            style={{
              position: "absolute",
              right: -45,
              top: 0,
              backgroundColor: "#DBBA4D",
              width: 150,
              height: 150,
              borderRadius: 75,
            }}
          />
          <View
            style={{
              position: "absolute",
              right: -65,
              bottom: 0,
              backgroundColor: "#F6D44F",
              width: 150,
              height: 150,
              borderRadius: 75,
            }}
          />
        </View>

        {/* TOP PICKS */}
        <Text style={styles.sectionTitle}>Top Picks On Ovena</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {topPicks.map((item, i) => (
            <Animated.View
              key={item.id}
              style={{
                opacity: topPicksAnim[i] || 0,
                transform: [
                  {
                    translateY: (
                      topPicksAnim[i] || new Animated.Value(0)
                    ).interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                  {
                    scale: (
                      topPicksAnim[i] || new Animated.Value(0)
                    ).interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
                marginRight: 25,
                backgroundColor: "#fff",
                borderRadius: 12,
                overflow: "hidden",
                elevation: 4,
                marginBottom: 20,
              }}
            >
              <View style={{ position: "relative" }}>
                <Image
                  source={ROOM_IMAGE}
                  style={{ width: 250, height: 150 }}
                  resizeMode="contain"
                />
                <View
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "#D9502E",
                    width: 38,
                    height: 44,
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IconSymbol name="OutlineHeart" size={30} color="#fff" />
                </View>
              </View>
              <View style={{ padding: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 7,
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                    4.5 <IconSymbol name="StarIcon" size={16} color="#f5a623" />
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: "#666" }}>
                  Opens at 5:00am
                </Text>
                <Text style={{ fontSize: 12 }}>Review (36)</Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        {/* REST OF PAGE */}
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
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  chipContainer: { paddingHorizontal: 15, marginTop: 20 },
  wrapper: { paddingHorizontal: 20, marginTop: 20 },
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
  jellofimage: { width: 200, height: 200, marginBottom: -20 },
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
  },
  categoriesImage: { width: "100%", height: "100%" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 30,
  },
});
