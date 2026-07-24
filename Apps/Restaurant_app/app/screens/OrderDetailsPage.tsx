// app/screens/OrderDetailsPage.tsx

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "@/constants/styles";

import {
  ArrowLeft,
  MapPin,
  Receipt,
  ShoppingBag,
  Store,
} from "lucide-react-native";

import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { InfoCard, InfoRow } from "@/components/InfoCard";
import { Header } from "@/components/molecules/Header";
import { StatusButton } from "@/components/StatusButton";

import useOrderDetail from "@/hooks/staff/useOrderDetail";

export default function OrderDetailsPage() {
  const router = useRouter();

  const { order: encodedOrder } = useLocalSearchParams<{
    order?: string;
  }>();

  const routeOrder = useMemo(() => {
    try {
      if (!encodedOrder) return null;

      return JSON.parse(decodeURIComponent(encodedOrder));
    } catch (err) {
      console.error("[ORDER DETAILS] Failed to parse order param", err);
      return null;
    }
  }, [encodedOrder]);

  const orderId = routeOrder?.orderId || routeOrder?.id;

  const { order, loading, error, refetch } = useOrderDetail(orderId);

  const formatTime = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "numeric",
      month: "short",
    });
  };

  if (!routeOrder || !orderId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: 20 }}>
          <Text variant="h3">Invalid order</Text>

          <Spacer size="sm" />

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: "#FF6B35" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#F84E10" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: 20 }}>
          <Text variant="h3">Failed to load order</Text>

          <Spacer size="sm" />

          <Text>{error}</Text>

          <Spacer size="md" />

          <TouchableOpacity onPress={refetch}>
            <Text style={{ color: "#FF6B35" }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
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

  const firstItem = order.items?.[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <View style={{ padding: 20 }}>
          <Header
            title="Order Details"
            leftIcon={<ArrowLeft size={24} />}
            onLeftIconPress={() => router.back()}
          />

          <Spacer size="xl" />

          {/* Hero Card */}
          <View
            style={{
              backgroundColor: "#FFF5F1",
              borderRadius: 24,
              padding: 24,
            }}
          >
            <Text variant="body">Order #{order.id}</Text>

            <Spacer size="xs" />

            <Text variant="h1" weight="bold">
              ₦{Number(order.grand_total).toLocaleString()}
            </Text>

            <Spacer size="md" />

            <StatusButton status={order.status} />
          </View>

          <Spacer size="xl" />

          <InfoCard
            title={
              firstItem?.snapshot?.item?.name || routeOrder?.itemName || "Order"
            }
            icon={<Store size={18} color="#F84E10" />}
          >
            <InfoRow label="Branch" value={order.branch_name || "—"} bold />

            <InfoRow label="Created" value={formatTime(order.created_at)} />
          </InfoCard>

          <Spacer size="lg" />

          <InfoCard
            title="Branch Address"
            icon={<MapPin size={18} color="#F84E10" />}
          >
            <Text>{order.branch_address || "—"}</Text>
          </InfoCard>

          <Spacer size="lg" />

          <InfoCard
            title="Items"
            icon={<ShoppingBag size={18} color="#F84E10" />}
          >
            {order.items?.map((item: any, index: number) => (
              <View key={index}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                  }}
                >
                  <Image
                    source={{
                      uri: item.snapshot?.item?.image,
                    }}
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 12,
                    }}
                    resizeMode="cover"
                  />

                  <View
                    style={{
                      flex: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <Text variant="h4" weight="bold">
                      {item.snapshot?.item?.name}
                    </Text>

                    <Text color="secondary">Qty: {item.quantity}</Text>

                    <Text weight="bold">
                      ₦{Number(item.line_total).toLocaleString()}
                    </Text>
                  </View>
                </View>

                {!!item.snapshot?.options?.length && (
                  <>
                    <Spacer size="sm" />

                    <InfoRow
                      label="Options"
                      value={item.snapshot.options.join(", ")}
                    />
                  </>
                )}

                {!!item.snapshot?.addons?.length && (
                  <InfoRow
                    label="Addons"
                    value={item.snapshot.addons.join(", ")}
                  />
                )}

                {index < order.items.length - 1 && (
                  <>
                    <Spacer size="md" />

                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#ECECEC",
                      }}
                    />

                    <Spacer size="md" />
                  </>
                )}
              </View>
            ))}
          </InfoCard>

          <Spacer size="lg" />

          <InfoCard
            title="Order Summary"
            icon={<Receipt size={18} color="#F84E10" />}
          >
            <InfoRow label="Order ID" value={String(order.id)} />

            <InfoRow label="Order Number" value={String(order.order_number)} />

            <InfoRow label="Status" value={order.status} />
          </InfoCard>

          <Spacer size="lg" />

          {/* Total Card */}
          <View
            style={{
              backgroundColor: "#111827",
              borderRadius: 20,
              padding: 24,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                opacity: 0.8,
              }}
            >
              Grand Total
            </Text>

            <Spacer size="xs" />

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 30,
                fontWeight: "700",
              }}
            >
              ₦{Number(order.grand_total).toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
