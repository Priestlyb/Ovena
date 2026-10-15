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
  id?: number;
  name: string;
  price_diff: string;
};

type VariantGroup = {
  id?: number;
  name: string;
  is_required: boolean;
  options: VariantOption[];
};

type VariantSectionProps = {
  variantGroups: VariantGroup[];
  setVariantGroups: React.Dispatch<React.SetStateAction<VariantGroup[]>>;
  deleteVariantOption: (
    groupIndex: number,
    optionIndex: number,
  ) => void | Promise<void>;
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
  deleteVariantOption,
  formatPrice,
}) => {
  /* ================================
     DELETE GROUP (LOCAL ONLY)
  ================================= */

  const deleteVariantGroup = (index: number) => {
    setVariantGroups((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================================
     UPDATE HELPERS
  ================================= */

  const updateGroupField = <K extends keyof VariantGroup>(
    index: number,
    field: K,
    value: VariantGroup[K],
  ) => {
    setVariantGroups((prev) =>
      prev.map((group, i) =>
        i === index ? { ...group, [field]: value } : group,
      ),
    );
  };

  const updateOptionField = <K extends keyof VariantOption>(
    groupIndex: number,
    optionIndex: number,
    field: K,
    value: VariantOption[K],
  ) => {
    setVariantGroups((prev) =>
      prev.map((group, i) => {
        if (i !== groupIndex) return group;

        return {
          ...group,
          options: group.options.map((opt, j) =>
            j === optionIndex ? { ...opt, [field]: value } : opt,
          ),
        };
      }),
    );
  };

  return (
    <>
      <Text style={[styles.pageTitle, { marginTop: 50 }]}>Variants</Text>

      {variantGroups.map((group, i) => (
        <View key={group.id ?? i}>
          {/* HEADER */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 25,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginVertical: 25,
              }}
            >
              Group Name
            </Text>

            <TouchableOpacity onPress={() => deleteVariantGroup(i)}>
              <Trash2 color="red" size={20} />
            </TouchableOpacity>
          </View>

          {/* GROUP NAME */}
          <CustomInput
            placeholder="Group Name"
            value={group.name}
            onChange={(val) => updateGroupField(i, "name", val)}
          />

          {/* REQUIRED SWITCH */}
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
              onValueChange={(val) => updateGroupField(i, "is_required", val)}
            />
          </View>

          {/* OPTIONS */}
          {group.options.map((opt, j) => (
            <View
              key={opt.id ?? j}
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
                  onChange={(val) => updateOptionField(i, j, "name", val)}
                />
              </View>

              <View style={{ flex: 1 }}>
                <CustomInput
                  type="currency"
                  placeholder="₦0.00"
                  value={opt.price_diff}
                  onChange={(val) =>
                    updateOptionField(
                      i,
                      j,
                      "price_diff",
                      formatPrice(val).replace(/,/g, ""),
                    )
                  }
                />
              </View>

              <TouchableOpacity onPress={() => deleteVariantOption(i, j)}>
                <Trash2 color="red" size={18} />
              </TouchableOpacity>
            </View>
          ))}

          {/* ADD OPTION */}
          <TouchableOpacity onPress={() => addVariantOption(i)}>
            <Text
              style={{
                marginVertical: 50,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              + Add Option
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* ADD GROUP */}
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
