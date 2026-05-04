import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";

export default function MyAccountDetails() {
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
      <Text>MyAccountDetails</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
