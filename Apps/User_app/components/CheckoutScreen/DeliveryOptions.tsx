import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { IconSymbol, type IconName } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/theme";

type DeliveryType = "pickup" | "delivery";

interface DeliveryOptionProps {
  selected: DeliveryType;
  onChange: (value: DeliveryType) => void;
  deliveryFee?: number;
}

const OptionItem = ({
  label,
  subLabel,
  iconName,
  selected,
  onPress,
}: {
  label: string;
  subLabel: string;
  iconName: IconName;
  selected: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.optionItem,
        {
          backgroundColor: theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        },
        selected && {
          backgroundColor: `${theme.primary}15`,
        },
      ]}
    >
      <IconSymbol
        name={iconName}
        size={22}
        color={selected ? theme.primary : theme.icon}
      />

      <Text
        style={[
          styles.optionValue,
          {
            color: theme.textPrimary,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.optionLabel,
          {
            color: theme.textSecondary,
          },
        ]}
      >
        {subLabel}
      </Text>
    </TouchableOpacity>
  );
};

export const DeliveryOptions: React.FC<DeliveryOptionProps> = ({
  selected,
  onChange,
  deliveryFee = 1000,
}) => {
  return (
    <View style={styles.container}>
      {/* PICKUP */}
      <OptionItem
        label="Pickup"
        subLabel="No extra charge"
        iconName="StoreIcon"
        selected={selected === "pickup"}
        onPress={() => onChange("pickup")}
      />

      {/* DELIVERY */}
      <OptionItem
        label="Delivery"
        subLabel={`Minimum of ₦${deliveryFee.toLocaleString("en-NG")}`}
        iconName="BikeIcon"
        selected={selected === "delivery"}
        onPress={() => onChange("delivery")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginVertical: 20,
  },

  optionItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },

  optionValue: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6,
  },

  optionLabel: {
    fontSize: 11,
    marginTop: 2,
    textAlign: "center",
  },
});
