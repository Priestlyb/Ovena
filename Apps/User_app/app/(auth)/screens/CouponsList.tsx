import React from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCouponsList } from "@/hooks/spinTheWheel/useCouponsList";
import { useTheme } from "@/constants/theme";
import { createStyles } from "@/constants/styles/CouponsList.styles";

export default function CouponsList() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const { data, isLoading, error } = useCouponsList();

  // DEBUG LOGS
  console.log("COUPONS DATA:", data);
  console.log("COUPONS ERROR:", error);
  console.log("COUPONS LOADING:", isLoading);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.8}
        >
          <IconSymbol
            name="ArrowLeftIcon"
            size={22}
            color={theme.textPrimary}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          Coupons
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(auth)/screens/CouponsHistory")}
        >
          <Text
            style={[
              styles.historyText,
              {
                color: theme.primary,
                borderBottomColor: theme.secondary,
              },
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, width: "100%" }}>
        {isLoading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}

        {!isLoading && error && (
          <Text
            style={{
              textAlign: "center",
              color: theme.error,
              marginTop: 40,
            }}
          >
            Failed to load coupons
          </Text>
        )}

        {!isLoading &&
          !error &&
          data?.map((item) => {
            const daysLeft = Math.ceil(item.coupon.time_left_seconds / 86400);

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
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.couponExpireDate,
                      {
                        backgroundColor: theme.textPrimary,
                        color: theme.background,
                      },
                    ]}
                  >
                    Expires in {daysLeft} days
                  </Text>

                  <View style={{ marginBottom: 8 }}>
                    <IconSymbol
                      name="CashMinusIcon"
                      size={100}
                      color={theme.primary}
                    />
                  </View>

                  <Text
                    style={[
                      styles.couponNoteText,
                      {
                        color: theme.textPrimary,
                      },
                    ]}
                  >
                    {item.coupon.description}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.couponCode,
                    {
                      backgroundColor: theme.primary,
                      color: "#FFFFFF",
                    },
                  ]}
                >
                  {item.coupon.code}
                </Text>
              </View>
            );
          })}

        {!isLoading && !error && data?.length === 0 && (
          <Text
            style={{
              textAlign: "center",
              marginTop: 50,
              color: theme.textSecondary,
            }}
          >
            No coupons available.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
