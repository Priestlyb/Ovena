import { CustomInput } from "@/components/CustomInput";
import { CustomSwitch } from "@/components/CustomSwitch";
import { styles } from "@/constants/styles";
import { AddonGroup } from "@/types/menu-items";
import { Trash2 } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  addonGroups: AddonGroup[];
  setAddonGroups: React.Dispatch<React.SetStateAction<AddonGroup[]>>;
  addAddonGroup: () => void;
  addAddon: (index: number) => void;
  formatPrice: (val: string) => string;
};

export const AddonSection: React.FC<Props> = ({
  addonGroups,
  setAddonGroups,
  addAddonGroup,
  addAddon,
  formatPrice,
}) => {
  /* ================================
     DELETE HANDLERS
  ================================= */

  const deleteAddonGroup = (index: number) => {
    setAddonGroups((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteAddon = (groupIndex: number, addonIndex: number) => {
    setAddonGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex].addons = updated[groupIndex].addons.filter(
        (_, i) => i !== addonIndex,
      );
      return updated;
    });
  };

  return (
    <>
      <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>Add-ons</Text>

      {addonGroups.map((group, i) => (
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

            <TouchableOpacity onPress={() => deleteAddonGroup(i)}>
              <Trash2 color="red" size={20} />
            </TouchableOpacity>
          </View>

          <CustomInput
            placeholder="Group Name"
            value={group.name}
            onChange={(val) => {
              const updated = [...addonGroups];
              updated[i].name = val;
              setAddonGroups(updated);
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
                const updated = [...addonGroups];
                updated[i].is_required = val;
                setAddonGroups(updated);
              }}
            />
          </View>

          {group.addons.map((addon, j) => (
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
                  placeholder="Addon (e.g. Cheese)"
                  value={addon.name}
                  onChange={(val) => {
                    const updated = [...addonGroups];
                    updated[i].addons[j].name = val;
                    setAddonGroups(updated);
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <CustomInput
                  type="currency"
                  placeholder="₦0.00"
                  value={addon.price}
                  onChange={(val) => {
                    const updated = [...addonGroups];
                    updated[i].addons[j].price = formatPrice(val);
                    setAddonGroups(updated);
                  }}
                />
              </View>

              {/* DELETE ADDON */}
              <TouchableOpacity onPress={() => deleteAddon(i, j)}>
                <Trash2 color="red" size={18} />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity onPress={() => addAddon(i)}>
            <Text
              style={{ marginVertical: 30, fontWeight: "600", fontSize: 16 }}
            >
              + Add Add-on
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={addAddonGroup}>
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
          + Add Add-on Group
        </Text>
      </TouchableOpacity>
    </>
  );
};
