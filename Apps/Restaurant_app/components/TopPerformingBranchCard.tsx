// components/TopPerformingBranchCard.tsx
import React from "react";
import { View } from "react-native";
import { Text } from "@/components/atoms/Text";
import { Spacer } from "@/components/atoms/Spacer";

type Props = {
  branchName?: string;
  revenue?: number;
  orders?: number;
};

export const TopPerformingBranchCard = ({
  branchName,
  revenue,
  orders,
}: Props) => {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>
        Top Performing Branch
      </Text>

      <Spacer size="md" />

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ color: "#00000080" }}>Branch</Text>
            <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 4 }}>
              {branchName || "—"}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#FFEDD5",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "#FF5A1F", fontWeight: "600" }}>
              Top Seller
            </Text>
          </View>
        </View>

        <Spacer size="md" />

        {/* STATS */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ color: "#00000080" }}>Revenue</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: "#FF5A1F",
                marginTop: 4,
              }}
            >
              ₦{Number(revenue || 0).toLocaleString()}
            </Text>
          </View>

          <View>
            <Text style={{ color: "#00000080" }}>Orders</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                marginTop: 4,
              }}
            >
              {orders || 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};