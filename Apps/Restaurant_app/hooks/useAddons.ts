import { useState } from "react";

export type Addon = {
  name: string;
  price: string;
};

export type AddonGroup = {
  name: string;
  is_required: boolean;
  max_selection: string;
  addons: Addon[];
};

export const useAddons = () => {
  const [addonGroups, setAddonGroups] = useState<AddonGroup[]>([]);

  const addAddonGroup = () => {
    setAddonGroups((prev) => [
      ...prev,
      { name: "", is_required: false, max_selection: "", addons: [] },
    ]);
  };

  const addAddon = (index: number) => {
    setAddonGroups((prev) => {
      const updated = [...prev];
      updated[index].addons.push({ name: "", price: "0.00" });
      return updated;
    });
  };

  return {
    addonGroups,
    setAddonGroups,
    addAddonGroup,
    addAddon,
  };
};