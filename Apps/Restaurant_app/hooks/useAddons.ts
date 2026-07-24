import { useState } from "react";

/* =========================================
   ADDON TYPE (UI ONLY)
========================================= */
export type Addon = {
  name: string;
  description: string;
  price: string;

  image: {
    uri: string;
    uploadedUrl?: string;
  } | null;
};

/* =========================================
   ADDON GROUP TYPE
========================================= */
export type AddonGroup = {
  name: string;
  is_required: boolean;
  max_selection: number | string;
  addons: Addon[];
};

/* =========================================
   HOOK
========================================= */
export const useAddons = () => {
  const [addonGroups, setAddonGroups] = useState<AddonGroup[]>([]);

  /* =========================================
     ADD GROUP
  ========================================= */
  const addAddonGroup = () => {
    setAddonGroups((prev) => [
      ...prev,
      {
        name: "",
        is_required: false,
        max_selection: 0,
        addons: [],
      },
    ]);
  };

  /* =========================================
     ADD ADDON
  ========================================= */
  const addAddon = (groupIndex: number) => {
    setAddonGroups((prev) =>
      prev.map((group, idx) =>
        idx === groupIndex
          ? {
              ...group,
              addons: [
                ...group.addons,
                {
                  name: "",
                  description: "",
                  price: "0.00",
                  image: null,
                },
              ],
            }
          : group
      )
    );
  };

  /* =========================================
     UPDATE ADDON FIELD
  ========================================= */
  const updateAddonField = <
    K extends keyof Addon
  >(
    groupIndex: number,
    addonIndex: number,
    field: K,
    value: Addon[K]
  ) => {
    setAddonGroups((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIndex) return group;

        return {
          ...group,
          addons: group.addons.map((addon, aIdx) =>
            aIdx === addonIndex
              ? {
                  ...addon,
                  [field]: value,
                }
              : addon
          ),
        };
      })
    );
  };

  /* =========================================
     UPDATE GROUP FIELD
  ========================================= */
  const updateGroupField = <
    K extends keyof AddonGroup
  >(
    index: number,
    field: K,
    value: AddonGroup[K]
  ) => {
    setAddonGroups((prev) =>
      prev.map((group, idx) =>
        idx === index
          ? {
              ...group,
              [field]: value,
            }
          : group
      )
    );
  };

  return {
    addonGroups,
    setAddonGroups,

    addAddonGroup,
    addAddon,

    updateAddonField,
    updateGroupField,
  };
};