import React from "react";
import { View, Text } from "react-native";

type Props = {
  breakdown: any;
  styles: any;
};

const OrderSummary = ({ breakdown, styles }: Props) => {
  return (
    <View style={styles.summaryBox}>
      <Text style={styles.summaryTitle}>Order Summary</Text>

      {/* ================= BASE ================= */}

      <View style={styles.row}>
        <Text style={styles.summaryText}>Base</Text>

        <Text style={styles.summaryText}>
          ₦{breakdown.baseSubtotal.toLocaleString("en-NG")}
        </Text>
      </View>

      {/* ================= VARIANTS ================= */}

      {breakdown.variantLines.length > 0 && (
        <View style={styles.sectionSpacing}>
          <Text style={styles.summaryTitle}>Selected Variants</Text>

          {breakdown.variantLines.map((variant: any, index: number) => (
            <View key={`${variant.id}-${index}`} style={styles.row}>
              <Text style={styles.summaryText}>
                {variant.group}: {variant.name}
              </Text>

              <Text style={styles.summaryText}>
                {variant.price >= 0 ? "+" : ""}₦
                {variant.price.toLocaleString("en-NG")}
              </Text>
            </View>
          ))}

          <View style={styles.row}>
            <Text style={styles.summaryText}>Variant SubTotal</Text>

            <Text style={styles.summaryText}>
              ₦{breakdown.variantSubtotal.toLocaleString("en-NG")}
            </Text>
          </View>
        </View>
      )}

      {/* ================= ADDONS ================= */}

      <View style={styles.sectionSpacing}>
        <Text style={styles.summaryTitle}>Add-ons</Text>

        {breakdown.addonLines.length > 0 ? (
          breakdown.addonLines.map((addon: any, index: number) => (
            <View key={`${addon.id}-${index}`} style={styles.row}>
              <Text style={styles.summaryText}>
                {addon.name} ({addon.qty})
              </Text>

              <Text style={styles.summaryText}>
                ₦{addon.total.toLocaleString("en-NG")}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.summaryText}>No add-ons selected</Text>
        )}

        <View style={styles.row}>
          <Text style={styles.summaryText}>Add-ons SubTotal</Text>

          <Text style={styles.summaryText}>
            ₦{breakdown.addonSubtotal.toLocaleString("en-NG")}
          </Text>
        </View>
      </View>

      {/* ================= TOTAL ================= */}

      <View style={[styles.row, styles.finalRow]}>
        <Text style={styles.totalText}>Total</Text>

        <Text style={styles.totalText}>
          ₦{breakdown.total.toLocaleString("en-NG")}
        </Text>
      </View>
    </View>
  );
};

export default OrderSummary;
