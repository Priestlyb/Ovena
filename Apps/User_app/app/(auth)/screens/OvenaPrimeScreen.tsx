import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import PlanCard from "@/components/subscription/PlanCard";
import { plans } from "@/data/plans";

export default function OvenaPrimeScreen() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: 55, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/profile")}
          style={styles.backBtn}
        >
          <IconSymbol name="ArrowLeftIcon" size={22} color={"#000"} />
        </TouchableOpacity>

        <Text style={styles.title}>Ovena Prime</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* Plans */}
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtn: {
    padding: 10,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
