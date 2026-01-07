// app/(tabs)/favorite.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { IconSymbol } from "../../components/ui/icon-symbol";

const Tab = createMaterialTopTabNavigator();

// Sample product data
const products = [
  { id: "1", name: "Classic Cheese Burger", price: "$17.50", rating: 4.8, image: require("../../assets/images/foodImage.png") },
  { id: "2", name: "Veggie Pizza", price: "$12.00", rating: 4.5, image: require("../../assets/images/foodImage.png") },
  { id: "3", name: "Spaghetti Pasta", price: "$15.00", rating: 4.7, image: require("../../assets/images/foodImage.png") },
  { id: "4", name: "Chicken Salad", price: "$10.50", rating: 4.6, image: require("../../assets/images/foodImage.png") },
];

const numColumns = 2;
const ITEM_WIDTH = Dimensions.get("window").width / numColumns - 24;

// Foods Tab
function FoodsScreen() {
  const renderItem = ({ item }: { item: typeof products[0] }) => (
    <View style={[styles.foodContainer, { width: ITEM_WIDTH }]}>
      <View style={styles.foodImageCover}>
        <Image source={item.image} style={styles.foodImage} resizeMode="contain" />
        <View style={styles.cart}>
          <IconSymbol name="CartIcon" size={24} color={"black"} />
        </View>
      </View>
      <View style={styles.foodDetails}>
        <Text style={styles.foodDetailsText}>{item.name}</Text>
        <Text style={styles.foodDetailsText}>
          <IconSymbol name="StarIcon" size={16} color={"gold"} /> {item.rating}
        </Text>
        <Text style={styles.foodDetailsText}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.scene}
      columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

// Rooms Tab
function RoomsScreen() {
  return (
    <View style={styles.scene}>
      <Text>Rooms</Text>
    </View>
  );
}

// Header Component
function FavoriteHeader() {
  return (
    <View style={styles.header}>
      <View style={{ width: 10 }}/>

      <Text style={styles.headerTitle}>Favorites</Text>

      <View style={{ width: 24 }} />
    </View>
  );
}

// Main Tab Screen
export default function Favorites() {
  return (
    <View style={styles.container}>
      <FavoriteHeader />

      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: "#F63607", height: 2 },
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#888",
          tabBarLabelStyle: { fontSize: 16, fontWeight: "600", textTransform: "capitalize" },
          tabBarStyle: { backgroundColor: "#fff" },
        }}
      >
        <Tab.Screen name="Foods" component={FoodsScreen} />
        <Tab.Screen name="Rooms" component={RoomsScreen} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    height: 50,
  },
  arrowback: { borderWidth: 1, borderColor: "#000", borderRadius: 50, padding: 10 },
  headerTitle: { fontSize: 24, fontWeight: "600", color: "#000" },
  scene: { paddingHorizontal: 12, paddingTop: 20, backgroundColor: "#fff" },
  foodContainer: { marginBottom: 20 },
  foodImageCover: {
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 1,
    padding: 15,
    aspectRatio: 1,
    borderRadius: 20,
    marginBottom: 10,
  },
  foodImage: { width: "100%", height: "100%" },
  cart: { position: "absolute", bottom: -10, right: 0, padding: 8, backgroundColor: "#F8BD00", borderRadius: 50 },
  foodDetails: { gap: 4 },
  foodDetailsText: { fontWeight: "bold", fontSize: 14 },
});
