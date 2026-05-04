import { CustomInput } from "@/components/CustomInput";
import { CustomSwitch } from "@/components/CustomSwitch";
import { styles } from "@/constants/styles";
import { Trash2 } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

/* ================================
   TYPES
================================ */
type VariantOption = {
  name: string;
  price_diff: string;
};

type VariantGroup = {
  name: string;
  is_required: boolean;
  options: VariantOption[];
};

type VariantSectionProps = {
  variantGroups: VariantGroup[];
  setVariantGroups: React.Dispatch<React.SetStateAction<VariantGroup[]>>;
  addVariantGroup: () => void;
  addVariantOption: (index: number) => void;
  formatPrice: (value: string) => string;
};

/* ================================
   COMPONENT
================================ */
export const VariantSection: React.FC<VariantSectionProps> = ({
  variantGroups,
  setVariantGroups,
  addVariantGroup,
  addVariantOption,
  formatPrice,
}) => {
  /* ================================
     DELETE HANDLERS
  ================================= */

  const deleteVariantGroup = (index: number) => {
    setVariantGroups((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteVariantOption = (groupIndex: number, optionIndex: number) => {
    setVariantGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex].options = updated[groupIndex].options.filter(
        (_, i) => i !== optionIndex,
      );
      return updated;
    });
  };

  return (
    <>
      <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>Variants</Text>

      {variantGroups.map((group, i) => (
        <View key={i}>
          {/* HEADER WITH DELETE GROUP */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 25,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "600", marginVertical: 25 }}
            >
              Group Name
            </Text>

            <TouchableOpacity onPress={() => deleteVariantGroup(i)}>
              <Trash2 color="red" size={20} />
            </TouchableOpacity>
          </View>

          <CustomInput
            placeholder="Group Name"
            value={group.name}
            onChange={(val) => {
              const updated = [...variantGroups];
              updated[i].name = val;
              setVariantGroups(updated);
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <CustomSwitch
              label="Required?"
              value={group.is_required}
              onValueChange={(val) => {
                const updated = [...variantGroups];
                updated[i].is_required = val;
                setVariantGroups(updated);
              }}
            />
          </View>

          {group.options.map((opt, j) => (
            <View
              key={j}
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <CustomInput
                  placeholder="Option (e.g. Large)"
                  value={opt.name}
                  onChange={(val) => {
                    const updated = [...variantGroups];
                    updated[i].options[j].name = val;
                    setVariantGroups(updated);
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <CustomInput
                  type="currency"
                  placeholder="₦0.00"
                  value={opt.price_diff}
                  onChange={(val) => {
                    const updated = [...variantGroups];
                    updated[i].options[j].price_diff = formatPrice(val);
                    setVariantGroups(updated);
                  }}
                />
              </View>

              {/* DELETE OPTION */}
              <TouchableOpacity onPress={() => deleteVariantOption(i, j)}>
                <Trash2 color="red" size={18} />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity onPress={() => addVariantOption(i)}>
            <Text
              style={{ marginVertical: 30, fontWeight: "600", fontSize: 16 }}
            >
              + Add Option
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={addVariantGroup}>
        <Text
          style={{
            fontSize: 16,
            backgroundColor: "#000000",
            padding: 15,
            color: "#ffffff",
            fontWeight: "600",
            textAlign: "center",
            borderRadius: 25,
          }}
        >
          + Add Variant Group
        </Text>
      </TouchableOpacity>
    </>
  );
};
