import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import HomePageTabView from "../../components/HomePageTabView";

export default function Index() {
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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Order Your Favourite{"\n"}Fast Food!
          </Text>

          <TouchableOpacity style={styles.cart}>
            <Ionicons name="cart-outline" size={22} color="#fff" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>0</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#999" />
          <TextInput
            placeholder="Search food, drinks and dessert"
            style={styles.searchInput}
          />
          <Ionicons name="options-outline" size={18} color="#f5a623" />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {[
            "Chicken",
            "Pasta",
            "Soup",
            "Rice",
            "Seafood",
            "Snacks",
            "Drinks",
            "Desserts",
          ].map((item, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Promo Banner */}
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
            {/* Left Content */}
            <View style={styles.left}>
              <Text style={styles.title}>Grab our exclusive</Text>
              <Text style={styles.subtitle}>Food Discount now!</Text>

              <TouchableOpacity activeOpacity={0.85} style={styles.button}>
                <Text style={styles.buttonText}>Order Now!</Text>
              </TouchableOpacity>
            </View>

            {/* Right Image */}
            <Image
              source={require("../../assets/images/Jellofrice.png")}
              style={styles.jellofimage}
              resizeMode="contain"
            />
          </LinearGradient>
        </Animated.View>

        {/* Food Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.foodRow}
        >
          {[
            { name: "Chicken", icon: "🍗" },
            { name: "Pizza", icon: "🍕" },
            { name: "Ice Cream", icon: "🍦" },
            { name: "Shawarma", icon: "🌯" },
            { name: "Pizza", icon: "🍕" },
            { name: "Chicken", icon: "🍗" },
            { name: "Ice Cream", icon: "🍦" },
          ].map((item, i) => (
            <View key={i} style={styles.foodItem}>
              <Text style={styles.foodIcon}>{item.icon}</Text>
              <Text style={styles.foodLabel}>{item.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Food Categories */}

        <View>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 700,
              paddingHorizontal: 20,
              marginTop: 30,
            }}
          >
            Recently Visited
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              {
                image: "https://i.imgur.com/QZ5QZQy.jpg",
                name: "Burger King",
              },
              {
                image: "https://i.imgur.com/QZ5QZQy.jpg",
                name: "Amala For Real",
              },
              {
                image: "https://i.imgur.com/QZ5QZQy.jpg",
                name: "Chicken Republic",
              },
              {
                image: "https://i.imgur.com/QZ5QZQy.jpg",
                name: "Mr Tastie",
              },
            ].map((item, i) => (
              <View
                key={i}
                style={{
                  padding: 0,
                  margin: 15,
                  marginTop: 25,
                  alignItems: "flex-start",
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 250, height: 150, borderRadius: 16 }}
                />
                <TouchableOpacity style={styles.RCheart}>
                  <Ionicons name="heart" size={25} color="#fff" />
                </TouchableOpacity>
                <View
                  style={{
                    paddingHorizontal: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 250,
                    marginTop: 8,
                  }}
                >
                  <View>
                    <Text
                      style={{ marginTop: 6, fontWeight: 700, fontSize: 18 }}
                    >
                      {item.name}
                    </Text>
                    <Text style={styles.opentime}>Opens at 9:00am</Text>
                    <Text style={{ fontWeight: 700 }}>Reviews (36)</Text>
                  </View>
                  <Text>
                    <Ionicons name="star" size={14} color="#f5a623" /> 4.8
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Free Delivery Banner */}
        <View style={styles.delivery}>
          <View>
            <Text style={styles.deliveryTitle}>
              Free delivery on your first order
            </Text>
            <Text style={styles.deliverySub}>It's time to treat yourself</Text>
          </View>
          <Image
            source={require("../../assets/images/delieveryguy.png")}
            style={styles.deliveryImg}
          />
        </View>

        {/* Top Picks On Ovena */}

        <View style={{ marginBottom: 50 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 700,
              paddingHorizontal: 20,
              marginTop: 30,
            }}
          >
            Top Picks On Ovena
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              {
                image: "https://i.imgur.com/QZ5QZQy.jpg",
                name: "Pristina Hotel",
              },
              {
                image: "https://i.imgur.com/QZ5QZQy.jpg",
                name: "Amala For Real",
              },
              {
                image: "https://i.imgur.com/QZ5QZQy.jpg",
                name: "Chicken Republic",
              },
              {
                image: "https://i.imgur.com/QZ5QZQy.jpg",
                name: "transcorp hilton Hotel",
              },
            ].map((item, i) => (
              <View
                key={i}
                style={{
                  padding: 0,
                  margin: 15,
                  marginTop: 25,
                  alignItems: "flex-start",
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 250, height: 150, borderRadius: 16 }}
                />
                <TouchableOpacity style={styles.RCheart}>
                  <Ionicons name="heart" size={25} color="#fff" />
                </TouchableOpacity>
                <View
                  style={{
                    paddingHorizontal: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 250,
                    marginTop: 8,
                  }}
                >
                  <View>
                    <Text
                      style={{ marginTop: 6, fontWeight: 700, fontSize: 18 }}
                    >
                      {item.name}
                    </Text>
                    <Text style={styles.opentime}>Opens at 9:00am</Text>
                    <Text style={{ fontWeight: 700 }}>Reviews (36)</Text>
                  </View>
                  <Text>
                    <Ionicons name="star" size={14} color="#f5a623" /> 4.8
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Discounts */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            paddingHorizontal: 20,
            gap: 15,
            marginBottom: 30,
          }}
        >
          <Image
            source={require("../../assets/images/discountbanner.png")}
            style={{ width: 145, height: 145 }}
          />
          <View style={{ width: "60%" }}>
            <Text style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
              Enjoy a food discount and free delivery on your first order when
              you order now.
            </Text>
            <Text style={{ fontSize: 14, fontWeight: 300, lineHeight: 25 }}>
              There's nothing quite like seeing your child's face light up.
              After all their hard work and big achievements, give them a meal
              that puts a smile on their face and makes you feel like a
              superstar parent.
            </Text>
          </View>
        </View>

        {/* Restaurants */}
        <View style={{ height: 650 }}>
          <HomePageTabView />
        </View>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "700",
  },
  cart: {
    width: 55,
    height: 55,
    backgroundColor: "#D9502E",
    padding: 10,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "black",
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 13,
    padding: 3,
    borderRadius: 50,
  },

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
    marginHorizontal: 8,
  },

  chipContainer: {
    marginTop: 30,
    paddingHorizontal: 15,
  },

  chip: {
    backgroundColor: "#eee",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },

  chipText: {
    fontSize: 15,
  },

  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 30,
  },

  promoCard: {
    borderRadius: 24,
    paddingVertical: 0,
    paddingLeft: 20,
    paddingRight: 0,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",

    // Shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,

    // Shadow (Android)
    elevation: 6,
  },

  left: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
    marginTop: 2,
  },

  button: {
    marginTop: 16,
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 30,
    alignSelf: "flex-start",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  jellofimage: {
    width: 200,
    padding: 100,
    borderRadius: 24,
    marginBottom: -20,
  },

  foodRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginVertical: 10,
  },

  foodItem: {
    alignItems: "center",
    marginRight: 25,
  },

  foodIcon: {
    fontSize: 40,
    backgroundColor: "#0000000a",
    padding: 12,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 40,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 25,
  },

  foodLabel: {
    fontSize: 12,
    marginTop: 4,
  },

  opentime: {
    marginVertical: 5,
    color: "#B7AFA5",
    fontSize: 16,
    marginTop: 4,
  },

  delivery: {
    height: 160,
    flexDirection: "row",
    backgroundColor: "#f5a623",
    margin: 0,
    marginVertical: 50,
    padding: 0,
    paddingTop: 25,
    paddingLeft: 20,
    paddingRight: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  deliveryTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  deliverySub: {
    fontSize: 18,
  },
  deliveryImg: {
    width: 125,
    height: 125,
    marginBottom: -25,
  },
  RCheart: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#D9502E",
    padding: 10,
    borderRadius: 10,
  },
});
