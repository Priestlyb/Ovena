// app/delivery-or-pickup.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function DeliveryOrPickUp() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Delivery or Pick Up
      </Text>

      <TouchableOpacity
        onPress={() => router.replace("/(tabs)/homepage")}
        style={{ padding: 15, backgroundColor: "#eb7207dd", borderRadius: 8 }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
