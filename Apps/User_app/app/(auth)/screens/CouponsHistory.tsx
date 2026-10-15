import React from "react";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCouponsList } from "@/hooks/spinTheWheel/useCouponsList";
import { useTheme } from "@/constants/theme";
import { createStyles } from "@/constants/styles/CouponsHistory.styles";

export default function CouponsHistory() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const { data } = useCouponsList();

  const historyCoupons =
    data?.filter((item) => item.is_used || item.is_expired) || [];

  const getStatus = (item: any) => {
    if (item.is_used) return "Used";
    if (item.is_expired) return "Expired";
    return "Active";
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <IconSymbol
            name="ArrowLeftIcon"
            size={22}
            color={theme.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.title}>History</Text>

        <View style={{ width: 44 }} />
      </View>

      {/* Empty State */}
      {historyCoupons.length === 0 ? (
        <View
          style={{
            marginTop: 80,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconSymbol
            name="CashMinusIcon"
            size={90}
            color={theme.textSecondary}
          />

          <Text
            style={{
              marginTop: 18,
              fontSize: 18,
              fontWeight: "700",
              color: theme.textPrimary,
            }}
          >
            No Coupon History
          </Text>

          <Text
            style={{
              marginTop: 8,
              textAlign: "center",
              color: theme.textSecondary,
              lineHeight: 22,
              paddingHorizontal: 24,
            }}
          >
            Used and expired coupons will appear here.
          </Text>
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            marginTop: 12,
            paddingBottom: 30,
          }}
        >
          {historyCoupons.map((item) => {
            const status = getStatus(item);

            return (
              <View
                key={item.id}
                style={{
                  marginBottom: 24,
                }}
              >
                <View
                  style={[
                    styles.couponsContainer,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={{ marginBottom: 10 }}>
                    <IconSymbol
                      name="CashMinusIcon"
                      size={95}
                      color={theme.textSecondary}
                    />
                  </View>

                  <Text
                    style={[
                      styles.couponNoteText,
                      {
                        color: theme.textSecondary,
                      },
                    ]}
                  >
                    {item.coupon.description}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.couponCode,
                    status === "Used"
                      ? styles.used
                      : status === "Expired"
                        ? styles.expired
                        : {
                            backgroundColor: theme.primary,
                            borderColor: theme.primary,
                            color: "#FFFFFF",
                          },
                  ]}
                >
                  {status}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
