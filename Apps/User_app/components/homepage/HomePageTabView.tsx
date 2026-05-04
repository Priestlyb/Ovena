import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Ionicons } from "@expo/vector-icons";

/* -------------------- TYPES -------------------- */
type Restaurant = {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  openTime: string;
  image: string;
};

type TabRoute = {
  key: string;
  title: string;
};

/* -------------------- DATA -------------------- */
const Restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Burger King",
    rating: 4.8,
    reviews: 36,
    openTime: "Opens at 9:00am",
    image: "https://i.imgur.com/QZ5QZQy.jpg",
  },
  {
    id: 2,
    name: "Chicken Republic",
    rating: 4.6,
    reviews: 42,
    openTime: "Opens at 8:00am",
    image: "https://i.imgur.com/QZ5QZQy.jpg",
  },
];

const Hotels: Restaurant[] = [
  {
    id: 3,
    name: "Amala For Real",
    rating: 4.7,
    reviews: 21,
    openTime: "Opens at 10:00am",
    image: "https://i.imgur.com/QZ5QZQy.jpg",
  },
];

/* -------------------- CARD -------------------- */
const RestaurantCard = ({ item }: { item: Restaurant }) => (
  <View style={styles.restaurantCard}>
    <View>
      <Image source={{ uri: item.image }} style={styles.restaurantImg} />

      <TouchableOpacity style={styles.heart}>
        <Ionicons name="heart-outline" size={22} color="#000" />
      </TouchableOpacity>
    </View>

    <View style={styles.restaurantInfo}>
      <View style={{ gap: 15 }}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.open}>{item.openTime}</Text>
      </View>

      <View style={{ alignItems: "flex-end", gap: 15 }}>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#f5a623" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.reviews}>({item.reviews} Reviews)</Text>
      </View>
    </View>
  </View>
);

/* -------------------- TAB LIST -------------------- */
const RestaurantList = ({ data }: { data: Restaurant[] }) => (
  <ScrollView
    contentContainerStyle={{
      paddingHorizontal: 16,
      paddingVertical: 8,
    }}
    showsVerticalScrollIndicator={false}
  >
    {data.map((item) => (
      <RestaurantCard key={item.id} item={item} />
    ))}
  </ScrollView>
);

/* -------------------- TAB VIEW -------------------- */
const RestaurantsTabs = () => {
  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);

  const routes = [
    { key: "Restaurants", title: "Restaurants" },
    { key: "Hotels", title: "Hotels" },
  ];

  const renderScene = ({ route }: { route: TabRoute }) => {
    switch (route.key) {
      case "Restaurants":
        return <RestaurantList data={Restaurants} />;
      case "Hotels":
        return <RestaurantList data={Hotels} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#F63607", height: 2 }}
      style={{ backgroundColor: "#fff", elevation: 0, marginBottom: 45 }}
      activeColor="#000"
      inactiveColor="#000"
      renderLabel={({
        route,
        focused,
      }: {
        route: TabRoute;
        focused: boolean;
      }) => (
        <Text
          style={{
            color: "#000",
            fontSize: 16,
            fontWeight: focused ? "700" : "500",
          }}
        >
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
      style={{ height: "100%" }}
    />
  );
};

/* -------------------- PAGE -------------------- */
export default function RestaurantsPage() {
  return (
    <View style={{ flex: 1 }}>
      <RestaurantsTabs />
    </View>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  restaurantCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    overflow: "hidden",
  },
  restaurantImg: {
    width: "100%",
    height: 150,
  },
  heart: {
    position: "absolute",
    right: 12,
    bottom: 12,
    backgroundColor: "#F6D44F",
    padding: 6,
    borderRadius: 20,
  },
  restaurantInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "700",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  rating: {
    marginLeft: 4,
    fontWeight: "600",
  },
  reviews: {
    marginLeft: 4,
    color: "#777",
    fontSize: 12,
  },
  open: {
    fontSize: 12,
    color: "#04A0AD",
    fontWeight: "600",
  },
});
