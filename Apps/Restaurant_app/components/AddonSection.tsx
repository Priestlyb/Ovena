import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Trash2 } from "lucide-react-native";

import { CustomInput } from "@/components/CustomInput";
import { CustomSwitch } from "@/components/CustomSwitch";
import { styles } from "@/constants/styles";
import { AddonImagePicker } from "./AddonImagePicker";

/* =========================================
   TYPES
========================================= */
type AddonImage = {
  uri: string;
  uploadedUrl?: string;
} | null;

type Addon = {
  id?: number;
  base_item_id?: number;
  name: string;
  description: string;
  price: string;
  image: AddonImage;
};

type AddonGroup = {
  id?: number;
  name: string;
  is_required: boolean;
  max_selection: number | string;
  addons: Addon[];
};

type Props = {
  addonGroups: AddonGroup[];
  setAddonGroups: React.Dispatch<React.SetStateAction<AddonGroup[]>>;

  deleteAddon: (groupIndex: number, addonIndex: number) => void | Promise<void>;

  addAddonGroup: () => void;
  addAddon: (index: number) => void;

  formatPrice: (val: string) => string;

  onPickAddonImage: (groupIndex: number, addonIndex: number) => void;

  hasPendingAddonImageChange: (
    groupIndex: number,
    addonIndex: number,
  ) => boolean;

  cancelAddonImageChange: (groupIndex: number, addonIndex: number) => void;

  uploadProgress: number;
};

/* =========================================
   COMPONENT
========================================= */
export const AddonSection: React.FC<Props> = ({
  addonGroups,
  setAddonGroups,
  deleteAddon,
  addAddonGroup,
  addAddon,
  formatPrice,
  onPickAddonImage,
  hasPendingAddonImageChange,
  cancelAddonImageChange,
  uploadProgress,
}) => {
  /* =========================================
     DELETE GROUP (LOCAL ONLY)
  ========================================= */
  const deleteAddonGroup = (index: number) => {
    setAddonGroups((prev) => prev.filter((_, i) => i !== index));
  };

  /* =========================================
     UPDATE GROUP FIELD
  ========================================= */
  const updateGroupField = <K extends keyof AddonGroup>(
    groupIndex: number,
    field: K,
    value: AddonGroup[K],
  ) => {
    setAddonGroups((prev) =>
      prev.map((group, i) =>
        i === groupIndex ? { ...group, [field]: value } : group,
      ),
    );
  };

  /* =========================================
     UPDATE ADDON FIELD
  ========================================= */
  const updateAddonField = <K extends keyof Addon>(
    groupIndex: number,
    addonIndex: number,
    field: K,
    value: Addon[K],
  ) => {
    setAddonGroups((prev) =>
      prev.map((group, i) => {
        if (i !== groupIndex) return group;

        return {
          ...group,
          addons: group.addons.map((addon, j) =>
            j === addonIndex ? { ...addon, [field]: value } : addon,
          ),
        };
      }),
    );
  };

  return (
    <>
      <Text style={[styles.pageTitle, { marginTop: 50 }]}>Add-ons</Text>

      {addonGroups.map((group, i) => (
        <View key={group.id ?? i}>
          {/* GROUP HEADER */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 25,
              marginBottom: 25,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>Group Name</Text>

            <TouchableOpacity onPress={() => deleteAddonGroup(i)}>
              <Trash2 color="red" size={20} />
            </TouchableOpacity>
          </View>

          {/* GROUP NAME */}
          <CustomInput
            placeholder="Group Name"
            value={group.name}
            onChange={(val) => updateGroupField(i, "name", val)}
          />

          {/* REQUIRED */}
          <CustomSwitch
            label="Required?"
            value={group.is_required}
            onValueChange={(val) => updateGroupField(i, "is_required", val)}
          />

          {/* MAX SELECTION */}
          <CustomInput
            placeholder="Max selection"
            type="number"
            value={String(group.max_selection)}
            onChange={(val) => updateGroupField(i, "max_selection", val)}
          />

          {/* ADDONS */}
          {group.addons.map((addon, j) => (
            <View
              key={addon.id ?? j}
              style={{
                marginTop: 14,
                borderWidth: 1,
                borderColor: "#eee",
                borderRadius: 12,
              }}
            >
              {/* IMAGE PICKER */}
              <AddonImagePicker
                value={addon.image?.uri || null}
                onPress={() => onPickAddonImage(i, j)}
                hasPendingChange={hasPendingAddonImageChange(i, j)}
                onCancel={() => cancelAddonImageChange(i, j)}
                isUploading={uploadProgress > 0}
              />

              {/* NAME + PRICE */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  marginVertical: 20,
                  padding: 10,
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <CustomInput
                    placeholder="Addon name"
                    value={addon.name}
                    onChange={(val) => updateAddonField(i, j, "name", val)}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <CustomInput
                    type="currency"
                    placeholder="₦0.00"
                    value={addon.price}
                    onChange={(val) =>
                      updateAddonField(i, j, "price", formatPrice(val))
                    }
                  />
                </View>

                <TouchableOpacity onPress={() => deleteAddon(i, j)}>
                  <Trash2 color="red" size={18} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* ADD ADDON */}
          <TouchableOpacity onPress={() => addAddon(i)}>
            <Text
              style={{
                marginVertical: 50,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              + Add Add-on
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* ADD GROUP */}
      <TouchableOpacity onPress={addAddonGroup}>
        <Text
          style={{
            fontSize: 16,
            backgroundColor: "#000",
            padding: 15,
            color: "#fff",
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
