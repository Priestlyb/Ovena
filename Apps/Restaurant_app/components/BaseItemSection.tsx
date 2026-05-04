import { CustomInput } from "@/components/CustomInput";
import { CustomSwitch } from "@/components/CustomSwitch";
import React from "react";
import { Text, View } from "react-native";

/* ================================
   TYPES
================================ */
type BaseItemSectionProps = {
  useMergeBase: boolean;
  setUseMergeBase: (value: boolean) => void;

  manualBaseName: string;
  setManualBaseName: (value: string) => void;

  manualBaseDescription: string;
  setManualBaseDescription: (value: string) => void;

  manualBasePrice: string;
  setManualBasePrice: (value: string) => void;

  formatPrice: (value: string) => string;
};

/* ================================
   COMPONENT
================================ */
export const BaseItemSection: React.FC<BaseItemSectionProps> = ({
  useMergeBase,
  setUseMergeBase,
  manualBaseName,
  setManualBaseName,
  manualBaseDescription,
  setManualBaseDescription,
  manualBasePrice,
  setManualBasePrice,
  formatPrice,
}) => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <CustomSwitch
          label="Merge with Base Item"
          value={useMergeBase}
          onValueChange={setUseMergeBase}
        />
      </View>

      {useMergeBase ? (
        <Text
          style={{
            marginBottom: 25,
            padding: 15,
            backgroundColor: "#FF8C42",
            borderRadius: 10,
            color: "#000000",
            fontWeight: "500",
          }}
        >
          N/B: Base item will match the custom item
        </Text>
      ) : (
        <>
          <CustomInput
            placeholder="Base Item Name"
            label="Base Item Name"
            value={manualBaseName}
            onChange={setManualBaseName}
          />

          <CustomInput
            placeholder="Base Item Description"
            label="Base Item Description"
            value={manualBaseDescription}
            onChange={setManualBaseDescription}
          />

          <CustomInput
            type="currency"
            placeholder="Base Item Price"
            label="Base Item Price"
            value={manualBasePrice}
            onChange={(val) => setManualBasePrice(formatPrice(val))}
          />
        </>
      )}
    </>
  );
};
