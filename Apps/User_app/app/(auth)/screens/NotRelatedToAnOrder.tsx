import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";

export default function NotRelatedToAnOrder() {
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
          onPress={() => router.replace("/(auth)/screens/HelpScreen")}
          style={{
            padding: 10,
            borderColor: "#000",
            borderWidth: 1,
            borderRadius: 50,
          }}
        >
          <IconSymbol name="ArrowLeftIcon" size={22} color={"#000"} />
        </TouchableOpacity>

        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          Not related to an order
        </Text>
        <View style={{ width: 34 }} />
      </View>
      <View style={{ marginTop: 20, paddingHorizontal: 30, gap: 25 }}>
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
                name="UserOutlineIcon"
                size={24}
                color={"#000"}
              />
              <Text style={{ fontSize: 18 }}>My account details</Text>
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
              <IconSymbol
                name="LocationDotIcon"
                size={24}
                color={"#000"}
              />
              <Text style={{ fontSize: 18 }}>Work with us</Text>
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
              <IconSymbol
                name="LawIcon"
                size={24}
                color={"#000"}
              />
              <Text style={{ fontSize: 18 }}>Our Policies</Text>
            </View>
            <IconSymbol name="ChevronRightIcon" size={20} color={"#000"} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
