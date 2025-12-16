import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

/* -------------------- COMPONENTS -------------------- */

const Section = ({
  title,
  children,
  onSeeAll,
}: {
  title: string;
  children: React.ReactNode;
  onSeeAll?: () => void;
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
    {children}
  </View>
);

const AddBtn = () => (
  <TouchableOpacity style={styles.addBtn}>
    <Ionicons name="add" size={18} color="#fff" />
  </TouchableOpacity>
);

const PromoCard = ({
  title,
  price,
  oldPrice,
  first,
}: {
  title: string;
  price: string;
  oldPrice?: string;
  first?: boolean;
}) => (
  <View style={[styles.promoCard, first && { marginLeft: 16 }]}>
    <View>
    <View style={styles.promoImage} />
    <AddBtn />
    </View>
    <Text style={styles.itemTitle}>{title}</Text>
    <Text style={styles.price}>{price}</Text>
    {oldPrice && <Text style={styles.oldPrice}>{oldPrice}</Text>}
  </View>
);

function ListItem({ title, price }: { title: string; price: string; }) {
  return (
    <View style={styles.listItem}>
      <View>
        <Text style={styles.timeText}>30–45 min</Text>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
      <AddBtn />
    </View>
  );
}

const DealItem = ({
  title,
  price,
  oldPrice,
}: {
  title: string;
  price: string;
  oldPrice: string;
}) => (
  <View style={styles.listItem}>
    <View>
      <Text style={styles.timeText}>30–45 min</Text>
      <Text style={styles.itemTitle}>{title}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.oldPriceSmall}>{oldPrice}</Text>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>40%</Text>
        </View>
      </View>
    </View>
    <AddBtn />
  </View>
);

/* -------------------- FOODS TAB -------------------- */

const FoodsTab = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    "Promotions",
    "Top Sellers",
    "The Chicken Fest Deals",
    "Exclusive Deals",
  ];

  const handleSeeAll = (category: string) => {
    console.log(`See all items in category: ${category}`);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Category Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 16 }}
      >
        <TouchableOpacity
          key="all"
          onPress={() => setActiveCategory(null)}
          style={[
            styles.categoryChip,
            activeCategory === null && styles.activeCategoryChip,
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              activeCategory === null && styles.activeCategoryText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActiveCategory(item)}
            style={[
              styles.categoryChip,
              activeCategory === item && styles.activeCategoryChip,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === item && styles.activeCategoryText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sections */}
      {(activeCategory === null || activeCategory === "Promotions") && (
        <Section title="Promotions" onSeeAll={() => handleSeeAll("Promotions")}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <PromoCard
              title="3 for 5k Deal"
              price="₦5,000.00"
              oldPrice="₦8,333.33"
              first
            />
            <PromoCard title="Wing 40% off" price="₦5,000.00" oldPrice="₦8,333.33" />
          </ScrollView>
        </Section>
      )}

      {(activeCategory === null || activeCategory === "Top Sellers") && (
        <Section title="Top Sellers" onSeeAll={() => handleSeeAll("Top Sellers")}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <PromoCard title="3 for 5k Deal" price="₦5,000.00" first />
            <PromoCard title="Wing 40% off" price="₦5,000.00" />
          </ScrollView>
        </Section>
      )}

      {(activeCategory === null || activeCategory === "The Chicken Fest Deals") && (
        <Section
          title="Chicken Fest Deals"
          onSeeAll={() => handleSeeAll("Chicken Fest Deals")}
        >
          <ListItem title="Wing 40% off" price="₦9,750.00" />
          <ListItem title="Wing 40% off" price="₦9,750.00" />
        </Section>
      )}

      {(activeCategory === null || activeCategory === "Exclusive Deals") && (
        <Section title="Exclusive Deals" onSeeAll={() => handleSeeAll("Exclusive Deals")}>
          <DealItem title="Wing 40% off" price="₦9,750.00" oldPrice="₦15,000.00" />
          <DealItem title="Wing 40% off" price="₦9,750.00" oldPrice="₦15,000.00" />
        </Section>
      )}
    </ScrollView>
  );
};

/* -------------------- ROOMS TAB -------------------- */

const RoomsTab = () => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ padding: 25 }}
  >
    <View style={styles.roomImage} />
    <Text>Diplomatic Suites</Text>
    <Text>The Diplomatic Suites are stately with ostentatious designs and breath-taking views of the Atlantic. The suite has a DVD Player, Hi Definition LED TVs, and a separate lounge, bar and dining area for guests. It has an adjoining standard room that makes it perfect for a large family</Text>
    <View  style={styles.roomactions}>
      <View>
        <Text style={styles.roomAmenity}><MaterialIcons name="pool" size={22} /> Outdoor pool</Text>
        <Text style={styles.roomPrice}>$336,870</Text>
      </View>
        <TouchableOpacity style={styles.viewRoomButton}><Text style={{ color: "#fff" }}>View Room</Text></TouchableOpacity>
    </View>
  </ScrollView>
);

/* -------------------- TAB VIEW -------------------- */

const DealsTabs = () => {
  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "foods", title: "Foods" },
    { key: "rooms", title: "Rooms" },
  ]);

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case "foods":
        return <FoodsTab />;
      case "rooms":
        return <RoomsTab />;
      default:
        return null;
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#D9502E", height: 2 }}
      style={{ backgroundColor: "#fff", elevation: 0 }}
      activeColor="#000"
      inactiveColor="#888"
      renderLabel={({ route, focused }: { route: any; focused: boolean }) => (
        <Text
          style={{
            color: "#000",
            fontWeight: focused ? "700" : "500",
            fontSize: 16,
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
    />
  );
};

/* -------------------- MAIN COMPONENT -------------------- */

export default function FoodOrderTabView() {
  return (
    <View style={{ flex: 1 }}>
      <DealsTabs />
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginHorizontal: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  seeAllText: { color: "#D9502E", fontWeight: "600" },
  promoCard: { width: 160, marginRight: 16, borderRadius: 12, padding: 8, backgroundColor: "#fff" },
  promoImage: { height: 100, backgroundColor: "#eee", borderRadius: 12, marginBottom: 8 },
  roomImage: { height: 200, backgroundColor: "#eee", borderRadius: 12, marginBottom: 8 },
  itemTitle: { fontSize: 14, fontWeight: "600" },
  price: { fontSize: 14, fontWeight: "700", marginTop: 4 },
  oldPrice: { fontSize: 12, textDecorationLine: "line-through", color: "#999" },
  listItem: { flexDirection: "row", justifyContent: "space-between", padding: 16, backgroundColor: "#fff", borderRadius: 12, marginBottom: 12 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  oldPriceSmall: { fontSize: 12, textDecorationLine: "line-through", color: "#999" },
  discountBadge: { backgroundColor: "#F6D44F", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  discountText: { color: "#000", fontSize: 13, fontWeight: "700" },
  foodItem: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: "#fff", borderRadius: 12, marginBottom: 12 },
  foodImg: { width: 60, height: 60, backgroundColor: "#eee", borderRadius: 8, marginRight: 12 },
  addBtn: { position: "absolute", bottom: 15, right: 5, width: 32, backgroundColor: "#D9502E", padding: 6, borderRadius: 20 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: "#eee", marginHorizontal: 8 },
  activeCategoryChip: { backgroundColor: "#D9502E" },
  categoryText: { fontSize: 14, fontWeight: "500" },
  activeCategoryText: { color: "#fff" },
  timeText: { fontSize: 12, color: "#000000", fontWeight: "600" },

  /* -------------------- ROOMS TAB -------------------- */

  roomactions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16 },
  roomAmenity: { fontSize: 16, fontWeight: "500" },
  roomPrice: { fontSize: 18, fontWeight: "700", marginTop: 4 },
  viewRoomButton: { fontWeight: "700", backgroundColor: "#D9502E", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8  },
});
