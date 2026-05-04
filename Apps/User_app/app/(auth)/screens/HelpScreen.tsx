import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function HelpScreen() {
  return (
    <View style={{ flex: 1, marginTop: 55 }}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 50,
          alignItems: "center",
          marginBottom: 20,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/profile")}
          style={{
            padding: 10,
            borderColor: "#000",
            borderWidth: 1,
            borderRadius: 50,
          }}
        >
          <IconSymbol name="ArrowLeftIcon" size={22} color={"#000"} />
        </TouchableOpacity>

        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Help Center</Text>
        <View style={{ width: 34 }} />
      </View>

      <View style={{ paddingHorizontal: 20, gap: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          How can we help you?
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.replace("/(auth)/screens/HelpScreen");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
            >
              <IconSymbol
                name="BriefcaseOutlineIcon"
                size={24}
                color={"#000"}
              />
              <Text style={{ fontSize: 18 }}>Help with an order</Text>
            </View>
            <IconSymbol name="ChevronRightIcon" size={20} color={"#000"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.replace("/(auth)/screens/NotRelatedToAnOrder");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
            >
              <IconSymbol name="UserIcon" size={24} color={"#000"} />
              <Text style={{ fontSize: 18 }}>Not related to an order</Text>
            </View>
            <IconSymbol name="ChevronRightIcon" size={20} color={"#000"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.replace("/(auth)/screens/HelpScreen");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
            >
              <IconSymbol name="EmailIcon" size={24} color={"#000"} />
              <Text style={{ fontSize: 18 }}>Inbox</Text>
            </View>
            <IconSymbol name="ChevronRightIcon" size={20} color={"#000"} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
