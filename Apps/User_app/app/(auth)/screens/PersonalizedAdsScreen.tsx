import { StyleSheet, Text, TouchableOpacity, View, Switch } from "react-native";
import React, { useState } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";

export default function PersonalizedAdsScreen() {
  const [adsEnabled, setAdsEnabled] = useState(true);

  const toggleSwitch = () => setAdsEnabled((prev) => !prev);

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
          onPress={() => router.replace("/(auth)/screens/ManagePrivacy")}
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
          Personalized ads
        </Text>
        <View style={{ width: 34 }} />
      </View>

      <View style={{ paddingHorizontal: 30, paddingVertical: 10, gap: 20 }}>
        <Text style={{ fontSize: 16, lineHeight: 20 }}>
          Your data helps us improve and when enabled, show you relevant deals
          and promotions
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between", // 👈 important for spacing
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              flex: 1,
            }}
          >
            <IconSymbol name="LogoThreads" size={22} color={"#000"} />
            <Text style={{ fontSize: 16 }}>
              Receive special deals and promotions
            </Text>
          </View>

          <Switch
            value={adsEnabled}
            onValueChange={toggleSwitch}
            trackColor={{ false: "#ccc", true: "#D9502E" }}
            thumbColor={adsEnabled ? "#fff" : "#ccc"}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
