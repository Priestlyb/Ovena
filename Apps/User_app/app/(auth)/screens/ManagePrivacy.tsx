import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";

export default function ManagePrivacy() {
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
          onPress={() => router.replace("/(auth)/screens/AccountScreen")}
          style={{
            padding: 10,
            borderColor: "#000",
            borderWidth: 1,
            borderRadius: 50,
          }}
        >
          <IconSymbol name="ArrowLeftIcon" size={22} color={"#000"} />
        </TouchableOpacity>

        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Manage privacy</Text>
        <View style={{ width: 34 }} />
      </View>

      <TouchableOpacity onPress={() => router.replace("/(auth)/screens/PersonalizedAdsScreen")}>
      <View style={{
        paddingHorizontal: 30,
        paddingVertical: 10, display: "flex", flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between"
      }}>
        <View style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
        <IconSymbol name="SettingsIcon" size={24} color={"#000"} />
      <Text>Personalized ads</Text>
      </View>

      <IconSymbol name="ChevronRightIcon" size={20} color={"#000"} />
      </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
