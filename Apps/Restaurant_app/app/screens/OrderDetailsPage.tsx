// app/screens/OrderDetailsPage.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";

import { profileBookingStyles } from "@/constants/profile-booking-styles";
import { styles } from "@/constants/styles";
import { ArrowLeft, MapPin, Phone, User } from "lucide-react-native";

import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { InfoCard, InfoRow } from "@/components/InfoCard";
import { Header } from "@/components/molecules/Header";
import { StatusButton } from "@/components/StatusButton";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  let order: any = null;

  try {
    if (params.order) {
      order = JSON.parse(decodeURIComponent(params.order as string));
    }
  } catch (e) {
    console.log("Parse error:", e);
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: 20 }}>
          <Text variant="h3">Order not found</Text>
          <Spacer size="sm" />
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: "#FF6B35" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatTime = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Header
            title="Order Details"
            leftIcon={<ArrowLeft size={24} />}
            onLeftIconPress={() => router.back()}
          />

          <Spacer size="xl" />

          <View style={profileBookingStyles.bookingCodeContainer}>
            <Text variant="body">Order ID</Text>
            <Text variant="h4" weight="bold" style={{ color: "#FF6B35" }}>
              {order.orderId || order.id}
            </Text>
          </View>

          <Spacer size="md" />

          <View style={{ alignItems: "center" }}>
            <StatusButton status={order.status} />
          </View>

          <Spacer size="xl" />

          <InfoCard title={order.itemName || "Order"} showShadow>
            <InfoRow label="Type" value={order.type} bold />
            <InfoRow
              label="Price"
              value={order.price ? `₦${order.price}` : "Pending"}
              bold
            />
            <InfoRow label="Time" value={formatTime(order.time)} />
          </InfoCard>

          <Spacer size="lg" />

          <InfoCard title="Customer">
            <View style={{ flexDirection: "row", gap: 12 }}>
              <User size={20} />
              <Text>{order.customerName || "—"}</Text>
            </View>

            <Spacer size="sm" />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <Phone size={20} />
              <Text>{order.customerPhone || "—"}</Text>
            </View>
          </InfoCard>

          {order.delivery_address && (
            <>
              <Spacer size="lg" />
              <InfoCard title="Address">
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <MapPin size={20} />
                  <Text>{order.delivery_address}</Text>
                </View>
              </InfoCard>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
