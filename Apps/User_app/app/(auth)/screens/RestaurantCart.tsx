import React, { useEffect, useMemo, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import { Swipeable } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

import { useCartStore } from "@/src/store/cartStore";

import { IconSymbol } from "@/components/ui/icon-symbol";
import FeeInformation from "@/src/modals/FeeInformationModal";

import { createStyles } from "@/constants/styles/restaurantCartStyles";

import { useTheme } from "@/constants/theme";

import useOrderCalculations from "@/hooks/orders/useOrderCalculations";
import { useDeviceLocation } from "@/hooks/Location/useDeviceLocation";

const RestaurantCartScreen = () => {
  const router = useRouter();

  const theme = useTheme();

  const styles = createStyles(theme);

  const [showFees, setShowFees] = useState(false);

  const calculations = useCartStore((s) => s.calculations);

  const setCalculation = useCartStore((s) => s.setCalculation);

  const carts = useCartStore((s) => s.carts);

  const clearBranch = useCartStore((s) => s.clearBranch);

  const branches = useMemo(() => Object.entries(carts || {}), [carts]);

  const { calculateOrder } = useOrderCalculations();

  const { coords, getLocation } = useDeviceLocation();

  const getBranchTotal = (items: any[]) =>
    items.reduce((sum, item) => sum + Number(item.line_total || 0), 0);

  /* ================= CALCULATIONS ================= */

  useEffect(() => {
    let mounted = true;

    const fetchCalculations = async () => {
      try {
        const currentCoords = coords || (await getLocation());

        if (!currentCoords) {
          console.log("[ORDER CALCULATIONS] No location");

          return;
        }

        for (const [branchId, items] of branches) {
          const numericBranchId = Number(branchId);

          if (calculations[numericBranchId]) {
            continue;
          }

          try {
            const response = await calculateOrder(
              {
                branch_id: numericBranchId,

                lat: currentCoords.lat,

                long: currentCoords.lng,
              },

              items as any[],
            );

            if (mounted && response.success && response.data) {
              setCalculation(numericBranchId, response.data);
            }
          } catch (error) {
            console.log(`[ORDER CALC ERROR] ${branchId}`, error);
          }
        }
      } catch (error) {
        console.log("[CALCULATION FETCH ERROR]", error);
      }
    };

    if (branches.length) {
      fetchCalculations();
    }

    return () => {
      mounted = false;
    };
  }, [branches.length]);

  /* ================= FEES ================= */

  const totalProcessingFee = Object.values(calculations).reduce(
    (sum: number, calc: any) => sum + Number(calc?.raw?.delivery_amount ?? 0),

    0,
  );

  const totalServiceFee = branches.reduce(
    (sum, [branchId, items]) => {
      const calc = calculations[Number(branchId)];

      const subtotal = getBranchTotal(items as any[]);

      const percent = Number(
        calc?.service_fee_percent ?? calc?.raw?.service_fee_percent ?? 0,
      );

      return sum + (subtotal * percent) / 100;
    },

    0,
  );

  const openBranch = (branchId: string) => {
    const calculation = calculations[Number(branchId)];

    if (!calculation) {
      return;
    }

    const serviceFeePercent = Number(
      calculation?.raw?.service_fee_percent ?? 0,
    );

    router.push({
      pathname: "/screens/CartScreen",

      params: {
        branchId,

        deliveryFee: String(calculation?.delivery_price ?? 0),

        serviceFee: String(serviceFeePercent),
      },
    });
  };

  const renderRightActions = (branchId: string) => (
    <TouchableOpacity
      onPress={() => clearBranch(Number(branchId))}

      style={styles.deleteAction}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  /* ================= EMPTY ================= */

  if (!branches.length) {
    return (
      <View style={styles.screenContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}

            style={styles.backBtn}
          >
            <IconSymbol name="ArrowLeftIcon" size={22} color={theme.icon} />
          </TouchableOpacity>

          <Text style={styles.title}>Restaurants Cart</Text>

          <View
            style={{
              width: 34,
            }}
          />
        </View>

        <View style={styles.emptyContainer}>
          <IconSymbol
            name="CartOffIcon"

            size={90}

            color={theme.textSecondary}
          />

          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>

        <FeeInformation
          visible={showFees}

          onClose={() => setShowFees(false)}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.screenContainer}>
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}

            style={styles.backBtn}
          >
            <IconSymbol
              name="ArrowLeftIcon"

              size={22}

              color={theme.icon}
            />
          </TouchableOpacity>

          <Text style={styles.title}>Restaurants Cart</Text>

          <View
            style={{
              width: 34,
            }}
          />
        </View>

        {/* LIST */}

        <ScrollView style={styles.restaurantList}>
          {branches.map(([branchId, items]: any) => {
            const firstItem = items?.[0];

            const itemCount = items.length;

            const calculation = calculations[Number(branchId)];

            const isCalculating = !calculation;

            const branchTotal = getBranchTotal(items);

            const serviceFeePercent = Number(
              calculation?.service_fee_percent ?? 0,
            );

            const serviceFee = (branchTotal * serviceFeePercent) / 100;

            const grandTotal =
              branchTotal +
              Number(calculation?.delivery_price ?? 0) +
              serviceFee -
              Number(calculation?.discount_total ?? 0);

            const deliveryFee = calculation?.delivery_price ?? 0;

            const restaurantName =
              firstItem?.business_name ||
              firstItem?.product_name ||
              `Branch #${branchId}`;

            return (
              <Swipeable
                key={branchId}

                renderRightActions={() => renderRightActions(branchId)}
              >
                <TouchableOpacity
                  activeOpacity={isCalculating ? 1 : 0.8}

                  disabled={isCalculating}

                  onPress={() => openBranch(branchId)}

                  style={[
                    styles.restaurantCartItem,

                    isCalculating && {
                      opacity: 0.6,
                    },
                  ]}
                >
                  {firstItem?.image ? (
                    <Image
                      source={{
                        uri: firstItem.image,
                      }}

                      style={styles.restaurantImageBox}
                    />
                  ) : (
                    <View style={styles.restaurantImageBox}>
                      <IconSymbol
                        name="StoreIcon"

                        size={48}

                        color={theme.textSecondary}
                      />
                    </View>
                  )}

                  <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{restaurantName}</Text>

                    <Text style={styles.restaurantSubtext}>45 - 60min</Text>

                    <Text style={styles.restaurantSubtext}>
                      {itemCount} items
                    </Text>

                    {deliveryFee > 0 && (
                      <Text style={styles.restaurantSubtext}>
                        Delivery: ₦{deliveryFee.toLocaleString("en-NG")}
                      </Text>
                    )}
                  </View>

                  <View
                    style={{
                      alignItems: "flex-end",
                    }}
                  >
                    {isCalculating ? (
                      <ActivityIndicator
                        size="small"

                        color={theme.primary}
                      />
                    ) : (
                      <Text style={styles.restaurantPrice}>
                        ₦{grandTotal.toLocaleString("en-NG")}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </Swipeable>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.feesInfoButton}

          onPress={() => setShowFees(true)}
        >
          <IconSymbol
            name="InfoCircleIcon"

            size={16}

            color={theme.icon}
          />

          <Text style={styles.feesInfoText}>Fees Information</Text>
        </TouchableOpacity>
      </View>

      <FeeInformation
        visible={showFees}

        onClose={() => setShowFees(false)}

        processingFee={0}

        serviceFee={totalServiceFee}

        deliveryFee={totalProcessingFee}

        weatherFees={0}
      />
    </>
  );
};

export default RestaurantCartScreen;
