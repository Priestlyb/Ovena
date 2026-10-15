import React from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { router } from "expo-router";

import { styles } from "@/constants/styles/FoodOrderTabView.styles";

export const RoomsTab = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        styles.roomContent
      }
    >
      <View style={styles.roomImage} />

      <Text>Diplomatic Suites</Text>

      <Text>
        The Diplomatic Suites are stately
        with ostentatious designs and
        breath-taking views of the Atlantic.
      </Text>

      <View style={styles.roomActions}>
        <View>
          <Text style={styles.roomAmenity}>
            <MaterialIcons
              name="pool"
              size={22}
            />{" "}
            Outdoor pool
          </Text>

          <Text style={styles.roomPrice}>
            $336,870
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push(
              "/(auth)/screens/RoomDetails",
            )
          }
          style={styles.viewRoomButton}
        >
          <Text
            style={
              styles.viewRoomButtonText
            }
          >
            View Room
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};